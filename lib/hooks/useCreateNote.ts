'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CreateNoteInput } from '@/lib/validators/noteSchemas';

async function createNote(data: CreateNoteInput): Promise<{ id: number }> {
  const response = await fetch('/api/notes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create note');
  }

  return response.json();
}

export function useCreateNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
  });
}
