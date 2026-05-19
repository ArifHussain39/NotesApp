# NotesApp

Full-stack note-taking app with JWT auth, built with Next.js and Hono.

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
```

```bash
bun run dev    # http://localhost:3001
```

Tables are created automatically on first run.

### 3. Frontend

```bash
cd frontend
npm install
npm run dev    # http://localhost:3000
```

---

## API

All `/notes` routes require `Authorization: Bearer <token>`.

| Method | Route | Body | Description |
|---|---|---|---|
| POST | `/auth/register` | `{email, password}` | Create account, returns JWT |
| POST | `/auth/login` | `{email, password}` | Login, returns JWT |
| GET | `/notes` | — | List notes |
| POST | `/notes` | `{title, content}` | Create note |
| PUT | `/notes/:id` | `{title, content}` | Update note |
| DELETE | `/notes/:id` | — | Delete note |
