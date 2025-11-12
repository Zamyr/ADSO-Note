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

  it('renders form with empty fields by default', () => {
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

  it('renders form with initial data', () => {
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

  it('updates form fields on user input', () => {
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

  it('shows validation errors for empty fields', async () => {
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

  it('shows validation error for title exceeding 255 characters', async () => {
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

  it('calls onSubmit with form data on valid submission', async () => {
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

  it('disables inputs and button when isSubmitting is true', () => {
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

  it('shows "Saving..." text when isSubmitting is true', () => {
    render(
      <NoteForm
        onSubmit={mockOnSubmit}
        submitLabel="Create"
        isSubmitting={true}
      />
    );

    expect(screen.getByRole('button', { name: /saving/i })).toBeInTheDocument();
  });

  it('calls router.back() when cancel button is clicked', () => {
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

  it('applies error styling to fields with validation errors', async () => {
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
