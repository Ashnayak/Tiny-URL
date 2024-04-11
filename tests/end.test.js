const request = require('supertest');
const { app } = require('../app');

describe('URL Shortening Service', () => {
  describe('/shorten endpoint', () => {
    it('creates a short URL', async () => {
      const response = await request(app)
        .post('/shorten')
        .send({ longUrl: 'https://example.com', expiresIn: 100 });

      expect(response.statusCode).toBe(200);
      expect(response.body.shortUrl).toBeDefined();
    });

    it('returns an error when longUrl is not provided', async () => {
      const response = await request(app).post('/shorten').send({});
      expect(response.statusCode).toBe(400);
    });
  });

  describe('/:shortCode endpoint', () => {
    it('redirects to the original URL', async () => {
      const response = await request(app).get('/abc123');
      expect(response.statusCode).toBe(302);
    });

    it('returns 404 for unknown shortCode', async () => {
      const response = await request(app).get('/unknown');
      expect(response.statusCode).toBe(404);
    });
  });

  describe('/stats/:shortCode endpoint', () => {
    it('retrieves stats for a short URL', async () => {
      const response = await request(app).get('/stats/abc123');
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('totalAccesses');
    });

    it('returns 404 for stats of unknown shortCode', async () => {
      const response = await request(app).get('/stats/unknown');
      expect(response.statusCode).toBe(404);
    });
  });

  describe('/delete/:shortCode endpoint', () => {
    it('deletes a short URL', async () => {
      const response = await request(app).delete('/delete/abc123');
      expect(response.statusCode).toBe(200);
    });
  });
});