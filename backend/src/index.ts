import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import client, { initDB } from './db.js'

const app = new Hono()

// Initialize Database
initDB().catch(err => console.error('Database initialization failed:', err));

// Enable CORS for frontend requests
app.use('/*', cors({
  origin: 'http://localhost:3000',
  allowMethods: ['POST', 'GET', 'OPTIONS'],
}))

app.get('/', (c) => {
  return c.text('Hono Backend Running')
})

// Simple Login Endpoint (using SQLite)
app.post('/login', async (c) => {
  const body = await c.req.json()
  const { email, password } = body

  try {
    const result = await client.execute({
      sql: 'SELECT * FROM users WHERE email = ? AND password = ?',
      args: [email, password]
    });

    if (result.rows.length > 0) {
      const user = result.rows[0] as unknown as { name: string; email: string };
      return c.json({
        success: true,
        user: {
          name: user.name,
          email: user.email
        }
      })
    }
  } catch (error) {
    console.error('Login error:', error);
    return c.json({ success: false, message: 'Database error' }, 500);
  }

  return c.json({ success: false, message: 'Invalid credentials' }, 401)
})

// Signup Endpoint
app.post('/signup', async (c) => {
  const body = await c.req.json()
  const { name, email, password } = body

  if (!name || !email || !password) {
    return c.json({ success: false, message: 'All fields are required' }, 400)
  }

  try {
    // Check if user already exists
    const existing = await client.execute({
      sql: 'SELECT * FROM users WHERE email = ?',
      args: [email]
    });

    if (existing.rows.length > 0) {
      return c.json({ success: false, message: 'Email already exists' }, 400)
    }

    // Insert new user
    await client.execute({
      sql: 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      args: [name, email, password]
    });

    return c.json({
      success: true,
      user: { name, email }
    })
  } catch (error) {
    console.error('Signup error:', error);
    return c.json({ success: false, message: 'Database error' }, 500);
  }
})

// --- Notes Endpoints ---

// Get all notes for a user
app.get('/notes', async (c) => {
  const email = c.req.query('email')
  if (!email) return c.json({ success: false, message: 'Email required' }, 400)

  try {
    const result = await client.execute({
      sql: 'SELECT * FROM notes WHERE userId = ? ORDER BY createdAt DESC',
      args: [email]
    })
    return c.json({ success: true, notes: result.rows })
  } catch (error) {
    console.error('Fetch notes error:', error);
    return c.json({ success: false, message: 'Database error' }, 500)
  }
})

// Create a new note
app.post('/notes', async (c) => {
  const { email, title, content } = await c.req.json()
  if (!email || !title || !content) {
    return c.json({ success: false, message: 'Missing fields' }, 400)
  }

  try {
    await client.execute({
      sql: 'INSERT INTO notes (userId, title, content) VALUES (?, ?, ?)',
      args: [email, title, content]
    })
    return c.json({ success: true })
  } catch (error) {
    console.error('Create note error:', error);
    return c.json({ success: false, message: 'Database error' }, 500)
  }
})

// Delete a note
app.delete('/notes/:id', async (c) => {
  const id = c.req.param('id')
  try {
    await client.execute({
      sql: 'DELETE FROM notes WHERE id = ?',
      args: [id]
    })
    return c.json({ success: true })
  } catch (error) {
    console.error('Delete note error:', error);
    return c.json({ success: false, message: 'Database error' }, 500)
  }
})

serve({
  fetch: app.fetch,
  port: 8787,
})

console.log('Server running on http://localhost:8787')