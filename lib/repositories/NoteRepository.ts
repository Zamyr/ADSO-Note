import { prisma } from '@/lib/db/prisma';

export class NoteRepository {
  private static instance: NoteRepository;

  private constructor() {}

  static getInstance(): NoteRepository {
    if (!NoteRepository.instance) {
      NoteRepository.instance = new NoteRepository();
    }
    return NoteRepository.instance;
  }

  async create(data: { title: string; content: string }) {
    return prisma.note.create({
      data: {
        title: data.title,
        content: data.content,
      },
    });
  }

  async findById(id: number) {
    return prisma.note.findUnique({
      where: { id },
    });
  }

  async findAll() {
    return prisma.note.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async update(id: number, data: Partial<{ title: string; content: string }>) {
    return prisma.note.update({
      where: { id },
      data,
    });
  }
}
