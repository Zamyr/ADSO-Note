import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { NoteForm } from '@/app/components/NoteForm';
import { useRouter } from 'next/navigation';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('NoteForm', () => {
  const mockOnSubmit = jest.fn();
  const mockRouter = { back: jest.fn() };

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  it('renderiza el formulario con campos vacíos por defecto', () => {
    render(
      <NoteForm
        onSubmit={mockOnSubmit}
        submitLabel="Create"
        isSubmitting={false}
      />
    );

    expect(screen.getByLabelText(/title/i)).toHaveValue('');
    expect(screen.getByLabelText(/content/i)).toHaveValue('');
  });

  it('renderiza el formulario con datos iniciales', () => {
    const initialData = {
      title: 'Test Title',
      content: 'Test Content',
    };

    render(
      <NoteForm
        initialData={initialData}
        onSubmit={mockOnSubmit}
        submitLabel="Update"
        isSubmitting={false}
      />
    );

    expect(screen.getByLabelText(/title/i)).toHaveValue('Test Title');
    expect(screen.getByLabelText(/content/i)).toHaveValue('Test Content');
  });

  it('actualiza los campos del formulario cuando el usuario escribe', () => {
    render(
      <NoteForm
        onSubmit={mockOnSubmit}
        submitLabel="Create"
        isSubmitting={false}
      />
    );

    const titleInput = screen.getByLabelText(/title/i);
    const contentInput = screen.getByLabelText(/content/i);

    fireEvent.change(titleInput, { target: { value: 'New Title' } });
    fireEvent.change(contentInput, { target: { value: 'New Content' } });

    expect(titleInput).toHaveValue('New Title');
    expect(contentInput).toHaveValue('New Content');
  });

  it('muestra errores de validación para campos vacíos', async () => {
    render(
      <NoteForm
        onSubmit={mockOnSubmit}
        submitLabel="Create"
        isSubmitting={false}
      />
    );

    const submitButton = screen.getByRole('button', { name: /create/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Title is required')).toBeInTheDocument();
      expect(screen.getByText('Content is required')).toBeInTheDocument();
    });

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('muestra error de validación para título que excede 255 caracteres', async () => {
    render(
      <NoteForm
        onSubmit={mockOnSubmit}
        submitLabel="Create"
        isSubmitting={false}
      />
    );

    const titleInput = screen.getByLabelText(/title/i);
    const longTitle = 'a'.repeat(256);

    fireEvent.change(titleInput, { target: { value: longTitle } });
    fireEvent.change(screen.getByLabelText(/content/i), { target: { value: 'Valid content' } });

    const submitButton = screen.getByRole('button', { name: /create/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Title too long')).toBeInTheDocument();
    });

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('llama onSubmit con los datos del formulario en envío válido', async () => {
    mockOnSubmit.mockResolvedValue(undefined);

    render(
      <NoteForm
        onSubmit={mockOnSubmit}
        submitLabel="Create"
        isSubmitting={false}
      />
    );

    fireEvent.change(screen.getByLabelText(/title/i), { target: { value: 'Valid Title' } });
    fireEvent.change(screen.getByLabelText(/content/i), { target: { value: 'Valid Content' } });

    const submitButton = screen.getByRole('button', { name: /create/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        title: 'Valid Title',
        content: 'Valid Content',
      });
    });
  });

  it('deshabilita inputs y botón cuando isSubmitting es true', () => {
    render(
      <NoteForm
        onSubmit={mockOnSubmit}
        submitLabel="Create"
        isSubmitting={true}
      />
    );

    expect(screen.getByLabelText(/title/i)).toBeDisabled();
    expect(screen.getByLabelText(/content/i)).toBeDisabled();
    expect(screen.getByRole('button', { name: /saving/i })).toBeDisabled();
    expect(screen.getByRole('button', { name: /cancel/i })).toBeDisabled();
  });

  it('muestra texto "Saving..." cuando isSubmitting es true', () => {
    render(
      <NoteForm
        onSubmit={mockOnSubmit}
        submitLabel="Create"
        isSubmitting={true}
      />
    );

    expect(screen.getByRole('button', { name: /saving/i })).toBeInTheDocument();
  });

  it('llama router.back() cuando se hace clic en el botón cancelar', () => {
    render(
      <NoteForm
        onSubmit={mockOnSubmit}
        submitLabel="Create"
        isSubmitting={false}
      />
    );

    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    fireEvent.click(cancelButton);

    expect(mockRouter.back).toHaveBeenCalled();
  });

  it('aplica estilos de error a campos con errores de validación', async () => {
    render(
      <NoteForm
        onSubmit={mockOnSubmit}
        submitLabel="Create"
        isSubmitting={false}
      />
    );

    const submitButton = screen.getByRole('button', { name: /create/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      const titleInput = screen.getByLabelText(/title/i);
      const contentInput = screen.getByLabelText(/content/i);

      expect(titleInput).toHaveClass('border-red-500');
      expect(contentInput).toHaveClass('border-red-500');
    });
  });
});
