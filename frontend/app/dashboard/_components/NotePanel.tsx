'use client'

import { useState, useEffect, useRef } from 'react'
import type { Note, Category } from './Sidebar'
import { avatarColor } from './Sidebar'

interface Props {
  note: Note | null
  isCreating: boolean
  createCategoryId: number | null
  categories: Category[]
  onSave: (data: { title: string; content: string; category_id: number | null }) => Promise<void>
  onUpdate: (id: number, data: { title: string; content: string; category_id: number | null }) => Promise<void>
  onDelete: (id: number) => Promise<void>
  onCancelCreate: () => void
}

export default function NotePanel({
  note, isCreating, createCategoryId, categories,
  onSave, onUpdate, onDelete, onCancelCreate,
}: Props) {
  const [editing, setEditing] = useState(false)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [categoryId, setCategoryId] = useState<number | null>(null)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  function autoResize() {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = el.scrollHeight + 'px'
  }

  // Sync edit fields when selected note changes
  useEffect(() => {
    if (note) {
      setTitle(note.title)
      setContent(note.content)
      setCategoryId(note.category_id)
      setEditing(false)
    }
  }, [note?.id])

  // New note mode
  useEffect(() => {
    if (isCreating) {
      setTitle('')
      setContent('')
      setCategoryId(createCategoryId)
      setEditing(false)
    }
  }, [isCreating, createCategoryId])

  async function handleSave() {
    setSaving(true)
    try {
      if (isCreating) {
        await onSave({ title, content, category_id: categoryId })
      } else if (note) {
        await onUpdate(note.id, { title, content, category_id: categoryId })
        setEditing(false)
      }
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!note || !confirm('Delete this note?')) return
    setDeleting(true)
    try { await onDelete(note.id) } finally { setDeleting(false) }
  }

  const category = categories.find(c => c.id === (isCreating ? categoryId : note?.category_id))

  // Empty state
  if (!note && !isCreating) {
    return (
      <div className="flex-1 flex items-center justify-center bg-zinc-950">
        <div className="text-center">
          <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <p className="text-sm text-zinc-600">Select a note or create one</p>
        </div>
      </div>
    )
  }

  const isEditMode = isCreating || editing

  return (
    <div className="flex-1 flex flex-col bg-zinc-950 min-h-0 overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-8 h-14 border-b border-zinc-800 shrink-0">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-zinc-500 min-w-0">
          {category ? (
            <>
              <span className={`w-4 h-4 rounded text-[10px] font-bold text-white flex items-center justify-center shrink-0 ${avatarColor(category.name)}`}>
                {category.name[0].toUpperCase()}
              </span>
              <span className="shrink-0">{category.name}</span>
              <span className="text-zinc-700 shrink-0">/</span>
            </>
          ) : null}
          <span className="text-zinc-400 truncate">
            {isCreating ? 'New note' : (note?.title || 'Untitled')}
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 shrink-0">
          {isEditMode ? (
            <>
              <button
                onClick={isCreating ? onCancelCreate : () => { setEditing(false); setTitle(note!.title); setContent(note!.content); setCategoryId(note!.category_id) }}
                className="px-3 py-1.5 text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving || !title.trim()}
                className="px-4 py-1.5 text-sm font-medium bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg disabled:opacity-50 flex items-center gap-2 transition-colors"
              >
                {saving && <span className="w-3 h-3 border-2 border-white/50 border-t-white rounded-full animate-spin" />}
                {saving ? 'Saving…' : 'Save'}
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setEditing(true)}
                className="px-3 py-1.5 text-sm text-zinc-500 hover:text-zinc-300 border border-zinc-800 hover:border-zinc-700 rounded-lg transition-colors"
              >
                Edit
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="px-3 py-1.5 text-sm text-zinc-500 hover:text-red-400 border border-zinc-800 hover:border-red-900 rounded-lg transition-colors"
              >
                {deleting ? '…' : 'Delete'}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-8 py-8 max-w-3xl w-full mx-auto [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:transparent [&::-webkit-scrollbar-thumb]:bg-zinc-800">
        {isEditMode ? (
          <div className="space-y-4">
            {/* Category picker in edit mode */}
            <div className="flex items-center gap-2">
              <label className="text-xs text-zinc-600 shrink-0">Category</label>
              <select
                value={categoryId ?? ''}
                onChange={e => setCategoryId(e.target.value ? Number(e.target.value) : null)}
                className="bg-zinc-900 border border-zinc-800 rounded-md text-sm text-zinc-400 px-2 py-1 outline-none focus:border-indigo-600"
              >
                <option value="">None</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <input
              autoFocus
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Note title"
              className="w-full bg-transparent text-3xl font-bold text-zinc-100 placeholder:text-zinc-700 outline-none border-none"
            />
            <div className="h-px bg-zinc-800" />
            <textarea
              ref={textareaRef}
              value={content}
              onChange={e => { setContent(e.target.value); autoResize() }}
              onFocus={autoResize}
              placeholder="Start writing…"
              style={{ minHeight: '240px' }}
              className="w-full bg-transparent text-zinc-300 placeholder:text-zinc-700 outline-none border-none resize-none text-base leading-relaxed overflow-hidden"
            />
          </div>
        ) : (
          <div>
            <h1 className="text-3xl font-bold text-zinc-100 mb-6">{note?.title || 'Untitled'}</h1>
            <div className="h-px bg-zinc-800 mb-6" />
            <p className="text-zinc-300 whitespace-pre-wrap leading-relaxed text-base">
              {note?.content || <span className="text-zinc-700">No content</span>}
            </p>
            <div className="mt-12 flex items-center gap-4 text-xs text-zinc-700">
              <span>Created {note?.created_at ? new Date(note.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : ''}</span>
              {note?.updated_at !== note?.created_at && (
                <span>· Updated {new Date(note!.updated_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
