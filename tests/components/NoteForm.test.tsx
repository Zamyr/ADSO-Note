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
      title: 'Título de Prueba',
      content: 'Contenido de Prueba',
    };

    render(
      <NoteForm
        initialData={initialData}
        onSubmit={mockOnSubmit}
        submitLabel="Actualizar"
        isSubmitting={false}
      />
    );

    expect(screen.getByLabelText(/título/i)).toHaveValue('Título de Prueba');
    expect(screen.getByLabelText(/contenido/i)).toHaveValue('Contenido de Prueba');
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

    fireEvent.change(titleInput, { target: { value: 'Título Nuevo' } });
    fireEvent.change(contentInput, { target: { value: 'Contenido Nuevo' } });

    expect(titleInput).toHaveValue('Título Nuevo');
    expect(contentInput).toHaveValue('Contenido Nuevo');
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
      expect(screen.getByText('El título es requerido')).toBeInTheDocument();
      expect(screen.getByText('El contenido es requerido')).toBeInTheDocument();
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
    fireEvent.change(screen.getByLabelText(/contenido/i), { target: { value: 'Contenido válido' } });

    const submitButton = screen.getByRole('button', { name: /crear/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Título demasiado largo')).toBeInTheDocument();
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

    fireEvent.change(screen.getByLabelText(/título/i), { target: { value: 'Título Válido' } });
    fireEvent.change(screen.getByLabelText(/contenido/i), { target: { value: 'Contenido Válido' } });

    const submitButton = screen.getByRole('button', { name: /crear/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        title: 'Título Válido',
        content: 'Contenido Válido',
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
