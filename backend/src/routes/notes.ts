import { Hono } from 'hono'
import { pool } from '../db'
import { authMiddleware } from '../middleware/auth'
import type { AppEnv } from '../types'

const notes = new Hono<AppEnv>()
notes.use('*', authMiddleware)

notes.get('/', async (c) => {
  const userId = c.get('userId')
  const result = await pool.query(
    'SELECT * FROM notes WHERE user_id = $1 ORDER BY updated_at DESC',
    [userId]
  )
  return c.json(result.rows)
})

notes.post('/', async (c) => {
  const userId = c.get('userId')
  const { title, content } = await c.req.json()
  const result = await pool.query(
    'INSERT INTO notes (user_id, title, content) VALUES ($1, $2, $3) RETURNING *',
    [userId, title ?? '', content ?? '']
  )
  return c.json(result.rows[0], 201)
})

notes.put('/:id', async (c) => {
  const userId = c.get('userId')
  const id = c.req.param('id')
  const { title, content } = await c.req.json()
  const result = await pool.query(
    'UPDATE notes SET title=$1, content=$2, updated_at=NOW() WHERE id=$3 AND user_id=$4 RETURNING *',
    [title, content, id, userId]
  )
  if (result.rowCount === 0) return c.json({ error: 'Not found' }, 404)
  return c.json(result.rows[0])
})

notes.delete('/:id', async (c) => {
  const userId = c.get('userId')
  const id = c.req.param('id')
  const result = await pool.query(
    'DELETE FROM notes WHERE id=$1 AND user_id=$2',
    [id, userId]
  )
  if (result.rowCount === 0) return c.json({ error: 'Not found' }, 404)
  return c.json({ success: true })
})

export default notes
