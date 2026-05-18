import { createMiddleware } from 'hono/factory'
import { verify } from 'hono/jwt'
import type { AppEnv } from '../types'

export const authMiddleware = createMiddleware<AppEnv>(async (c, next) => {
  const auth = c.req.header('Authorization')
  if (!auth || !auth.startsWith('Bearer ')) {
    return c.json({ error: 'Unauthorized' }, 401)
  }
  const token = auth.slice(7)
  try {
    const payload = await verify(token, process.env.JWT_SECRET!, 'HS256')
    c.set('userId', payload.sub as number)
    await next()
  } catch {
    return c.json({ error: 'Invalid token' }, 401)
  }
})
