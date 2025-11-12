import * as yup from 'yup';

export const createNoteSchema = yup.object({
  title: yup.string().required('El título es requerido').max(255, 'Título demasiado largo'),
  content: yup.string().required('El contenido es requerido'),
});

export const updateNoteSchema = yup.object({
  title: yup.string().max(255, 'Título demasiado largo').optional(),
  content: yup.string().optional(),
});

export type CreateNoteInput = yup.InferType<typeof createNoteSchema>;
export type UpdateNoteInput = yup.InferType<typeof updateNoteSchema>;
