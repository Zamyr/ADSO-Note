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
        submitLabel="Crear"
        isSubmitting={false}
      />
    );

    expect(screen.getByLabelText(/título/i)).toHaveValue('');
    expect(screen.getByLabelText(/contenido/i)).toHaveValue('');
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
        submitLabel="Actualizar"
        isSubmitting={false}
      />
    );

    expect(screen.getByLabelText(/título/i)).toHaveValue('Test Title');
    expect(screen.getByLabelText(/contenido/i)).toHaveValue('Test Content');
  });

  it('actualiza los campos del formulario cuando el usuario escribe', () => {
    render(
      <NoteForm
        onSubmit={mockOnSubmit}
        submitLabel="Crear"
        isSubmitting={false}
      />
    );

    const titleInput = screen.getByLabelText(/título/i);
    const contentInput = screen.getByLabelText(/contenido/i);

    fireEvent.change(titleInput, { target: { value: 'New Title' } });
    fireEvent.change(contentInput, { target: { value: 'New Content' } });

    expect(titleInput).toHaveValue('New Title');
    expect(contentInput).toHaveValue('New Content');
  });

  it('muestra errores de validación para campos vacíos', async () => {
    render(
      <NoteForm
        onSubmit={mockOnSubmit}
        submitLabel="Crear"
        isSubmitting={false}
      />
    );

    const submitButton = screen.getByRole('button', { name: /crear/i });
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
        submitLabel="Crear"
        isSubmitting={false}
      />
    );

    const titleInput = screen.getByLabelText(/título/i);
    const longTitle = 'a'.repeat(256);

    fireEvent.change(titleInput, { target: { value: longTitle } });
    fireEvent.change(screen.getByLabelText(/contenido/i), { target: { value: 'Valid content' } });

    const submitButton = screen.getByRole('button', { name: /crear/i });
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
        submitLabel="Crear"
        isSubmitting={false}
      />
    );

    fireEvent.change(screen.getByLabelText(/título/i), { target: { value: 'Valid Title' } });
    fireEvent.change(screen.getByLabelText(/contenido/i), { target: { value: 'Valid Content' } });

    const submitButton = screen.getByRole('button', { name: /crear/i });
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
        submitLabel="Crear"
        isSubmitting={true}
      />
    );

    expect(screen.getByLabelText(/título/i)).toBeDisabled();
    expect(screen.getByLabelText(/contenido/i)).toBeDisabled();
    expect(screen.getByRole('button', { name: /guardando/i })).toBeDisabled();
    expect(screen.getByRole('button', { name: /cancelar/i })).toBeDisabled();
  });

  it('muestra texto "Guardando..." cuando isSubmitting es true', () => {
    render(
      <NoteForm
        onSubmit={mockOnSubmit}
        submitLabel="Crear"
        isSubmitting={true}
      />
    );

    expect(screen.getByRole('button', { name: /guardando/i })).toBeInTheDocument();
  });

  it('llama router.back() cuando se hace clic en el botón cancelar', () => {
    render(
      <NoteForm
        onSubmit={mockOnSubmit}
        submitLabel="Crear"
        isSubmitting={false}
      />
    );

    const cancelButton = screen.getByRole('button', { name: /cancelar/i });
    fireEvent.click(cancelButton);

    expect(mockRouter.back).toHaveBeenCalled();
  });

  it('aplica estilos de error a campos con errores de validación', async () => {
    render(
      <NoteForm
        onSubmit={mockOnSubmit}
        submitLabel="Crear"
        isSubmitting={false}
      />
    );

    const submitButton = screen.getByRole('button', { name: /crear/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      const titleInput = screen.getByLabelText(/título/i);
      const contentInput = screen.getByLabelText(/contenido/i);

      expect(titleInput).toHaveClass('border-red-500');
      expect(contentInput).toHaveClass('border-red-500');
    });
  });
});
