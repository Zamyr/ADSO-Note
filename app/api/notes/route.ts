import { NextRequest, NextResponse } from 'next/server';
import { NoteRepository } from '@/lib/repositories/NoteRepository';
import { createNoteSchema } from '@/lib/validators/noteSchemas';

const noteRepository = NoteRepository.getInstance();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = await createNoteSchema.validate(body);

    const note = await noteRepository.create(validatedData);

    return NextResponse.json({ id: note.id }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.name === 'ValidationError') {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const notes = await noteRepository.findAll();
    return NextResponse.json(notes, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
