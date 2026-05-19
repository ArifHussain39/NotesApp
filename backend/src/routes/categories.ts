import { Hono } from 'hono'
import { pool } from '../db'
import { authMiddleware } from '../middleware/auth'
import type { AppEnv } from '../types'

const categories = new Hono<AppEnv>()
categories.use('*', authMiddleware)

categories.get('/', async (c) => {
  const userId = c.get('userId')
  const result = await pool.query(
    'SELECT * FROM categories WHERE user_id = $1 ORDER BY created_at ASC',
    [userId]
  )
  return c.json(result.rows)
})

categories.post('/', async (c) => {
  const userId = c.get('userId')
  const { name } = await c.req.json()
  if (!name?.trim()) return c.json({ error: 'Name required' }, 400)
  if (name.length > 100) return c.json({ error: 'Name too long (max 100 chars)' }, 400)
  const result = await pool.query(
    'INSERT INTO categories (user_id, name) VALUES ($1, $2) RETURNING *',
    [userId, name.trim()]
  )
  return c.json(result.rows[0], 201)
})

categories.put('/:id', async (c) => {
  const userId = c.get('userId')
  const id = c.req.param('id')
  const { name } = await c.req.json()
  if (!name?.trim()) return c.json({ error: 'Name required' }, 400)
  if (name.length > 100) return c.json({ error: 'Name too long' }, 400)
  const result = await pool.query(
    'UPDATE categories SET name=$1 WHERE id=$2 AND user_id=$3 RETURNING *',
    [name.trim(), id, userId]
  )
  if (result.rowCount === 0) return c.json({ error: 'Not found' }, 404)
  return c.json(result.rows[0])
})

categories.delete('/:id', async (c) => {
  const userId = c.get('userId')
  const id = c.req.param('id')
  const result = await pool.query(
    'DELETE FROM categories WHERE id=$1 AND user_id=$2',
    [id, userId]
  )
  if (result.rowCount === 0) return c.json({ error: 'Not found' }, 404)
  return c.json({ success: true })
})

export default categories
