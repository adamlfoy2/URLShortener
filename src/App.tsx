import React, { useState } from "react";
import "./App.css";

const App = () => {
  const [url, setUrl] = useState<string>("");
  const [createdShortUrl, setCreatedShortUrl] = useState<string>("");
  const [fetchedURL, setFetchedURL] = useState<string>("");
  const [inputShortUrl, setInputShortUrl] = useState<string>("");

  const handleCreateShortURL = async (e: React.SubmitEvent) => {
    e.preventDefault();
    const response = await fetch("/api/createshorturl", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ post: url }),
    });
    const body = await response.text();
    setCreatedShortUrl(body);
  };

  const handleGetURL = async (e: React.SubmitEvent) => {
    e.preventDefault();
    // Extract the hash code from the shortened URL (e.g., "4" from "https://miniurl.com/4")
    const hashCode = inputShortUrl.split("/").pop() || inputShortUrl;
    const response = await fetch(`/api/getfullurl/${hashCode}`);
    const body = await response.text();
    setFetchedURL(body);
    const urlRegex =
      /^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/;

    if (urlRegex.test(body)) {
      window.location.href = body;
    }
  };

  return (
    <div className="App">
      <form onSubmit={handleCreateShortURL}>
        <h2>URL Shortener</h2>
        <p>
          <strong>Enter a URL to have it shortened</strong>
          <p></p>
        </p>
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <button type="submit">Submit</button>
      </form>
      <br />
      <div>{createdShortUrl && <p>Shortened URL: {createdShortUrl}</p>}</div>
      <br />

      <form onSubmit={handleGetURL}>
        <h2>Fetch short url</h2>
        <p>
          <strong>Enter a mini url to get the original URL</strong>
          <p></p>
        </p>
        <input
          type="text"
          value={inputShortUrl}
          onChange={(e) => setInputShortUrl(e.target.value)}
        />
        <button type="submit">Submit</button>
      </form>
      <br />
      <div>{fetchedURL && <p>Fetched URL: {fetchedURL}</p>}</div>
      <br />
    </div>
  );
};

export default App;
