import { prisma } from '@/lib/db/prisma';

describe('API Endpoints Integration', () => {
  const baseUrl = 'http://localhost:3000/api';

  afterEach(async () => {
    await prisma.note.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('POST /api/notes', () => {
    it('should create a note and return 201 with id', async () => {
      const response = await fetch(`${baseUrl}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: 'Integration Test Note',
          content: 'This is a test',
        }),
      });

      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data).toHaveProperty('id');
      expect(typeof data.id).toBe('number');
    });

    it('should return 400 when title is missing', async () => {
      const response = await fetch(`${baseUrl}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: 'No title' }),
      });

      expect(response.status).toBe(400);
    });
  });

  describe('GET /api/notes', () => {
    it('should return all notes', async () => {
      await fetch(`${baseUrl}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'Note 1', content: 'Content 1' }),
      });

      await fetch(`${baseUrl}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'Note 2', content: 'Content 2' }),
      });

      const response = await fetch(`${baseUrl}/notes`);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(Array.isArray(data)).toBe(true);
      expect(data.length).toBe(2);
    });
  });

  describe('GET /api/note/:id', () => {
    it('should return note by id', async () => {
      const createResponse = await fetch(`${baseUrl}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'Find Me', content: 'Content' }),
      });

      const { id } = await createResponse.json();

      const response = await fetch(`${baseUrl}/note/${id}`);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.id).toBe(id);
      expect(data.title).toBe('Find Me');
    });

    it('should return 404 when note does not exist', async () => {
      const response = await fetch(`${baseUrl}/note/999999`);
      expect(response.status).toBe(404);
    });
  });

  describe('PATCH /api/note/:id', () => {
    it('should update note', async () => {
      const createResponse = await fetch(`${baseUrl}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'Original', content: 'Original' }),
      });

      const { id } = await createResponse.json();

      const response = await fetch(`${baseUrl}/note/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'Updated' }),
      });

      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.title).toBe('Updated');
      expect(data.content).toBe('Original');
    });

    it('should return 404 when updating non-existent note', async () => {
      const response = await fetch(`${baseUrl}/note/999999`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'Updated' }),
      });

      expect(response.status).toBe(404);
    });
  });
});
