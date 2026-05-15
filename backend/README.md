# ⚙️ NotesApp Backend

The backend of the NotesApp, built with **Hono** and **SQLite**.

## 🛠️ Features
- **Hono Framework**: Ultra-fast web framework for Node.js.
- **SQLite (@libsql/client)**: Modern, lightweight database.
- **Auto-Seeding**: Automatically creates tables and a default user on startup.
- **REST API**: Clean endpoints for authentication and notes management.

## 🚀 Development
Run the development server:

```bash
npm run dev
```

The server runs on `http://localhost:8787`.

## 📁 API Endpoints
- `POST /login`: Authenticate user.
- `POST /signup`: Register new user.
- `GET /notes?email=...`: Fetch all notes for a user.
- `POST /notes`: Create a new note.
- `DELETE /notes/:id`: Delete a note.
