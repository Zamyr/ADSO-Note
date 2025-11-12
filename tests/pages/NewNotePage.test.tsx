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

  it('renders page title', () => {
    render(<NewNotePage />);
    expect(screen.getByText('Create New Note')).toBeInTheDocument();
  });

  it('renders NoteForm component', () => {
    render(<NewNotePage />);
    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/content/i)).toBeInTheDocument();
  });

  it('calls createNote and navigates on successful submission', async () => {
    mockMutateAsync.mockResolvedValue({ id: 1 });

    render(<NewNotePage />);

    fireEvent.change(screen.getByLabelText(/title/i), { target: { value: 'New Note' } });
    fireEvent.change(screen.getByLabelText(/content/i), { target: { value: 'Note content' } });

    const submitButton = screen.getByRole('button', { name: /create note/i });
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

  it('shows loading state during submission', () => {
    (useCreateNote as jest.Mock).mockReturnValue({
      mutateAsync: mockMutateAsync,
      isPending: true,
    });

    render(<NewNotePage />);

    expect(screen.getByRole('button', { name: /saving/i })).toBeDisabled();
  });

  it('applies dark theme styles', () => {
    const { container } = render(<NewNotePage />);
    expect(container.querySelector('.bg-gray-900')).toBeInTheDocument();
    expect(container.querySelector('.bg-gray-800')).toBeInTheDocument();
  });
});
