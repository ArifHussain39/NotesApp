import { createMiddleware } from 'hono/factory'
import { verify } from 'hono/jwt'
import { eq } from 'drizzle-orm'
import { db } from '../db'
import { users } from '../schema'
import type { AppEnv } from '../types'

export const authMiddleware = createMiddleware<AppEnv>(async (c, next) => {
  const auth = c.req.header('Authorization')
  if (!auth || !auth.startsWith('Bearer ')) {
    return c.json({ error: 'Unauthorized' }, 401)
  }
  const token = auth.slice(7)
  try {
    const payload = await verify(token, process.env.JWT_SECRET!, 'HS256')

    // Check token version — invalidates all tokens issued before last logout
    const [user] = await db.select({ token_version: users.token_version })
      .from(users)
      .where(eq(users.id, payload.sub as number))
    if (!user || (payload.version as number) !== user.token_version) {
      return c.json({ error: 'Token revoked' }, 401)
    }

    c.set('userId', payload.sub as number)
    await next()
  } catch {
    return c.json({ error: 'Invalid token' }, 401)
  }
})
