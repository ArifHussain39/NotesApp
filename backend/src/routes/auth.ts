import { Hono } from 'hono'
import { sign } from 'hono/jwt'
import { pool } from '../db'

const auth = new Hono()

auth.post('/register', async (c) => {
  const { email, password } = await c.req.json()
  if (!email || !password) return c.json({ error: 'Email and password required' }, 400)

  const hashed = await Bun.password.hash(password)
  try {
    const result = await pool.query(
      'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email',
      [email, hashed]
    )
    const user = result.rows[0]
    const token = await sign({ sub: user.id, email: user.email }, process.env.JWT_SECRET!, 'HS256')
    return c.json({ token, user: { id: user.id, email: user.email } }, 201)
  } catch (e: any) {
    if (e.code === '23505') return c.json({ error: 'Email already exists' }, 409)
    return c.json({ error: 'Server error' }, 500)
  }
})

auth.post('/login', async (c) => {
  const { email, password } = await c.req.json()
  if (!email || !password) return c.json({ error: 'Email and password required' }, 400)

  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email])
    const user = result.rows[0]
    if (!user) return c.json({ error: 'Invalid credentials' }, 401)

    const valid = await Bun.password.verify(password, user.password)
    if (!valid) return c.json({ error: 'Invalid credentials' }, 401)

    const token = await sign({ sub: user.id, email: user.email }, process.env.JWT_SECRET!, 'HS256')
    return c.json({ token, user: { id: user.id, email: user.email } })
  } catch {
    return c.json({ error: 'Server error' }, 500)
  }
})

export default auth
