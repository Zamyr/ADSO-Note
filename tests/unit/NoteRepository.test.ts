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
    it('debería crear una nota con datos válidos', async () => {
      const noteData = {
        title: 'Nota de Prueba',
        content: 'Este es el contenido de una nota de prueba',
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
    it('debería encontrar nota por id', async () => {
      const created = await noteRepository.create({
        title: 'Prueba Buscar',
        content: 'Contenido',
      });

      const found = await noteRepository.findById(created.id);

      expect(found).not.toBeNull();
      expect(found?.id).toBe(created.id);
      expect(found?.title).toBe('Prueba Buscar');
    });

    it('debería retornar null cuando la nota no existe', async () => {
      const found = await noteRepository.findById(999999);
      expect(found).toBeNull();
    });
  });

  describe('findAll', () => {
    it('debería listar todas las notas', async () => {
      await noteRepository.create({ title: 'Nota 1', content: 'Contenido 1' });
      await noteRepository.create({ title: 'Nota 2', content: 'Contenido 2' });
      await noteRepository.create({ title: 'Nota 3', content: 'Contenido 3' });

      const notes = await noteRepository.findAll();

      expect(notes).toHaveLength(3);
      expect(notes[0].title).toBe('Nota 3');
    });

    it('debería retornar array vacío cuando no hay notas', async () => {
      const notes = await noteRepository.findAll();
      expect(notes).toEqual([]);
    });
  });

  describe('update', () => {
    it('debería actualizar nota', async () => {
      const created = await noteRepository.create({
        title: 'Título Original',
        content: 'Contenido Original',
      });

      const updated = await noteRepository.update(created.id, {
        title: 'Título Actualizado',
        content: 'Contenido Actualizado',
      });

      expect(updated.title).toBe('Título Actualizado');
      expect(updated.content).toBe('Contenido Actualizado');
      expect(updated.updatedAt.getTime()).toBeGreaterThan(
        created.updatedAt.getTime()
      );
    });

    it('debería actualizar solo los campos proporcionados', async () => {
      const created = await noteRepository.create({
        title: 'Original',
        content: 'Original',
      });

      const updated = await noteRepository.update(created.id, {
        title: 'Solo Título Actualizado',
      });

      expect(updated.title).toBe('Solo Título Actualizado');
      expect(updated.content).toBe('Original');
    });

    it('debería lanzar error cuando la nota no existe', async () => {
      await expect(
        noteRepository.update(999999, { title: 'Título Nuevo' })
      ).rejects.toThrow();
    });
  });
});
