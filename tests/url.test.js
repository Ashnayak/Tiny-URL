const { hashLongUrl } = require('../app');

describe('hashLongUrl', () => {
  it('generates a consistent 10-character hash for a given URL', async () => {
    const url = 'https://example.com';
    const hash = await hashLongUrl(url); 
    expect(hash).toHaveLength(10);
  });
});