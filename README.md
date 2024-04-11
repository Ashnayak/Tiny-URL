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
curl -X POST http://localhost:3000/shorten -H 'Content-Type: application/json' -d '{"longUrl": "https://www.example.com"}'
```
or if you want the link to expire in 60 seconds
```
curl -X POST http://localhost:3000/shorten -H 'Content-Type: application/json' -d '{"longUrl": "https://www.example.com", "expiresIn": 60}'
```
Output: {"shortUrl":"http://localhost:3000/abc123"}

- Accessing a short URL
```
curl "http://localhost:3000/abc123"
```

- Viewing Access Counts (Statistics)
```
curl "http://localhost:3000/stats/abc123"
```
- Deleting a Short URL
```
curl -X DELETE "http://localhost:3000/delete/abc123"
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

# Design Process
**Analyzing Requirements**: I began by identifying the core functionalities: Unique URL shortening, access expiration, access count statistics and URL deletion.

**Prototyping and Iteration**: Starting with a basic implementation, I iteratively added features and refined the application, incorporating statistics tracking and collision handling.

**Strategizing Testing**: Early in the development, I established a strategy for testing with Jest and Supertest, ensuring that changes could be made confidently without breaking existing functionality.

**Considering Performance**: The selection of Redis was driven by a focus on performance, recognizing the importance of quick response times and the ability to scale.

**Future-proofing the Design**: I aimed to keep the system modular, allowing for easy updates and expansions in the future without significant overhauls.
<img width="792" alt="Screen Shot 2024-04-10 at 11 20 56 PM" src="https://github.com/Ashnayak/Tiny-URL/assets/18304940/91cbe69a-03aa-46f2-9cb0-bd7fe5d4c129">

# Assumptions
- **839 trillion unique ShortCodes**:
With a 10-character shortcode using a character set of 62 possible characters, the system can theoretically support approximately 839 trillion unique short codes. 
- **Handling edge case**:
If a long URL is shortened and then shortened again with an 'expiresIn', the link will not expire.

# Future Scope
- **Data persistence using Redis snapshotting**:
Redis can periodically take snapshots of your dataset and save it to disk in a binary file (usually called dump.rdb). This process can be configured to occur at specified intervals, such as after a certain number of write operations have occurred within a given timeframe.
- **More unit tests to improve coverage**:
I had difficulties with jest as it suggested that the test suite contained asynchronous operations that were not properly handled or terminated, potentially from the open database connection.
