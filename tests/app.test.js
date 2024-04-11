const request = require('supertest');
const { app } = require('../app'); // Ensure this is the correct path to your Express app

jest.mock('ioredis', () => jest.fn().mockImplementation(() => ({
  get: jest.fn().mockResolvedValue(null),
  set: jest.fn().mockResolvedValue('OK'),
  expire: jest.fn().mockResolvedValue('OK'),
  incr: jest.fn().mockResolvedValue(1),
  hincrby: jest.fn().mockResolvedValue(1),
  del: jest.fn().mockResolvedValue(1)
})));

describe('URL Shortening Service', () => {
  describe('POST /shorten', () => {
    it('should create a short URL', async () => {
      const longUrl = 'https://www.example.com';
      const response = await request(app)
        .post('/shorten')
        .send({ longUrl, expiresIn: 100 });

      expect(response.statusCode).toBe(200);
      expect(response.body.shortUrl).toBeDefined();
    });

    it('rejects requests without a long URL', async () => {
      const response = await request(app)
        .post('/shorten')
        .send({}); // No URL provided

      expect(response.statusCode).toBe(400);
    });
  });

  describe('GET /:shortCode', () => {
    it('redirects to the original URL', async () => {
      // Pre-populate a known shortCode for the test or mock the retrieval logic
      const shortCode = 'cdb4d8'; // This should correspond to a pre-mocked URL in your test setup
      const response = await request(app).get(`/${shortCode}`);

      expect(response.statusCode).toBe(302); // HTTP status code for redirection
    });

    it('returns 404 for an invalid shortCode', async () => {
      const invalidShortCode = 'invalidCode';
      const response = await request(app).get(`/${invalidShortCode}`);

      expect(response.statusCode).toBe(404);
    });
  });
});