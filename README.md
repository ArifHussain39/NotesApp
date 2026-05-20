# NotesApp

Full-stack note-taking app with JWT auth, categories, and a 2-panel UI. Built with Next.js and Hono.

## Tech Stack

### Frontend
- **Framework**: Next.js 16 (App Router)
- **Library**: React 19
- **Styling**: Tailwind CSS 4
- **Language**: TypeScript

### Backend
- **Framework**: Hono
- **Runtime**: Bun
- **Database**: PostgreSQL
- **Language**: TypeScript

---

## Getting Started

### Prerequisites
- [Bun](https://bun.sh) installed
- PostgreSQL running locally

### 1. Database

```sql
CREATE DATABASE notesapp;
```

### 2. Backend

```bash
cd backend
```

Create `backend/.env`:
```
DATABASE_URL=postgresql://<user>:<password>@localhost:5432/notesapp
JWT_SECRET=your-secret-key
PORT=3001
```

```bash
bun run dev    # http://localhost:3001
```

Tables and migrations run automatically on startup.

### 3. Frontend

```bash
cd frontend
npm install
npm run dev    # http://localhost:3000
```

---

## API

All `/notes` and `/categories` routes require `Authorization: Bearer <token>`.

### Auth

| Method | Route | Body | Description |
|---|---|---|---|
| POST | `/auth/register` | `{email, password}` | Create account, returns JWT |
| POST | `/auth/login` | `{email, password}` | Login, returns JWT |
| POST | `/auth/logout` | — | Revoke token server-side |
| GET | `/auth/me` | — | Get current user from token |

Password must be 8–128 characters. Auth routes are rate-limited to 10 requests per 15 minutes per IP.

### Categories

| Method | Route | Body | Description |
|---|---|---|---|
| GET | `/categories` | — | List all categories |
| POST | `/categories` | `{name}` | Create category |
| PUT | `/categories/:id` | `{name}` | Rename category |
| DELETE | `/categories/:id` | — | Delete category (notes become uncategorized) |

### Notes

| Method | Route | Body | Description |
|---|---|---|---|
| GET | `/notes` | — | List all notes |
| POST | `/notes` | `{title, content, category_id?}` | Create note |
| PUT | `/notes/:id` | `{title, content, category_id?}` | Update note |
| DELETE | `/notes/:id` | — | Delete note |

### Health

```
GET /health  →  { status: "ok", db: "ok" }
```
