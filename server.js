const express = require('express');
const Redis = require('ioredis');
const crypto = require('crypto'); // Added for creating hash of long URL

// Create Express app
const app = express();
const port = process.env.PORT || 3000;

// Create Redis client
const client = new Redis({
  host: '127.0.0.1',
  port: 6379,
});

// Middleware to parse JSON requests
app.use(express.json());

// Function to hash long URL to a fixed length short code
function hashLongUrl(longUrl) {
  // Using SHA-256 and slicing to get a shorter part of the hash
  return crypto.createHash('sha256').update(longUrl).digest('hex').slice(0, 6);
}

// Shorten URL endpoint
app.post('/shorten', async (req, res) => {
  const { longUrl } = req.body;
  if (!longUrl) {
    return res.status(400).json({ error: 'A long URL is required' });
  }

  // Check if a short code for the long URL already exists
  let shortCode = await client.get(`longUrl:${longUrl}`);
  if (!shortCode) {
    // If not, generate a new short code based on a hash of the long URL
    shortCode = hashLongUrl(longUrl);
    // Check if the generated shortCode already maps to a different long URL (collision)
    const existingLongUrl = await client.get(`shortCode:${shortCode}`);
    if (existingLongUrl && existingLongUrl !== longUrl) {
      // Handle hash collision (very unlikely with a good hashing strategy and large enough hash space)
      return res.status(500).json({ error: 'Short code generation collision. Try again.' });
    }

    // Save mappings from shortCode to longUrl and vice versa
    await client.set(`shortCode:${shortCode}`, longUrl);
    await client.set(`longUrl:${longUrl}`, shortCode);
  }

  const shortUrl = `http://localhost:${port}/${shortCode}`;
  res.json({ shortUrl });
});

// Redirect endpoint
app.get('/:shortCode', async (req, res) => {
  const { shortCode } = req.params;

  try {
    const longUrl = await client.get(`shortCode:${shortCode}`);
    if (!longUrl) {
      return res.status(404).json({ error: 'URL not found' });
    }
    res.redirect(longUrl);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
