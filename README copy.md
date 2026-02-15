Spec:

The Task
Build a simple URL shortening service.
Core Requirements

1. Implement an API that accepts a long URL and returns a shortened version.
   o Example: https://www.example.com/some/very/long/path →
   http://short.ly/abc123.

2. Implement an API (or route) that resolves the short URL and redirects the user to
   the original long URL.
3. Handle invalid inputs gracefully (e.g. empty or malformed URLs).

Optional Enhancements
If you have time, or if you’d like to demonstrate additional thinking, you may extend your
solution with one or more of the following:
 Persistence beyond memory (e.g. file or database).
 URL expiry (short links valid only for a limited time).
 Tracking click counts for shortened URLs.
 Automated tests (unit/integration).
 Considerations for scalability (e.g. avoiding collisions, handling high traffic).
We don’t expect you to build everything — choose what you think best shows your
approach.

Expectations
 Language: TypeScript.
 Frameworks: You may use any libraries or frameworks you like (e.g. Node.js
with Express, NestJS etc.), but keep the setup simple.
 Deliverable: A working solution in a GitHub repository (or similar) with
instructions on how to run it.
 Timebox: Aim to spend no more than 2 hours.

What We’ll Discuss in the Interview
 How you approached the problem.
 The design choices you made and why.
 How you would extend or improve the system if it were heading to production.
