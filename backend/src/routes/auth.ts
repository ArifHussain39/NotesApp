import { Hono } from 'hono'
import { sign, verify } from 'hono/jwt'
import { createMiddleware } from 'hono/factory'
import { pool } from '../db'
import { authMiddleware } from '../middleware/auth'

const auth = new Hono()

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const JWT_EXP_SECS = 60 * 60 * 24 * 7 // 7 days

function makeToken(id: number, email: string, version: number) {
  return sign(
    { sub: id, email, version, exp: Math.floor(Date.now() / 1000) + JWT_EXP_SECS },
    process.env.JWT_SECRET!,
    'HS256'
  )
}

// Simple in-memory rate limiter: 10 requests per 15 minutes per IP
const rateMap = new Map<string, { count: number; reset: number }>()
const authRateLimit = createMiddleware(async (c, next) => {
  const ip = c.req.header('x-forwarded-for') ?? c.req.header('x-real-ip') ?? 'unknown'
  const now = Date.now()
  const window = 15 * 60 * 1000
  const entry = rateMap.get(ip)

  if (!entry || now > entry.reset) {
    rateMap.set(ip, { count: 1, reset: now + window })
  } else {
    entry.count++
    if (entry.count > 10) {
      return c.json({ error: 'Too many requests, try again later' }, 429)
    }
  }
  await next()
})

auth.use('*', authRateLimit)

auth.post('/register', async (c) => {
  const { email, password } = await c.req.json()

  if (!email || !password) return c.json({ error: 'Email and password required' }, 400)
  if (!EMAIL_RE.test(email)) return c.json({ error: 'Invalid email format' }, 400)
  if (password.length < 8) return c.json({ error: 'Password must be at least 8 characters' }, 400)
  if (password.length > 128) return c.json({ error: 'Password too long' }, 400)

  const hashed = await Bun.password.hash(password)
  try {
    const result = await pool.query(
      'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email, token_version',
      [email.toLowerCase().trim(), hashed]
    )
    const user = result.rows[0]
    const token = await makeToken(user.id, user.email, user.token_version)
    return c.json({ token, user: { id: user.id, email: user.email } }, 201)
  } catch (e: any) {
    if (e.code === '23505') return c.json({ error: 'Email already exists' }, 409)
    return c.json({ error: 'Server error' }, 500)
  }
})

auth.post('/login', async (c) => {
  const { email, password } = await c.req.json()

  if (!email || !password) return c.json({ error: 'Email and password required' }, 400)
  if (!EMAIL_RE.test(email)) return c.json({ error: 'Invalid email format' }, 400)

  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email.toLowerCase().trim()])
    const user = result.rows[0]
    if (!user) return c.json({ error: 'Invalid credentials' }, 401)

    const valid = await Bun.password.verify(password, user.password)
    if (!valid) return c.json({ error: 'Invalid credentials' }, 401)

    const token = await makeToken(user.id, user.email, user.token_version)
    return c.json({ token, user: { id: user.id, email: user.email } })
  } catch {
    return c.json({ error: 'Server error' }, 500)
  }
})

auth.post('/logout', authMiddleware as any, async (c) => {
  const userId = (c as any).get('userId')
  await pool.query(
    'UPDATE users SET token_version = token_version + 1 WHERE id = $1',
    [userId]
  )
  return c.json({ success: true })
})

auth.get('/me', async (c) => {
  const authHeader = c.req.header('Authorization')
  if (!authHeader?.startsWith('Bearer ')) return c.json({ error: 'Unauthorized' }, 401)

  try {
    const payload = await verify(authHeader.slice(7), process.env.JWT_SECRET!, 'HS256')
    const result = await pool.query('SELECT id, email, created_at FROM users WHERE id = $1', [payload.sub])
    if (!result.rows[0]) return c.json({ error: 'User not found' }, 404)
    return c.json({ user: result.rows[0] })
  } catch {
    return c.json({ error: 'Invalid token' }, 401)
  }
})

export default auth
