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

// Helper function to get ISO week number
function getISOWeekNumber(date) {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
}

// Shorten URL endpoint with optional expiration
app.post('/shorten', async (req, res) => {
  const { longUrl, expiresIn } = req.body;

  if (!longUrl) {
    return res.status(400).json({ error: 'A long URL is required' });
  }

  let shortCode = await client.get(`longUrl:${longUrl}`);
  if (!shortCode) {
    shortCode = hashLongUrl(longUrl);
    const existingLongUrl = await client.get(`shortCode:${shortCode}`);
    if (existingLongUrl && existingLongUrl !== longUrl) {
      return res.status(500).json({ error: 'Short code generation collision. Try again.' });
    }

    // Set short code with optional expiration
    await client.set(`shortCode:${shortCode}`, longUrl);
    await client.set(`longUrl:${longUrl}`, shortCode);

    if (expiresIn && expiresIn > 0) {
      // Set expiration for both mappings
      await client.expire(`shortCode:${shortCode}`, expiresIn);
      await client.expire(`longUrl:${longUrl}`, expiresIn);
    }
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

    // Increment the total access count
    await client.incr(`accessCount:total:${shortCode}`);

    // Get current date in YYYY-MM-DD format for daily count
    const today = new Date().toISOString().split('T')[0];
    // Increment daily access count
    await client.hincrby(`accessCount:daily:${shortCode}`, today, 1);

    // Calculate the current week number for weekly count
    const currentWeek = getISOWeekNumber(new Date());
    // Increment weekly access count
    await client.hincrby(`accessCount:weekly:${shortCode}`, `week:${currentWeek}`, 1);

    res.redirect(longUrl);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/stats/:shortCode', async (req, res) => {
  const { shortCode } = req.params;

  try {
    // Retrieve the URL to ensure it exists before attempting to gather stats
    const longUrl = await client.get(`shortCode:${shortCode}`);
    if (!longUrl) {
      return res.status(404).json({ error: 'Short URL not found' });
    }
    
    const totalAccesses = await client.get(`accessCount:total:${shortCode}`) || 0;
    const dailyAccesses = await client.hgetall(`accessCount:daily:${shortCode}`);
    const weeklyAccesses = await client.hgetall(`accessCount:weekly:${shortCode}`);

    res.json({
      shortCode,
      totalAccesses,
      dailyAccesses,
      weeklyAccesses,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.delete('/delete/:shortCode', async (req, res) => {
  const { shortCode } = req.params;

  try {
    // Retrieve the long URL to ensure it exists before attempting to delete
    const longUrl = await client.get(`shortCode:${shortCode}`);
    if (!longUrl) {
      return res.status(404).json({ error: 'Short URL not found' });
    }

    // Delete the short code and long URL mappings from Redis
    await client.del(`shortCode:${shortCode}`);
    await client.del(`longUrl:${longUrl}`);

    // Delete related statistics and access counts
    await client.del(`accessCount:total:${shortCode}`);
    await client.del(`accessCount:daily:${shortCode}`);
    await client.del(`accessCount:weekly:${shortCode}`);

    res.json({ message: 'Short URL and associated data deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Start the server
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
