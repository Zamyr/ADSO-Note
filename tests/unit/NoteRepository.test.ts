import { prisma } from '@/lib/db/prisma';
import { NoteRepository } from '@/lib/repositories/NoteRepository';

describe('NoteRepository', () => {
  let noteRepository: NoteRepository;

  beforeAll(() => {
    noteRepository = NoteRepository.getInstance();
  });

  afterEach(async () => {
    await prisma.note.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('create', () => {
    it('should create a note with valid data', async () => {
      const noteData = {
        title: 'Test Note',
        content: 'This is a test note content',
      };

      const note = await noteRepository.create(noteData);

      expect(note).toHaveProperty('id');
      expect(note.title).toBe(noteData.title);
      expect(note.content).toBe(noteData.content);
      expect(note.createdAt).toBeInstanceOf(Date);
      expect(note.updatedAt).toBeInstanceOf(Date);
    });
  });

  describe('findById', () => {
    it('should find note by id', async () => {
      const created = await noteRepository.create({
        title: 'Find Test',
        content: 'Content',
      });

      const found = await noteRepository.findById(created.id);

      expect(found).not.toBeNull();
      expect(found?.id).toBe(created.id);
      expect(found?.title).toBe('Find Test');
    });

    it('should return null when note does not exist', async () => {
      const found = await noteRepository.findById(999999);
      expect(found).toBeNull();
    });
  });

  describe('findAll', () => {
    it('should list all notes', async () => {
      await noteRepository.create({ title: 'Note 1', content: 'Content 1' });
      await noteRepository.create({ title: 'Note 2', content: 'Content 2' });
      await noteRepository.create({ title: 'Note 3', content: 'Content 3' });

      const notes = await noteRepository.findAll();

      expect(notes).toHaveLength(3);
      expect(notes[0].title).toBe('Note 3');
    });

    it('should return empty array when no notes exist', async () => {
      const notes = await noteRepository.findAll();
      expect(notes).toEqual([]);
    });
  });

  describe('update', () => {
    it('should update note', async () => {
      const created = await noteRepository.create({
        title: 'Original Title',
        content: 'Original Content',
      });

      const updated = await noteRepository.update(created.id, {
        title: 'Updated Title',
        content: 'Updated Content',
      });

      expect(updated.title).toBe('Updated Title');
      expect(updated.content).toBe('Updated Content');
      expect(updated.updatedAt.getTime()).toBeGreaterThan(
        created.updatedAt.getTime()
      );
    });

    it('should update only provided fields', async () => {
      const created = await noteRepository.create({
        title: 'Original',
        content: 'Original',
      });

      const updated = await noteRepository.update(created.id, {
        title: 'Updated Title Only',
      });

      expect(updated.title).toBe('Updated Title Only');
      expect(updated.content).toBe('Original');
    });

    it('should throw error when note does not exist', async () => {
      await expect(
        noteRepository.update(999999, { title: 'New Title' })
      ).rejects.toThrow();
    });
  });
});
