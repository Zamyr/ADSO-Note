'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import { NoteForm } from '@/app/components/NoteForm';
import { useNote } from '@/lib/hooks/useNote';
import { useUpdateNote } from '@/lib/hooks/useUpdateNote';

export default function EditNotePage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const noteId = parseInt(resolvedParams.id, 10);

  const { data: note, isLoading, isError } = useNote(noteId);
  const { mutateAsync: updateNote, isPending } = useUpdateNote(noteId);

  const handleSubmit = async (data: { title: string; content: string }) => {
    await updateNote(data);
    router.push('/notes');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-300">Cargando nota...</p>
        </div>
      </div>
    );
  }

  if (isError || !note) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="bg-red-900 border border-red-700 rounded-lg p-6 max-w-md">
          <h2 className="text-red-200 font-semibold mb-2">Nota No Encontrada</h2>
          <p className="text-red-300 text-sm mb-4">La nota que buscas no existe.</p>
          <button
            onClick={() => router.push('/notes')}
            className="text-blue-400 hover:text-blue-300 font-medium"
          >
            Volver a Notas
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-white mb-8">Editar Nota</h1>
        <div className="bg-gray-800 rounded-lg shadow-xl p-6">
          <NoteForm
            initialData={{ title: note.title, content: note.content }}
            onSubmit={handleSubmit}
            submitLabel="Actualizar Nota"
            isSubmitting={isPending}
          />
        </div>
      </div>
    </div>
  );
}
