import { render, screen } from '@testing-library/react';
import { NoteCard } from '@/app/components/NoteCard';
import { Note } from '@/lib/types/note';

describe('NoteCard', () => {
  const mockNote: Note = {
    id: 1,
    title: 'Test Note',
    content: 'This is test content for the note',
    createdAt: new Date('2025-11-10T10:00:00Z'),
    updatedAt: new Date('2025-11-10T10:00:00Z'),
  };

  it('renderiza el título de la nota', () => {
    render(<NoteCard note={mockNote} />);
    expect(screen.getByText('Test Note')).toBeInTheDocument();
  });

  it('renderiza el contenido de la nota', () => {
    render(<NoteCard note={mockNote} />);
    expect(screen.getByText('This is test content for the note')).toBeInTheDocument();
  });

  it('renderiza la fecha formateada', () => {
    render(<NoteCard note={mockNote} />);
    expect(screen.getByText('Nov 10, 2025')).toBeInTheDocument();
  });

  it('renderiza el enlace de edición con href correcto', () => {
    render(<NoteCard note={mockNote} />);
    const editLink = screen.getByRole('link', { name: /edit/i });
    expect(editLink).toHaveAttribute('href', '/notes/1/edit');
  });

  it('trunca títulos largos con line-clamp-1', () => {
    const longTitleNote: Note = {
      ...mockNote,
      title: 'This is a very long title that should be truncated with line clamp',
    };
    const { container } = render(<NoteCard note={longTitleNote} />);
    const titleElement = container.querySelector('.line-clamp-1');
    expect(titleElement).toBeInTheDocument();
  });

  it('trunca contenido largo con line-clamp-3', () => {
    const longContentNote: Note = {
      ...mockNote,
      content: 'This is a very long content that should be truncated. '.repeat(10),
    };
    const { container } = render(<NoteCard note={longContentNote} />);
    const contentElement = container.querySelector('.line-clamp-3');
    expect(contentElement).toBeInTheDocument();
  });

  it('aplica estilos de tema oscuro', () => {
    const { container } = render(<NoteCard note={mockNote} />);
    const card = container.firstChild;
    expect(card).toHaveClass('bg-gray-800', 'border-gray-700');
  });
});
