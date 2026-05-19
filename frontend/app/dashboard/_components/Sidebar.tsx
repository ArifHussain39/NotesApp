'use client'

import { useState, useRef, useEffect } from 'react'

export interface Category { id: number; name: string; created_at: string }
export interface Note { id: number; category_id: number | null; title: string; content: string; created_at: string; updated_at: string }

const AVATAR_COLORS = [
  'bg-rose-600', 'bg-orange-500', 'bg-amber-500', 'bg-emerald-600',
  'bg-teal-600', 'bg-blue-600', 'bg-violet-600', 'bg-pink-600',
]

export function avatarColor(name: string) {
  let h = 0
  for (const c of name) h = (h * 31 + c.charCodeAt(0)) & 0xff
  return AVATAR_COLORS[h % AVATAR_COLORS.length]
}

interface Props {
  categories: Category[]
  notes: Note[]
  selectedNoteId: number | null
  onSelectNote: (id: number) => void
  onCreateNote: (categoryId: number | null) => void
  onCreateCategory: (name: string) => Promise<void>
  onRenameCategory: (id: number, name: string) => Promise<void>
  onDeleteCategory: (id: number) => Promise<void>
  userEmail: string
  onLogout: () => void
  open: boolean
  onClose: () => void
}

function CategoryMenu({ onRename, onDelete }: { onRename: () => void; onDelete: () => void }) {
  const [show, setShow] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setShow(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button
        onClick={(e) => { e.stopPropagation(); setShow(s => !s) }}
        className="w-6 h-6 flex items-center justify-center rounded text-zinc-500 hover:text-zinc-300 hover:bg-zinc-700 transition-colors text-xs"
      >
        ···
      </button>
      {show && (
        <div className="absolute right-0 top-7 z-50 w-36 rounded-lg bg-zinc-800 border border-zinc-700 shadow-xl py-1">
          <button
            onClick={(e) => { e.stopPropagation(); setShow(false); onRename() }}
            className="w-full text-left px-3 py-1.5 text-sm text-zinc-300 hover:bg-zinc-700 hover:text-white"
          >
            Rename
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); setShow(false); onDelete() }}
            className="w-full text-left px-3 py-1.5 text-sm text-red-400 hover:bg-zinc-700 hover:text-red-300"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  )
}

export default function Sidebar({
  categories, notes, selectedNoteId, onSelectNote, onCreateNote,
  onCreateCategory, onRenameCategory, onDeleteCategory,
  userEmail, onLogout, open, onClose,
}: Props) {
  const [expanded, setExpanded] = useState<Set<number>>(new Set())
  const [newCatName, setNewCatName] = useState('')
  const [addingCat, setAddingCat] = useState(false)
  const [renamingId, setRenamingId] = useState<number | null>(null)
  const [renameName, setRenameName] = useState('')
  const newCatRef = useRef<HTMLInputElement>(null)
  const renameRef = useRef<HTMLInputElement>(null)

  useEffect(() => { if (addingCat) newCatRef.current?.focus() }, [addingCat])
  useEffect(() => { if (renamingId) renameRef.current?.focus() }, [renamingId])

  function toggleExpand(id: number) {
    setExpanded(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  async function submitNewCat(e: React.SyntheticEvent) {
    e.preventDefault()
    if (!newCatName.trim()) return
    await onCreateCategory(newCatName.trim())
    setNewCatName('')
    setAddingCat(false)
  }

  async function submitRename(e: React.SyntheticEvent, id: number) {
    e.preventDefault()
    if (!renameName.trim()) return
    await onRenameCategory(id, renameName.trim())
    setRenamingId(null)
  }

  const allNotesCount = notes.length
  const uncategorized = notes.filter(n => n.category_id === null)

  return (
    <>
      {/* Mobile backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-20 bg-black/50 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside className={`
        fixed top-0 left-0 z-30 h-full w-64 flex flex-col
        bg-zinc-900 border-r border-zinc-800
        transition-transform duration-200
        ${open ? 'translate-x-0' : '-translate-x-full'}
        lg:relative lg:translate-x-0 lg:z-auto
      `}>
        {/* Header */}
        <div className="flex items-center justify-between px-4 h-14 border-b border-zinc-800 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-indigo-600 rounded flex items-center justify-center">
              <span className="text-white text-xs font-bold">N</span>
            </div>
            <span className="text-sm font-semibold text-zinc-100">NotesApp</span>
          </div>
          <button
            onClick={onLogout}
            className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            Sign out
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-3 px-2">
          {/* All Notes */}
          <button
            onClick={() => onSelectNote(-1)}
            className="w-full flex items-center justify-between px-2 py-1.5 rounded-md text-sm text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors group"
          >
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>All Notes</span>
            </div>
            <span className="text-xs text-zinc-600 group-hover:text-zinc-500">{allNotesCount}</span>
          </button>

          <div className="mt-3 mb-2 px-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-600">Categories</span>
          </div>

          {/* Categories */}
          {categories.map(cat => {
            const catNotes = notes.filter(n => n.category_id === cat.id)
            const isExpanded = expanded.has(cat.id)
            const color = avatarColor(cat.name)

            return (
              <div key={cat.id}>
                {renamingId === cat.id ? (
                  <form onSubmit={(e) => submitRename(e, cat.id)} className="px-2 py-1">
                    <input
                      ref={renameRef}
                      value={renameName}
                      onChange={e => setRenameName(e.target.value)}
                      onBlur={() => setRenamingId(null)}
                      onKeyDown={e => e.key === 'Escape' && setRenamingId(null)}
                      className="w-full bg-zinc-800 border border-indigo-500 rounded px-2 py-1 text-sm text-zinc-100 outline-none"
                    />
                  </form>
                ) : (
                  <div className="group flex items-center gap-1 px-2 py-1.5 rounded-md hover:bg-zinc-800 cursor-pointer transition-colors">
                    <button
                      className="flex items-center gap-2 flex-1 min-w-0"
                      onClick={() => toggleExpand(cat.id)}
                    >
                      <span className={`w-5 h-5 rounded ${color} flex items-center justify-center text-[11px] font-bold text-white shrink-0`}>
                        {cat.name[0].toUpperCase()}
                      </span>
                      <span className="text-sm text-zinc-300 truncate flex-1 text-left">{cat.name}</span>
                      <span className="text-xs text-zinc-600 shrink-0">{catNotes.length || ''}</span>
                    </button>
                    <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                      <CategoryMenu
                        onRename={() => { setRenamingId(cat.id); setRenameName(cat.name) }}
                        onDelete={() => onDeleteCategory(cat.id)}
                      />
                      <button
                        onClick={(e) => { e.stopPropagation(); setExpanded(p => new Set([...p, cat.id])); onCreateNote(cat.id) }}
                        className="w-6 h-6 flex items-center justify-center rounded text-zinc-500 hover:text-zinc-300 hover:bg-zinc-700 transition-colors"
                        title="New note"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                      </button>
                    </div>
                  </div>
                )}

                {/* Notes under category */}
                {isExpanded && (
                  <div className="ml-5 border-l border-zinc-800 pl-2 mb-1">
                    {catNotes.length === 0 ? (
                      <p className="text-xs text-zinc-600 px-2 py-1">No notes</p>
                    ) : (
                      catNotes.map(note => (
                        <button
                          key={note.id}
                          onClick={() => onSelectNote(note.id)}
                          className={`w-full text-left flex items-center gap-2 px-2 py-1.5 rounded-md text-sm transition-colors ${
                            selectedNoteId === note.id
                              ? 'bg-indigo-600/20 text-indigo-300'
                              : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
                          }`}
                        >
                          <svg className="w-3 h-3 shrink-0 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6M9 8h6m-6 8h4" />
                          </svg>
                          <span className="truncate">{note.title || 'Untitled'}</span>
                        </button>
                      ))
                    )}
                  </div>
                )}
              </div>
            )
          })}

          {/* Uncategorized */}
          {uncategorized.length > 0 && (
            <div className="mt-2">
              <div className="px-2 py-1.5">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-600">Uncategorized</span>
              </div>
              <div className="ml-2 pl-2 border-l border-zinc-800">
                {uncategorized.map(note => (
                  <button
                    key={note.id}
                    onClick={() => onSelectNote(note.id)}
                    className={`w-full text-left flex items-center gap-2 px-2 py-1.5 rounded-md text-sm transition-colors ${
                      selectedNoteId === note.id
                        ? 'bg-indigo-600/20 text-indigo-300'
                        : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
                    }`}
                  >
                    <svg className="w-3 h-3 shrink-0 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6M9 8h6m-6 8h4" />
                    </svg>
                    <span className="truncate">{note.title || 'Untitled'}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </nav>

        {/* New Category */}
        <div className="px-2 pb-4 pt-2 border-t border-zinc-800 shrink-0">
          {addingCat ? (
            <form onSubmit={submitNewCat} className="flex gap-1">
              <input
                ref={newCatRef}
                value={newCatName}
                onChange={e => setNewCatName(e.target.value)}
                onBlur={() => { if (!newCatName.trim()) setAddingCat(false) }}
                onKeyDown={e => e.key === 'Escape' && setAddingCat(false)}
                placeholder="Category name..."
                className="flex-1 bg-zinc-800 border border-indigo-500 rounded px-2 py-1.5 text-sm text-zinc-100 placeholder:text-zinc-600 outline-none"
              />
              <button type="submit" className="px-2 py-1.5 bg-indigo-600 hover:bg-indigo-500 rounded text-xs text-white font-medium">
                Add
              </button>
            </form>
          ) : (
            <button
              onClick={() => setAddingCat(true)}
              className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-sm text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Category
            </button>
          )}
          <p className="text-[11px] text-zinc-700 px-2 mt-2 truncate">{userEmail}</p>
        </div>
      </aside>
    </>
  )
}
