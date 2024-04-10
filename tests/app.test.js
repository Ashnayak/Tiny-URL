const request = require('supertest');
const { app } = require('../app'); 

// Mocking Redis client
jest.mock('ioredis', () => {
  return jest.fn().mockImplementation(() => ({
    get: jest.fn().mockResolvedValue(null),
    set: jest.fn().mockResolvedValue('OK'),
    expire: jest.fn().mockResolvedValue('OK'),
    incr: jest.fn().mockResolvedValue(1),
    hincrby: jest.fn().mockResolvedValue(1),
    del: jest.fn().mockResolvedValue(1)
  }));
});

describe('URL Shortening Service', () => {
  describe('POST /shorten', () => {
    it('should create a short URL', async () => {
      const longUrl = 'https://www.cloudflare.com';
      const response = await request(app)
        .post('/shorten')
        .send({ longUrl, expiresIn: 100 });
      
      expect(response.statusCode).toBe(200);
      expect(response.body.shortUrl).toBeDefined();
    });

    it('rejects requests without a long URL', async () => {
      const response = await request(app)
        .post('/shorten')
        .send({});
      
      expect(response.statusCode).toBe(400);
    });
  });

  describe('GET /:shortCode', () => {
    it('redirects to the original URL', async () => {
      // Assuming you have a mechanism or pre-setup to associate a shortCode with a URL
      const response = await request(app).get('/a6ad87');
      
      // Status code for redirection
      expect(response.statusCode).toBe(302);
    });
  });

  // Add more tests for stats, delete, etc.
});
