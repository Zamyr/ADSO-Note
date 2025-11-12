import { NextRequest, NextResponse } from 'next/server';
import { NoteRepository } from '@/lib/repositories/NoteRepository';
import { updateNoteSchema } from '@/lib/validators/noteSchemas';

const noteRepository = NoteRepository.getInstance();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const noteId = parseInt(id, 10);

    if (isNaN(noteId)) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
    }

    const note = await noteRepository.findById(noteId);

    if (!note) {
      return NextResponse.json({ error: 'Nota no encontrada' }, { status: 404 });
    }

    return NextResponse.json(note, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const noteId = parseInt(id, 10);

    if (isNaN(noteId)) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
    }

    const body = await request.json();
    const validatedData = await updateNoteSchema.validate(body);

    const note = await noteRepository.update(noteId, validatedData);

    return NextResponse.json(note, { status: 200 });
  } catch (error) {
    if (error instanceof Error && error.name === 'ValidationError') {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    if (error instanceof Error && error.message.includes('Record to update not found')) {
      return NextResponse.json({ error: 'Nota no encontrada' }, { status: 404 });
    }

    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
