'use client';

import Link from 'next/link';
import { useNotes } from '@/lib/hooks/useNotes';
import { NoteCard } from '@/app/components/NoteCard';

export default function NotesPage() {
  const { data: notes, isLoading, isError, error } = useNotes();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-300">Cargando notas...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="bg-red-900 border border-red-700 rounded-lg p-6 max-w-md">
          <h2 className="text-red-200 font-semibold mb-2">Error al Cargar Notas</h2>
          <p className="text-red-300 text-sm">
            {error instanceof Error ? error.message : 'Algo salió mal'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Mis Notas</h1>
          <Link
            href="/notes/new"
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Nueva Nota
          </Link>
        </div>

        {notes && notes.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 mb-4">No hay notas aún. ¡Crea tu primera nota!</p>
            <Link
              href="/notes/new"
              className="text-blue-400 hover:text-blue-300 font-medium"
            >
              Crear Nota
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {notes?.map((note) => (
              <NoteCard key={note.id} note={note} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
