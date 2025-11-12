'use client';

import { useQuery } from '@tanstack/react-query';
import { Note } from '@/lib/types/note';

async function fetchNote(id: number): Promise<Note> {
  const response = await fetch(`/api/note/${id}`);
  if (!response.ok) throw new Error('Failed to fetch note');
  return response.json();
}

export function useNote(id: number) {
  return useQuery({
    queryKey: ['note', id],
    queryFn: () => fetchNote(id),
  });
}
