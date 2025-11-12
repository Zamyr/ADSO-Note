'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import * as yup from 'yup';
import { createNoteSchema } from '@/lib/validators/noteSchemas';

interface NoteFormProps {
  initialData?: {
    title: string;
    content: string;
  };
  onSubmit: (data: { title: string; content: string }) => Promise<void>;
  submitLabel: string;
  isSubmitting: boolean;
}

export function NoteForm({
  initialData = { title: '', content: '' },
  onSubmit,
  submitLabel,
  isSubmitting,
}: NoteFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState<{ title?: string; content?: string }>({});

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrors({});

    try {
      await createNoteSchema.validate(formData, { abortEarly: false });
      await onSubmit(formData);
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        const validationErrors: { title?: string; content?: string } = {};
        error.inner.forEach((err) => {
          if (err.path) {
            validationErrors[err.path as 'title' | 'content'] = err.message;
          }
        });
        setErrors(validationErrors);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-200 mb-2">
          Title
        </label>
        <input
          type="text"
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className={`w-full px-4 py-2 bg-gray-700 text-white border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400 ${
            errors.title ? 'border-red-500' : 'border-gray-600'
          }`}
          placeholder="Enter note title"
          disabled={isSubmitting}
        />
        {errors.title && <p className="mt-1 text-sm text-red-400">{errors.title}</p>}
      </div>

      <div>
        <label htmlFor="content" className="block text-sm font-medium text-gray-200 mb-2">
          Content
        </label>
        <textarea
          id="content"
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          rows={8}
          className={`w-full px-4 py-2 bg-gray-700 text-white border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none placeholder-gray-400 ${
            errors.content ? 'border-red-500' : 'border-gray-600'
          }`}
          placeholder="Enter note content"
          disabled={isSubmitting}
        />
        {errors.content && <p className="mt-1 text-sm text-red-400">{errors.content}</p>}
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          {isSubmitting ? 'Saving...' : submitLabel}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          disabled={isSubmitting}
          className="flex-1 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 text-gray-200 font-medium py-2 px-4 rounded-lg transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
