'use client';

import { useQuery } from '@tanstack/react-query';
import { Note } from '@/lib/types/note';

async function fetchNotes(): Promise<Note[]> {
  const response = await fetch('/api/notes');
  if (!response.ok) throw new Error('Failed to fetch notes');
  return response.json();
}

export function useNotes() {
  return useQuery({
    queryKey: ['notes'],
    queryFn: fetchNotes,
  });
}
