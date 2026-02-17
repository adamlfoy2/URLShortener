import React, { useState } from "react";
import "./App.css";

const App = () => {
  const [url, setUrl] = useState<string>("");
  const [POSTUrlResponse, setPOSTUrlResponse] = useState<ApiResponse>();
  const [GETURLResponse, setGETURLResponse] = useState<ApiResponse>();
  const [inputShortUrl, setInputShortUrl] = useState<string>("");

  interface ApiResponse {
    response: Response;
    message: string;
  }

  const handleCreateShortURL = async (e: React.SubmitEvent) => {
    e.preventDefault();
    const response = await fetch("/api/postcreateshorturl", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ post: url }),
    });
    if (!response.ok) {
      try {
        const err = (await response.json()) as {
          userErrorMessage?: string;
          devErrorMessage?: string;
        };
        console.log(err.devErrorMessage);
        setPOSTUrlResponse({
          response,
          message: err.userErrorMessage || "An error occurred.",
        });
      } catch (parseErr) {
        console.log("Failed to parse error response", parseErr);
        setPOSTUrlResponse({
          response,
          message: "An error occurred.",
        });
      }
      return;
    }

    const body = await response.text();
    setPOSTUrlResponse({ response, message: body });
  };

  const handleGetURL = async (e: React.SubmitEvent) => {
    e.preventDefault();

    if (!inputShortUrl) {
      setGETURLResponse({
        response: new Response(undefined, { status: 400 }),
        message: "Please provide a mini URL and try again.",
      });
      return;
    }

    const specialCharactersRegexAndSpace = /[ !@#$%^&*(),.?":{}|<>\/\\]/g;
    if (specialCharactersRegexAndSpace.test(inputShortUrl)) {
      setGETURLResponse({
        response: new Response(undefined, { status: 400 }),
        message:
          "The short URL contains special characters that are not allowed.",
      });
      return;
    }
    const hashCode = inputShortUrl.split("/").pop() || inputShortUrl;
    const response = await fetch(`/api/getfullurl/${hashCode}`);

    if (!response.ok) {
      try {
        const err = (await response.json()) as {
          userErrorMessage?: string;
          devErrorMessage?: string;
        };
        console.log(err.devErrorMessage);
        setGETURLResponse({
          response,
          message: err.userErrorMessage || "An error occurred.",
        });
      } catch (parseErr) {
        console.log("Failed to parse error response", parseErr);
        setGETURLResponse({
          response,
          message: "An error occurred.",
        });
      }
      return;
    }

    const body = await response.text();
    setGETURLResponse({ response, message: body });
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
      <div>
        {POSTUrlResponse &&
          (POSTUrlResponse.response.ok ? (
            <p>Shortened URL: {POSTUrlResponse.message}</p>
          ) : (
            <p>{POSTUrlResponse.message}</p>
          ))}
      </div>
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
      <div>
        {GETURLResponse &&
          (GETURLResponse.response.ok ? (
            <p>Fetched URL: {GETURLResponse.message}</p>
          ) : (
            <p>{GETURLResponse.message}</p>
          ))}
      </div>
      <br />
    </div>
  );
};

export default App;
