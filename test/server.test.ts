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

    const createShortURL = await fetch(`${base}/api/createshorturl`, {
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
    const createShortURL = await fetch(`${base}/api/createshorturl`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ post: "not-a-valid-url" }),
    });
    expect(createShortURL.status).toBe(400);
    const createShortURLResponse = await createShortURL.text();
    expect(createShortURLResponse).toBe("Invalid URL");
  });

  it("returns 404 for unknown short URL", async () => {
    const invalidGetFullURLRequest = await fetch(
      `${base}/api/getfullurl/thisdoesnotexist123`,
    );
    expect(invalidGetFullURLRequest.status).toBe(404);
    const body = await invalidGetFullURLRequest.text();
    expect(body).toBe("Short URL not found");
  });
});
