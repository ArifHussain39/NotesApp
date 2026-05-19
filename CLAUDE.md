# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Structure

Monorepo with two separate apps — no shared packages, no workspace tooling:

```
Notes app/
├── backend/   — Bun + Hono REST API (port 3001)
└── frontend/  — Next.js 16 + React 19 + Tailwind 4 (port 3000)
```

## Commands

### Backend
```bash
cd backend
bun run dev        # hot-reload dev server on port 3001
```

### Frontend
```bash
cd frontend
npm run dev        # Next.js dev server on port 3000
npm run build      # production build
npm run lint       # eslint
```

No test suite exists yet.

## Architecture

### Backend (`backend/src/`)

**Runtime:** Bun (not Node). Use `Bun.password.hash/verify` for passwords — no bcrypt. `@types/bun` provides globals.

**Request flow:**
```
index.ts → Hono app (port 3001, CORS allows localhost:3000)
  /auth  → routes/auth.ts   (register, login — no middleware)
  /notes → routes/notes.ts  (all routes behind authMiddleware)
```

**Auth:** JWT signed/verified with `hono/jwt` using `HS256`. Middleware extracts `payload.sub` → sets `c.set('userId', number)` on context. Hono app typed with `AppEnv` from `src/types.ts` so `c.get('userId')` resolves to `number`.

**DB:** PostgreSQL via `pg` pool. `initDB()` in `db.ts` creates tables on startup. All note queries include `AND user_id = ?` — no cross-user access possible.

**Env vars required:** `DATABASE_URL`, `JWT_SECRET` (in `backend/.env`).

### Frontend (`frontend/`)

> **Warning:** This project uses Next.js 16 with React 19 — breaking changes from earlier versions. Read `node_modules/next/dist/docs/` before writing Next.js-specific code.

**All API calls** go through `lib/api.ts` (`apiFetch`), which auto-attaches `Authorization: Bearer <token>` from `localStorage`. Base URL is hardcoded to `http://localhost:3001`.

**Auth state** stored in `localStorage` as two keys: `token` (JWT string) and `user` (JSON `{id, email}`). Dashboard reads both on mount; missing either redirects to `/login`.

**Path alias:** `@/` maps to `frontend/` root (e.g. `@/lib/api`).

**Pages:**
- `/` — static landing
- `/login`, `/signup` — auth forms, call `/auth/login` and `/auth/register`
- `/dashboard` — full CRUD notes UI; all fetches require valid JWT

**Note shape from backend:** `{id, user_id, title, content, created_at, updated_at}` — frontend uses `created_at` (snake_case, not camelCase).
