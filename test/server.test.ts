import { server } from "../src/server.ts";

const PORT = Number(process.env.PORT || 5000);
const base = `http://localhost:${PORT}`;

describe("URL shortener API", () => {
  beforeAll(async () => {
    await new Promise((r) => setTimeout(r, 100));
  });

  afterAll((done) => {
    server.close(done);
  });

  it("creates and retrieves a short URL", async () => {
    const validLongURL = "https://example.com/test-path";

    const createShortURL = await fetch(`${base}/api/postcreateshorturl`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ post: validLongURL }),
    });

    expect(createShortURL.status).toBe(200);
    const shortUrl = await createShortURL.text();
    expect(shortUrl.startsWith("https://miniurl.com/"));

    const hash = shortUrl.replace("https://miniurl.com/", "");
    const getFullURL = await fetch(`${base}/api/getfullurl/${hash}`);
    expect(getFullURL.status).toBe(200);
    const retrievedURL = await getFullURL.text();
    expect(retrievedURL).toBe(validLongURL);
  });

  it("returns 400 for invalid URL", async () => {
    const createShortURL = await fetch(`${base}/api/postcreateshorturl`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ post: "not-a-valid-url" }),
    });
    expect(createShortURL.status).toBe(400);
    const createShortURLResponse = await createShortURL.json();
    expect(createShortURLResponse).toEqual({
      userErrorMessage: "Please provide a valid URL and try again.",
      devErrorMessage: "400: The URL provided is not valid.",
    });
  });

  it("returns 404 for unknown short URL", async () => {
    const invalidGetFullURLRequest = await fetch(
      `${base}/api/getfullurl/thisdoesnotexist123`,
    );
    expect(invalidGetFullURLRequest.status).toBe(404);
    const body = await invalidGetFullURLRequest.json();
    expect(body).toEqual({
      userErrorMessage:
        "The short URL provided does not exist. Please double check the URL and try again.",
      devErrorMessage: "404: Short URL not found in the database.",
    });
  });
});

// New server for rate limit test - seperate from other server instance to avoid side effects in other tests
describe("URL shortener API - rate limit server", () => {
  beforeAll(async () => {
    await new Promise((r) => setTimeout(r, 100));
    server.listen(PORT, () => {
      console.log(`Rate limit test server running on port ${PORT}`);
    });
  });

  afterAll((done) => {
    server.close(done);
  });

  it("returns 429 when rate limit is exceeded", async () => {
    const rateLimitURL = "https://example.com/rate-limit-test";
    const limit = 1000;

    for (let i = 0; i < limit; i++) {
      await fetch(`${base}/api/postcreateshorturl`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ post: rateLimitURL }),
      });
    }

    // Rate limit next request
    const rateLimitedRequest = await fetch(`${base}/api/postcreateshorturl`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ post: rateLimitURL }),
    });

    expect(rateLimitedRequest.status).toBe(429);
  });
});
