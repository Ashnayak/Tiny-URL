# Tiny-URL

A HTTP-based RESTful API for managing short URLs and redirecting clients (similar to bit.ly or goo.gl). The system may eventually scale to support millions of short URLs. 

README consists of documentation on how to build, and run and test the system. Also states all assumptions and design decisions.

A short URL:
1. Has one long URL
2. No duplicate short URLs are allowed to be created.
3. Short links can expire at a future time or can live forever.

Project supports:
1. Generating a short url from a long url
2. Redirecting a short url to a long url.
3. List the number of times a short url has been accessed in the last 24 hours, past week, and all time.
4. Data persistence ( must survive computer restarts)
5. Short links can be deleted
6. Metrics and/or logging: Implement metrics or logging for the purposes of troubleshooting and alerting. This is optional.

Things it doesn't need
1. Authentication: No authentication is required. You can assume another service will be handling that.
2. You do not need to make a Web UI.
3. Transport/Serialization format is your choice, but the solution should be testable via curl
4. Anything left unspecified is left to your discretion 

Things we care about
1. Design decisions and process
2. Readable code
3. Testable code and coverageDocumentation

Project Requirements
1. This project should be able to be runnable locally with some simple instructions.
2. This project's documentation should include build and deploy instructions.
3. Tests should be provided and able to be executed locally or within a test environment.