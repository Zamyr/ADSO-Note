import { prisma } from '@/lib/db/prisma';

describe('Integración de Endpoints API', () => {
  const baseUrl = 'http://localhost:3000/api';

  afterEach(async () => {
    await prisma.note.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('POST /api/notes', () => {
    it('debería crear una nota y retornar 201 con id', async () => {
      const response = await fetch(`${baseUrl}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: 'Nota de Prueba de Integración',
          content: 'Este es un test',
        }),
      });

      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data).toHaveProperty('id');
      expect(typeof data.id).toBe('number');
    });

    it('debería retornar 400 cuando falta el título', async () => {
      const response = await fetch(`${baseUrl}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: 'Sin título' }),
      });

      expect(response.status).toBe(400);
    });
  });

  describe('GET /api/notes', () => {
    it('debería retornar todas las notas', async () => {
      await fetch(`${baseUrl}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'Nota 1', content: 'Contenido 1' }),
      });

      await fetch(`${baseUrl}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'Nota 2', content: 'Contenido 2' }),
      });

      const response = await fetch(`${baseUrl}/notes`);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(Array.isArray(data)).toBe(true);
      expect(data.length).toBe(2);
    });
  });

  describe('GET /api/note/:id', () => {
    it('debería retornar nota por id', async () => {
      const createResponse = await fetch(`${baseUrl}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'Encuéntrame', content: 'Contenido' }),
      });

      const { id } = await createResponse.json();

      const response = await fetch(`${baseUrl}/note/${id}`);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.id).toBe(id);
      expect(data.title).toBe('Encuéntrame');
    });

    it('debería retornar 404 cuando la nota no existe', async () => {
      const response = await fetch(`${baseUrl}/note/999999`);
      expect(response.status).toBe(404);
    });
  });

  describe('PATCH /api/note/:id', () => {
    it('debería actualizar nota', async () => {
      const createResponse = await fetch(`${baseUrl}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'Original', content: 'Original' }),
      });

      const { id } = await createResponse.json();

      const response = await fetch(`${baseUrl}/note/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'Actualizado' }),
      });

      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.title).toBe('Actualizado');
      expect(data.content).toBe('Original');
    });

    it('debería retornar 404 cuando se actualiza nota inexistente', async () => {
      const response = await fetch(`${baseUrl}/note/999999`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'Actualizado' }),
      });

      expect(response.status).toBe(404);
    });
  });
});
