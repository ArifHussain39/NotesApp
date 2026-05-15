# 📝 NotesApp

A modern, full-stack note-taking application built with Next.js and Hono.

## 🚀 Features

-   **Authentication**: Secure Signup and Login flow.
-   **Dashboard**: A premium user interface to manage your personal notes.
-   **Notes CRUD**: Create, View, and Delete notes in real-time.
-   **Persistent Storage**: Powered by SQLite for reliable data management.
-   **Modern Design**: Built with Tailwind CSS 4 and React 19, supporting both light and dark modes.

## 🛠️ Tech Stack

### Frontend
-   **Framework**: [Next.js 16 (App Router)](https://nextjs.org/)
-   **Library**: [React 19](https://react.dev/)
-   **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
-   **Language**: TypeScript

### Backend
-   **Framework**: [Hono](https://hono.dev/)
-   **Runtime**: Node.js
-   **Database**: [SQLite](https://sqlite.org/) via `@libsql/client`
-   **Language**: TypeScript

---

## 🏃 Getting Started

### 1. Prerequisites
Ensure you have **Node.js** installed on your machine.

### 2. Backend Setup
```bash
cd backend
npm install
npm run dev
```
The backend will run on `http://localhost:8787` and initialize a `local.db` file.

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
The frontend will run on `http://localhost:3000`.

---

## 🔑 Test Credentials
You can use the following account to test the application immediately:
-   **Email**: `user@example.com`
-   **Password**: `password123`

Or simply create a new account using the **Sign up** feature!

## 📂 Project Structure
```text
├── backend/            # Hono API & SQLite Database
│   ├── src/db.ts       # Database initialization & Seeding
│   └── src/index.ts    # API Endpoints (Auth & Notes)
├── frontend/           # Next.js Web Application
│   ├── app/login       # Login Page
│   ├── app/signup      # Signup Page
│   └── app/dashboard   # Notes Management Dashboard
└── local.db            # SQLite database file (generated)
```
