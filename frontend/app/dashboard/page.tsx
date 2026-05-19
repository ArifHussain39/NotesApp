'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { apiFetch } from '@/lib/api'
import Sidebar, { type Category, type Note } from './_components/Sidebar'
import NotePanel from './_components/NotePanel'

export default function DashboardPage() {
  const [user, setUser] = useState<{ id: number; email: string } | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [notes, setNotes] = useState<Note[]>([])
  const [selectedNoteId, setSelectedNoteId] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [createCategoryId, setCreateCategoryId] = useState<number | null>(null)
  const router = useRouter()

  const selectedNote = notes.find(n => n.id === selectedNoteId) ?? null

  const loadAll = useCallback(async () => {
    try {
      const [catRes, noteRes] = await Promise.all([apiFetch('/categories'), apiFetch('/notes')])
      if (catRes.status === 401 || noteRes.status === 401) { handleLogout(); return }
      if (catRes.ok) setCategories(await catRes.json())
      if (noteRes.ok) setNotes(await noteRes.json())
    } catch {}
    finally { setIsLoading(false) }
  }, [])

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    const token = localStorage.getItem('token')
    if (!storedUser || !token) { router.push('/login'); return }
    setUser(JSON.parse(storedUser))
    loadAll()
  }, [router, loadAll])

  async function handleLogout() {
    try { await apiFetch('/auth/logout', { method: 'POST' }) } catch {}
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.push('/login')
  }

  function handleSelectNote(id: number) {
    if (id === -1) { setSelectedNoteId(null); setIsCreating(false); return }
    setSelectedNoteId(id)
    setIsCreating(false)
    setSidebarOpen(false)
  }

  function handleCreateNote(categoryId: number | null) {
    setIsCreating(true)
    setCreateCategoryId(categoryId)
    setSelectedNoteId(null)
    setSidebarOpen(false)
  }

  async function handleSaveNote(data: { title: string; content: string; category_id: number | null }) {
    const res = await apiFetch('/notes', { method: 'POST', body: JSON.stringify(data) })
    if (res.ok) {
      const note: Note = await res.json()
      setNotes(prev => [note, ...prev])
      setSelectedNoteId(note.id)
      setIsCreating(false)
    }
  }

  async function handleUpdateNote(id: number, data: { title: string; content: string; category_id: number | null }) {
    const res = await apiFetch(`/notes/${id}`, { method: 'PUT', body: JSON.stringify(data) })
    if (res.ok) {
      const updated: Note = await res.json()
      setNotes(prev => prev.map(n => n.id === id ? updated : n))
    }
  }

  async function handleDeleteNote(id: number) {
    const res = await apiFetch(`/notes/${id}`, { method: 'DELETE' })
    if (res.ok) {
      setNotes(prev => prev.filter(n => n.id !== id))
      setSelectedNoteId(null)
    }
  }

  async function handleCreateCategory(name: string) {
    const res = await apiFetch('/categories', { method: 'POST', body: JSON.stringify({ name }) })
    if (res.ok) {
      const cat: Category = await res.json()
      setCategories(prev => [...prev, cat])
    }
  }

  async function handleRenameCategory(id: number, name: string) {
    const res = await apiFetch(`/categories/${id}`, { method: 'PUT', body: JSON.stringify({ name }) })
    if (res.ok) {
      const updated: Category = await res.json()
      setCategories(prev => prev.map(c => c.id === id ? updated : c))
    }
  }

  async function handleDeleteCategory(id: number) {
    if (!confirm('Delete category? Notes inside will become uncategorized.')) return
    const res = await apiFetch(`/categories/${id}`, { method: 'DELETE' })
    if (res.ok) {
      setCategories(prev => prev.filter(c => c.id !== id))
      setNotes(prev => prev.map(n => n.category_id === id ? { ...n, category_id: null } : n))
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-zinc-950">
        <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="flex h-screen bg-zinc-950 overflow-hidden">
      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-10 flex items-center h-14 px-4 bg-zinc-900 border-b border-zinc-800">
        <button
          onClick={() => setSidebarOpen(s => !s)}
          className="p-2 text-zinc-400 hover:text-zinc-200"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <span className="ml-2 text-sm font-semibold text-zinc-100">NotesApp</span>
      </div>

      <Sidebar
        categories={categories}
        notes={notes}
        selectedNoteId={selectedNoteId}
        onSelectNote={handleSelectNote}
        onCreateNote={handleCreateNote}
        onCreateCategory={handleCreateCategory}
        onRenameCategory={handleRenameCategory}
        onDeleteCategory={handleDeleteCategory}
        userEmail={user.email}
        onLogout={handleLogout}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <main className="flex-1 flex flex-col min-w-0 lg:mt-0 mt-14">
        <NotePanel
          note={selectedNote}
          isCreating={isCreating}
          createCategoryId={createCategoryId}
          categories={categories}
          onSave={handleSaveNote}
          onUpdate={handleUpdateNote}
          onDelete={handleDeleteNote}
          onCancelCreate={() => setIsCreating(false)}
        />
      </main>
    </div>
  )
}
