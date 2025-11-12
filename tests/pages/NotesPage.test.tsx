import { render, screen } from '@testing-library/react';
import NotesPage from '@/app/notes/page';
import { useNotes } from '@/lib/hooks/useNotes';
import { Note } from '@/lib/types/note';

jest.mock('@/lib/hooks/useNotes');
jest.mock('next/link', () => {
  const MockLink = ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>;
  };
  MockLink.displayName = 'MockLink';
  return MockLink;
});

describe('NotesPage', () => {
  const mockNotes: Note[] = [
    {
      id: 1,
      title: 'First Note',
      content: 'First note content',
      createdAt: new Date('2025-11-10T10:00:00Z'),
      updatedAt: new Date('2025-11-10T10:00:00Z'),
    },
    {
      id: 2,
      title: 'Second Note',
      content: 'Second note content',
      createdAt: new Date('2025-11-09T10:00:00Z'),
      updatedAt: new Date('2025-11-09T10:00:00Z'),
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('muestra estado de carga', () => {
    (useNotes as jest.Mock).mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      error: null,
    });

    const { container } = render(<NotesPage />);

    expect(screen.getByText('Loading notes...')).toBeInTheDocument();
    expect(container.querySelector('.animate-spin')).toBeInTheDocument();
  });

  it('muestra estado de error', () => {
    (useNotes as jest.Mock).mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true,
      error: new Error('Failed to fetch'),
    });

    render(<NotesPage />);

    expect(screen.getByText('Error Loading Notes')).toBeInTheDocument();
    expect(screen.getByText('Failed to fetch')).toBeInTheDocument();
  });

  it('muestra estado vacío cuando no hay notas', () => {
    (useNotes as jest.Mock).mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
      error: null,
    });

    render(<NotesPage />);

    expect(screen.getByText('No notes yet. Create your first note!')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /create note/i })).toHaveAttribute('href', '/notes/new');
  });

  it('renderiza la lista de notas', () => {
    (useNotes as jest.Mock).mockReturnValue({
      data: mockNotes,
      isLoading: false,
      isError: false,
      error: null,
    });

    render(<NotesPage />);

    expect(screen.getByText('My Notes')).toBeInTheDocument();
    expect(screen.getByText('First Note')).toBeInTheDocument();
    expect(screen.getByText('Second Note')).toBeInTheDocument();
  });

  it('renderiza el botón New Note en el header', () => {
    (useNotes as jest.Mock).mockReturnValue({
      data: mockNotes,
      isLoading: false,
      isError: false,
      error: null,
    });

    render(<NotesPage />);

    const newNoteButton = screen.getByRole('link', { name: /new note/i });
    expect(newNoteButton).toHaveAttribute('href', '/notes/new');
  });

  it('aplica estilos de tema oscuro', () => {
    (useNotes as jest.Mock).mockReturnValue({
      data: mockNotes,
      isLoading: false,
      isError: false,
      error: null,
    });

    const { container } = render(<NotesPage />);

    expect(container.querySelector('.bg-gray-900')).toBeInTheDocument();
  });
});
