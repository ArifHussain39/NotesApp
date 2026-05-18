'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch } from '@/lib/api';

interface Note {
  id: number;
  title: string;
  content: string;
  created_at: string;
}

interface User {
  id: number;
  email: string;
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [newNote, setNewNote] = useState({ title: '', content: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (!storedUser || !token) {
      router.push('/login');
    } else {
      setUser(JSON.parse(storedUser));
      fetchNotes();
    }
  }, [router]);

  const fetchNotes = async () => {
    try {
      const response = await apiFetch('/notes');
      if (response.ok) {
        const data = await response.json();
        setNotes(data);
      } else if (response.status === 401) {
        handleLogout();
      }
    } catch (error) {
      console.error('Failed to fetch notes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateNote = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const response = await apiFetch('/notes', {
        method: 'POST',
        body: JSON.stringify({ title: newNote.title, content: newNote.content }),
      });
      if (response.ok) {
        setNewNote({ title: '', content: '' });
        setIsCreating(false);
        fetchNotes();
      }
    } catch (error) {
      console.error('Failed to create note:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditNote = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!editingNote) return;
    setIsSaving(true);
    try {
      const response = await apiFetch(`/notes/${editingNote.id}`, {
        method: 'PUT',
        body: JSON.stringify({ title: editingNote.title, content: editingNote.content }),
      });
      if (response.ok) {
        setEditingNote(null);
        fetchNotes();
      }
    } catch (error) {
      console.error('Failed to update note:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteNote = async (id: number) => {
    if (!confirm('Are you sure you want to delete this note?')) return;
    setDeletingId(id);
    try {
      const response = await apiFetch(`/notes/${id}`, { method: 'DELETE' });
      if (response.ok) {
        fetchNotes();
      }
    } catch (error) {
      console.error('Failed to delete note:', error);
    } finally {
      setDeletingId(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  const displayName = user?.email.split('@')[0] ?? '';

  if (!user) return null;

  const NoteForm = ({
    title,
    content,
    onTitleChange,
    onContentChange,
    onSubmit,
    onCancel,
    heading,
  }: {
    title: string;
    content: string;
    onTitleChange: (v: string) => void;
    onContentChange: (v: string) => void;
    onSubmit: (e: React.SyntheticEvent) => void;
    onCancel: () => void;
    heading: string;
  }) => (
    <div className="mb-12 animate-in fade-in slide-in-from-top-4 duration-300">
      <form onSubmit={onSubmit} className="bg-white dark:bg-zinc-900 rounded-3xl p-8 shadow-xl border border-indigo-100 dark:border-zinc-800">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{heading}</h2>
          <button type="button" onClick={onCancel} className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200">✕</button>
        </div>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Title"
            required
            className="w-full text-xl font-semibold bg-transparent border-none focus:ring-0 placeholder:text-zinc-300 dark:placeholder:text-zinc-700 text-zinc-900 dark:text-zinc-50"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
          />
          <textarea
            placeholder="Start writing..."
            required
            rows={4}
            className="w-full bg-transparent border-none focus:ring-0 placeholder:text-zinc-300 dark:placeholder:text-zinc-700 text-zinc-900 dark:text-zinc-50 resize-none"
            value={content}
            onChange={(e) => onContentChange(e.target.value)}
          />
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <button type="button" onClick={onCancel} className="px-6 py-2 text-sm font-semibold text-zinc-500 hover:text-zinc-700">
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="rounded-xl bg-indigo-600 px-8 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 hover:bg-indigo-500 disabled:opacity-50 flex items-center gap-2"
          >
            {isSaving && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
            {isSaving ? 'Saving...' : 'Save Note'}
          </button>
        </div>
      </form>
    </div>
  );

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 font-sans transition-colors">
      <nav className="border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 backdrop-blur-md sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">N</span>
              </div>
              <span className="text-xl font-bold text-zinc-900 dark:text-zinc-50">NotesApp</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="hidden sm:inline text-sm text-zinc-500 dark:text-zinc-400">{user.email}</span>
              <button
                onClick={handleLogout}
                className="text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-red-600 transition-colors"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-3xl bg-indigo-600 p-8 sm:p-12 shadow-2xl mb-12 transition-all">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
            <div>
              <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
                Hey, <span className="text-indigo-200">{displayName}</span>
              </h1>
              <p className="mt-2 text-lg text-indigo-100 max-w-md">
                You have {notes.length} notes saved. What's on your mind today?
              </p>
            </div>
            <button
              onClick={() => { setIsCreating(true); setEditingNote(null); }}
              className="rounded-2xl bg-white px-8 py-4 text-sm font-bold text-indigo-600 shadow-xl hover:bg-zinc-50 transition-all hover:scale-105 active:scale-95"
            >
              + Create New Note
            </button>
          </div>
        </div>

        {/* Create Form */}
        {isCreating && (
          <NoteForm
            heading="New Note"
            title={newNote.title}
            content={newNote.content}
            onTitleChange={(v) => setNewNote({ ...newNote, title: v })}
            onContentChange={(v) => setNewNote({ ...newNote, content: v })}
            onSubmit={handleCreateNote}
            onCancel={() => setIsCreating(false)}
          />
        )}

        {/* Edit Form */}
        {editingNote && (
          <NoteForm
            heading="Edit Note"
            title={editingNote.title}
            content={editingNote.content}
            onTitleChange={(v) => setEditingNote({ ...editingNote, title: v })}
            onContentChange={(v) => setEditingNote({ ...editingNote, content: v })}
            onSubmit={handleEditNote}
            onCancel={() => setEditingNote(null)}
          />
        )}

        {/* Notes Grid */}
        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : notes.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {notes.map((note) => (
              <div key={note.id} className="group relative rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all">
                <div className="flex justify-between items-start mb-4">
                  <div className="h-2 w-12 bg-indigo-600 rounded-full"></div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
                    <button
                      onClick={() => { setEditingNote(note); setIsCreating(false); }}
                      className="p-2 text-zinc-400 hover:text-indigo-500 transition-colors"
                      title="Edit"
                    >
                      ✎
                    </button>
                    <button
                      onClick={() => handleDeleteNote(note.id)}
                      disabled={deletingId === note.id}
                      className="p-2 text-zinc-400 hover:text-red-500 transition-colors disabled:opacity-50"
                      title="Delete"
                    >
                      {deletingId === note.id
                        ? <span className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin inline-block" />
                        : '✕'}
                    </button>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">{note.title}</h3>
                <p className="text-zinc-600 dark:text-zinc-400 line-clamp-4 leading-relaxed">
                  {note.content}
                </p>
                <div className="mt-6 pt-6 border-t border-zinc-50 dark:border-zinc-800/50">
                  <span className="text-xs font-medium text-zinc-400">
                    {new Date(note.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-3xl">
            <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">📝</span>
            </div>
            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">No notes yet</h3>
            <p className="text-zinc-500 dark:text-zinc-400 mt-1">Click the button above to create your first note!</p>
          </div>
        )}
      </main>
    </div>
  );
}
