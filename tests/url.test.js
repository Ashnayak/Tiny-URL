const { hashLongUrl } = require('../app');

describe('hashLongUrl', () => {
  it('generates a consistent 6-character hash for a given URL', async () => {
    const url = 'https://example.com';
    const hash = await hashLongUrl(url); // Assuming hashLongUrl returns a Promise
    expect(hash).toHaveLength(6);
  });
});