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
  const { title, content, category_id } = await c.req.json()

  if (!title?.trim()) return c.json({ error: 'Title is required' }, 400)
  if (title.length > 255) return c.json({ error: 'Title too long (max 255 chars)' }, 400)
  if (content && content.length > 50000) return c.json({ error: 'Content too long (max 50000 chars)' }, 400)

  const result = await pool.query(
    'INSERT INTO notes (user_id, category_id, title, content) VALUES ($1, $2, $3, $4) RETURNING *',
    [userId, category_id ?? null, title.trim(), content?.trim() ?? '']
  )
  return c.json(result.rows[0], 201)
})

notes.put('/:id', async (c) => {
  const userId = c.get('userId')
  const id = c.req.param('id')
  const { title, content, category_id } = await c.req.json()

  if (!title?.trim()) return c.json({ error: 'Title is required' }, 400)
  if (title.length > 255) return c.json({ error: 'Title too long (max 255 chars)' }, 400)
  if (content && content.length > 50000) return c.json({ error: 'Content too long (max 50000 chars)' }, 400)

  const result = await pool.query(
    `UPDATE notes SET title=$1, content=$2, category_id=$3, updated_at=NOW()
     WHERE id=$4 AND user_id=$5 RETURNING *`,
    [title.trim(), content?.trim() ?? '', category_id ?? null, id, userId]
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
