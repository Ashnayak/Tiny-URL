const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// In-memory store for URL mappings
const urlStore = {};

// Generate a random alphanumeric string as short code
function generateShortCode() {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let shortCode = '';
  for (let i = 0; i < 6; i++) {
    shortCode += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return shortCode;
}

// Shorten URL endpoint
app.post('/shorten', (req, res) => {
  const longUrl = req.body.longUrl;
  const shortCode = generateShortCode();
  urlStore[shortCode] = longUrl;
  res.json({ shortUrl: `http://localhost:${PORT}/${shortCode}` });
});

// Redirect endpoint
app.get('/:shortCode', (req, res) => {
  const shortCode = req.params.shortCode;
  const longUrl = urlStore[shortCode];
  if (longUrl) {
    res.redirect(longUrl);
  } else {
    res.status(404).send('URL not found');
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
