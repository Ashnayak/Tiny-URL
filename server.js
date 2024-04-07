const express = require('express');
const redis = require('redis');
const Redis = require('ioredis');

// Create Express app
const app = express();
const port = 3000;

// Create Redis client
const client = new Redis({
  host: '127.0.0.1',
  port: 6379,
});

// Middleware to parse JSON requests
app.use(express.json());

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


});

// Start the server
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});