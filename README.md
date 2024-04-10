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
git clone <link>
cd <dir>
```
- Install npm
```
npm install
```
- env?

- Start the Redis server (refer to Redis documentation for specific instructions based on your operating system).
I use docker:
```
docker run -p 6379:6379 -it redis/redis-stack-server:latest
```

- 
