'use client';

import { useRouter } from 'next/navigation';
import { NoteForm } from '@/app/components/NoteForm';
import { useCreateNote } from '@/lib/hooks/useCreateNote';

export default function NewNotePage() {
  const router = useRouter();
  const { mutateAsync: createNote, isPending } = useCreateNote();

  const handleSubmit = async (data: { title: string; content: string }) => {
    await createNote(data);
    router.push('/notes');
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-white mb-8">Crear Nueva Nota</h1>
        <div className="bg-gray-800 rounded-lg shadow-xl p-6">
          <NoteForm
            onSubmit={handleSubmit}
            submitLabel="Crear Nota"
            isSubmitting={isPending}
          />
        </div>
      </div>
    </div>
  );
}
