'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { UpdateNoteInput } from '@/lib/validators/noteSchemas';
import { Note } from '@/lib/types/note';

async function updateNote(id: number, data: UpdateNoteInput): Promise<Note> {
  const response = await fetch(`/api/note/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to update note');
  }

  return response.json();
}

export function useUpdateNote(id: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateNoteInput) => updateNote(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      queryClient.invalidateQueries({ queryKey: ['note', id] });
    },
  });
}
