import express from 'express'
import cors from 'cors'

type User = { id: number; name: string; username: string; email: string }
type SortBy = 'id' | 'name' | 'username' | 'email'
type SortDir = 'asc' | 'desc'

const app = express()
app.use(cors())
app.use(express.json())

let nextId = 21
let users: User[] = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1, name: `User ${i + 1}`, username: `user${i + 1}`, email: `user${i + 1}@example.com`,
}))

function toInt(v: unknown, fallback: number) { const n = Number(v); return Number.isFinite(n) ? Math.trunc(n) : fallback }
function cmp(a: string | number, b: string | number, dir: SortDir) {
  if (typeof a === 'number' && typeof b === 'number') return dir === 'asc' ? a - b : b - a
  return dir === 'asc' ? String(a).localeCompare(String(b)) : String(b).localeCompare(String(a))
}

app.get('/users', (req, res) => {
  const page = Math.max(1, toInt(req.query.page, 1))
  const pageSize = Math.max(1, toInt(req.query.pageSize, 10))
  const allowed: SortBy[] = ['id', 'name', 'username', 'email']
  const sortBy: SortBy = allowed.includes(req.query.sortBy as SortBy) ? req.query.sortBy as SortBy : 'id'
  const sortDir: SortDir = req.query.sortDir === 'desc' ? 'desc' : 'asc'
  const sorted = [...users].sort((a, b) => cmp(a[sortBy], b[sortBy], sortDir))
  const total = sorted.length
  res.json({ rows: sorted.slice((page - 1) * pageSize, page * pageSize), total, page, pageSize })
})

app.post('/users', (req, res) => {
  const { name, username, email } = req.body ?? {}
  if (!name || !username || !email) return res.status(400).send('name, username, email required')
  if (users.some((u) => u.username === username || u.email === email)) return res.status(409).send('username or email exists')
  const user: User = { id: nextId++, name, username, email }
  users.unshift(user)
  res.status(201).json(user)
})

app.put('/users/:id', (req, res) => {
  const id = Number(req.params.id)
  const { name, username, email } = req.body ?? {}
  if (!name || !username || !email) return res.status(400).send('name, username, email required')
  const idx = users.findIndex((u) => u.id === id)
  if (idx === -1) return res.status(404).send('not found')
  if (users.some((u) => u.id !== id && (u.username === username || u.email === email))) return res.status(409).send('username or email exists')
  users[idx] = { id, name, username, email }
  res.json(users[idx])
})

app.delete('/users/:id', (req, res) => {
  const id = Number(req.params.id)
  const before = users.length
  users = users.filter((u) => u.id !== id)
  if (users.length === before) return res.status(404).send('not found')
  res.json({ success: true })
})

app.listen(4000, () => console.log('Mock API → http://localhost:4000'))
