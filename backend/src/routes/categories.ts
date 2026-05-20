import { Hono } from 'hono'
import { eq, and, asc } from 'drizzle-orm'
import { db } from '../db'
import { categories as categoriesTable } from '../schema'
import { authMiddleware } from '../middleware/auth'
import type { AppEnv } from '../types'

const categories = new Hono<AppEnv>()
categories.use('*', authMiddleware)

categories.get('/', async (c) => {
  const userId = c.get('userId')
  const result = await db.select().from(categoriesTable)
    .where(eq(categoriesTable.user_id, userId))
    .orderBy(asc(categoriesTable.created_at))
  return c.json(result)
})

categories.post('/', async (c) => {
  const userId = c.get('userId')
  const { name } = await c.req.json()
  if (!name?.trim()) return c.json({ error: 'Name required' }, 400)
  if (name.length > 100) return c.json({ error: 'Name too long (max 100 chars)' }, 400)
  const [category] = await db.insert(categoriesTable).values({
    user_id: userId,
    name: name.trim(),
  }).returning()
  return c.json(category, 201)
})

categories.put('/:id', async (c) => {
  const userId = c.get('userId')
  const id = parseInt(c.req.param('id'))
  const { name } = await c.req.json()
  if (!name?.trim()) return c.json({ error: 'Name required' }, 400)
  if (name.length > 100) return c.json({ error: 'Name too long' }, 400)
  const [category] = await db.update(categoriesTable)
    .set({ name: name.trim() })
    .where(and(eq(categoriesTable.id, id), eq(categoriesTable.user_id, userId)))
    .returning()
  if (!category) return c.json({ error: 'Not found' }, 404)
  return c.json(category)
})

categories.delete('/:id', async (c) => {
  const userId = c.get('userId')
  const id = parseInt(c.req.param('id'))
  const [deleted] = await db.delete(categoriesTable)
    .where(and(eq(categoriesTable.id, id), eq(categoriesTable.user_id, userId)))
    .returning()
  if (!deleted) return c.json({ error: 'Not found' }, 404)
  return c.json({ success: true })
})

export default categories
