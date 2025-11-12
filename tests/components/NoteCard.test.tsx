import { render, screen } from '@testing-library/react';
import { NoteCard } from '@/app/components/NoteCard';
import { Note } from '@/lib/types/note';

describe('NoteCard', () => {
  const mockNote: Note = {
    id: 1,
    title: 'Nota de Prueba',
    content: 'Este es el contenido de prueba para la nota',
    createdAt: new Date('2025-11-10T10:00:00Z'),
    updatedAt: new Date('2025-11-10T10:00:00Z'),
  };

  it('renderiza el título de la nota', () => {
    render(<NoteCard note={mockNote} />);
    expect(screen.getByText('Nota de Prueba')).toBeInTheDocument();
  });

  it('renderiza el contenido de la nota', () => {
    render(<NoteCard note={mockNote} />);
    expect(screen.getByText('Este es el contenido de prueba para la nota')).toBeInTheDocument();
  });

  it('renderiza la fecha formateada', () => {
    render(<NoteCard note={mockNote} />);
    expect(screen.getByText('10 nov 2025')).toBeInTheDocument();
  });

  it('renderiza el enlace de edición con href correcto', () => {
    render(<NoteCard note={mockNote} />);
    const editLink = screen.getByRole('link', { name: /editar/i });
    expect(editLink).toHaveAttribute('href', '/notes/1/edit');
  });

  it('trunca títulos largos con line-clamp-1', () => {
    const longTitleNote: Note = {
      ...mockNote,
      title: 'Este es un título muy largo que debería truncarse con line clamp',
    };
    const { container } = render(<NoteCard note={longTitleNote} />);
    const titleElement = container.querySelector('.line-clamp-1');
    expect(titleElement).toBeInTheDocument();
  });

  it('trunca contenido largo con line-clamp-3', () => {
    const longContentNote: Note = {
      ...mockNote,
      content: 'Este es un contenido muy largo que debería truncarse. '.repeat(10),
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
