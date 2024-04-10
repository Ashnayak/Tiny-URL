# Tiny-URL

# URL Shortening Service
This URL Shortening Service provides a simple, yet powerful way to create short, memorable URLs from longer website addresses, making them easier to share and manage. Built with Express and Redis, it offers fast performance and easy scalability.

# Features
**Shorten URLs**: Convert long URLs into short, manageable links that redirect to the original address.

**Custom Expiration**: Set an optional expiration time for short URLs, after which they automatically become inactive.

**Statistics**: Track access counts, including total hits, daily, and weekly statistics for each short URL.

**Simple API**: Use straightforward RESTful endpoints to create, access, and manage short URLs.

# Getting Started
These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

# Prerequisites
- Node.js
- npm
- Redis server

# Installation
- Clone the repository
```
git clone https://github.com/Ashnayak/Tiny-URL.git
cd Tiny-URL
```
- Install npm
```
npm install
```
- Start the Redis server (refer to Redis documentation for specific instructions based on your operating system).
I use docker:
```
docker run -p 6379:6379 -it redis/redis-stack-server:latest
```
- Run the application
```
npm start
```
Your URL Shortening Service is now running and accessible at http://localhost:3000 (or another port if configured differently).

# Usage

- Creating a short URL
Send a POST request to /shorten with a JSON body containing the longUrl and optionally, expiresIn to specify the expiration time in seconds.
```
$curl -X POST http://localhost:3000/shorten -H 'Content-Type: application/json' -d '{"longUrl": "https://www.example.com"}'
```
or if you want the link to expire in 60 seconds
```
$curl -X POST http://localhost:3000/shorten -H 'Content-Type: application/json' -d '{"longUrl": "https://www.example.com", "expireIn": 60}'
```
Output: {"shortUrl":"http://localhost:3000/abc123"}

- Accessing a short URL
```
$curl "http://localhost:3000/abc123"
```

- Viewing Access Counts (Statistics)
```
$curl "http://localhost:3000/stats/abc123"
```
- Deleting a Short URL
```
$curl "http://localhost:3000/delete/abc123"
```
- Running the tests
```
npm test
```
- Running the code coverage
```
npm run test:coverage
```
# Built With
- Express: The web framework used
- Redis: In-memory data structure store
- Node.js: JavaScript runtime
