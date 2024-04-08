const express = require('express');
const redis = require('redis');
const Redis = require('ioredis');

// Create Express app
const app = express();
const port = 3000;
const PORT = process.env.PORT || 3000;

// Create Redis client
const client = new Redis({
  host: '127.0.0.1',
  port: 6379,
});

// In-memory store for URL mappings
// const urlStore = {};

// Middleware to parse JSON requests
app.use(express.json());

// Generate a random alphanumeric string as short code
function generateShortCode() {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let shortCode = '';
  for (let i = 0; i < 6; i++) {
    shortCode += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return shortCode;
}

// POST endpoint to save data to Redis
app.post('/data', (req, res) => {
  const { key, value } = req.body;

  // Check if key and value are provided
  if (!key || !value) {
    return res.status(400).json({ error: 'Both key and value are required' });
  }

  // Save data to Redis
  client.set(key, value, (err, reply) => {
    if (err) {
      if (err instanceof redis.errors.ClientClosedError) {
        // Handle ClientClosedError
        return res.status(500).json({ error: 'Redis connection closed' });
      } else {
        console.error(err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
    }
    res.status(201).json({ message: 'Data saved successfully' });
  });
});

// Shorten URL endpoint
app.post('/shorten', (req, res) => {
  const longUrl = req.body.longUrl;
  const shortCode = generateShortCode();
  const shortUrl = `http://localhost:${port}/${shortCode}`;

  // Save data to Redis
  client.set(shortCode, longUrl, (err, reply) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    console.log(reply); // Reply from Redis

    res.json({ shortUrl });
  });
});


// GET endpoint to retrieve data from Redis
app.get('/data/:key', (req, res) => {
  const { key } = req.params;

  // Retrieve data from Redis
  client.get(key, (err, reply) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    if (!reply) {
      return res.status(404).json({ error: 'Data not found' });
    }

    res.json({ key, value: reply });
  });
});

// Redirect endpoint
app.get('/:shortCode', (req, res) => {
  const shortCode = req.params.shortCode;
  client.get(shortCode, (err, longUrl) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    if (!longUrl) {
      return res.status(404).json({ error: 'URL not found' });
    }
    res.redirect(longUrl);
  });
});

// DELETE endpoint to delete a mapping from Redis
app.delete('/data/:key', (req, res) => {
  const { key } = req.params;

  // Delete data from Redis
  client.del(key, (err, reply) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    if (reply === 0) {
      // If reply is 0, it means the key does not exist in Redis
      return res.status(404).json({ error: 'Data not found' });
    }

    res.status(204).end(); // No content, successful deletion
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});