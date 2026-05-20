import { Hono } from 'hono'
import { eq, and, desc } from 'drizzle-orm'
import { db } from '../db'
import { notes as notesTable } from '../schema'
import { authMiddleware } from '../middleware/auth'
import type { AppEnv } from '../types'

const notes = new Hono<AppEnv>()
notes.use('*', authMiddleware)

notes.get('/', async (c) => {
  const userId = c.get('userId')
  const result = await db.select().from(notesTable)
    .where(eq(notesTable.user_id, userId))
    .orderBy(desc(notesTable.updated_at))
  return c.json(result)
})

notes.post('/', async (c) => {
  const userId = c.get('userId')
  const { title, content, category_id } = await c.req.json()

  if (!title?.trim()) return c.json({ error: 'Title is required' }, 400)
  if (title.length > 255) return c.json({ error: 'Title too long (max 255 chars)' }, 400)
  if (content && content.length > 50000) return c.json({ error: 'Content too long (max 50000 chars)' }, 400)

  const [note] = await db.insert(notesTable).values({
    user_id: userId,
    category_id: category_id ?? null,
    title: title.trim(),
    content: content?.trim() ?? '',
  }).returning()
  return c.json(note, 201)
})

notes.put('/:id', async (c) => {
  const userId = c.get('userId')
  const id = parseInt(c.req.param('id'))
  const { title, content, category_id } = await c.req.json()

  if (!title?.trim()) return c.json({ error: 'Title is required' }, 400)
  if (title.length > 255) return c.json({ error: 'Title too long (max 255 chars)' }, 400)
  if (content && content.length > 50000) return c.json({ error: 'Content too long (max 50000 chars)' }, 400)

  const [note] = await db.update(notesTable)
    .set({ title: title.trim(), content: content?.trim() ?? '', category_id: category_id ?? null, updated_at: new Date() })
    .where(and(eq(notesTable.id, id), eq(notesTable.user_id, userId)))
    .returning()
  if (!note) return c.json({ error: 'Not found' }, 404)
  return c.json(note)
})

notes.delete('/:id', async (c) => {
  const userId = c.get('userId')
  const id = parseInt(c.req.param('id'))
  const [deleted] = await db.delete(notesTable)
    .where(and(eq(notesTable.id, id), eq(notesTable.user_id, userId)))
    .returning()
  if (!deleted) return c.json({ error: 'Not found' }, 404)
  return c.json({ success: true })
})

export default notes
