import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { secureHeaders } from 'hono/secure-headers'
import { bodyLimit } from 'hono/body-limit'
import { initDB, pool } from './db'
import authRoutes from './routes/auth'
import notesRoutes from './routes/notes'

const app = new Hono()

app.use('*', secureHeaders())
app.use('*', cors({ origin: 'http://localhost:3000', credentials: true }))
app.use('*', bodyLimit({ maxSize: 1024 * 100 })) // 100KB

app.get('/health', async (c) => {
  try {
    await pool.query('SELECT 1')
    return c.json({ status: 'ok', db: 'ok' })
  } catch {
    return c.json({ status: 'ok', db: 'error' }, 503)
  }
})

app.route('/auth', authRoutes)
app.route('/notes', notesRoutes)

pool.on('error', (err) => console.error('Unexpected DB pool error:', err))

initDB()
  .then(() => console.log('DB ready'))
  .catch((err) => { console.error('DB init failed:', err); process.exit(1) })

const port = Number(process.env.PORT) || 3001

export default {
  port,
  fetch: app.fetch,
}
