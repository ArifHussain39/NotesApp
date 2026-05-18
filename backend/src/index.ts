import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { initDB } from './db'
import authRoutes from './routes/auth'
import notesRoutes from './routes/notes'

const app = new Hono()

app.use('*', cors({ origin: 'http://localhost:3000', credentials: true }))

app.route('/auth', authRoutes)
app.route('/notes', notesRoutes)

initDB()
  .then(() => console.log('DB ready'))
  .catch((err) => { console.error('DB init failed:', err); process.exit(1) })

export default {
  port: 3001,
  fetch: app.fetch,
}
