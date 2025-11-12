import * as yup from 'yup';

export const createNoteSchema = yup.object({
  title: yup.string().required('Title is required').max(255, 'Title too long'),
  content: yup.string().required('Content is required'),
});

export const updateNoteSchema = yup.object({
  title: yup.string().max(255, 'Title too long').optional(),
  content: yup.string().optional(),
});

export type CreateNoteInput = yup.InferType<typeof createNoteSchema>;
export type UpdateNoteInput = yup.InferType<typeof updateNoteSchema>;
