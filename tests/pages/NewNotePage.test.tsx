import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import NewNotePage from '@/app/notes/new/page';
import { useCreateNote } from '@/lib/hooks/useCreateNote';
import { useRouter } from 'next/navigation';

jest.mock('@/lib/hooks/useCreateNote');
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('NewNotePage', () => {
  const mockPush = jest.fn();
  const mockMutateAsync = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    (useCreateNote as jest.Mock).mockReturnValue({
      mutateAsync: mockMutateAsync,
      isPending: false,
    });
  });

  it('renderiza el título de la página', () => {
    render(<NewNotePage />);
    expect(screen.getByText('Crear Nueva Nota')).toBeInTheDocument();
  });

  it('renderiza el componente NoteForm', () => {
    render(<NewNotePage />);
    expect(screen.getByLabelText(/título/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/contenido/i)).toBeInTheDocument();
  });

  it('llama createNote y navega en envío exitoso', async () => {
    mockMutateAsync.mockResolvedValue({ id: 1 });

    render(<NewNotePage />);

    fireEvent.change(screen.getByLabelText(/título/i), { target: { value: 'New Note' } });
    fireEvent.change(screen.getByLabelText(/contenido/i), { target: { value: 'Note content' } });

    const submitButton = screen.getByRole('button', { name: /crear nota/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockMutateAsync).toHaveBeenCalledWith({
        title: 'New Note',
        content: 'Note content',
      });
    });

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/notes');
    });
  });

  it('muestra estado de carga durante el envío', () => {
    (useCreateNote as jest.Mock).mockReturnValue({
      mutateAsync: mockMutateAsync,
      isPending: true,
    });

    render(<NewNotePage />);

    expect(screen.getByRole('button', { name: /guardando/i })).toBeDisabled();
  });

  it('aplica estilos de tema oscuro', () => {
    const { container } = render(<NewNotePage />);
    expect(container.querySelector('.bg-gray-900')).toBeInTheDocument();
    expect(container.querySelector('.bg-gray-800')).toBeInTheDocument();
  });
});
