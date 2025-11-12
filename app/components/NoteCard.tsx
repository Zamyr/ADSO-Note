'use client';

import Link from 'next/link';
import { Note } from '@/lib/types/note';

interface NoteCardProps {
  note: Note;
}

export function NoteCard({ note }: NoteCardProps) {
  const formattedDate = new Date(note.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 hover:shadow-xl hover:border-gray-600 transition-all">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-semibold text-white line-clamp-1">
          {note.title}
        </h3>
        <Link
          href={`/notes/${note.id}/edit`}
          className="text-blue-400 hover:text-blue-300 text-sm font-medium"
        >
          Edit
        </Link>
      </div>
      <p className="text-gray-300 text-sm line-clamp-3 mb-4">{note.content}</p>
      <div className="text-xs text-gray-500">{formattedDate}</div>
    </div>
  );
}
