import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

let num = 0n;
const shortURLToURLPairs = new Map();
const shortURLPrefix = "https://miniurl.com/";

console.log("Success!\n");

app.post("/api/createshorturl", (req, res) => {
  let url = req.body.post;

  // Validate URL with regex
  const urlRegex =
    /^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/;

  if (!urlRegex.test(url)) {
    res.status(400).send("Invalid URL");
    return;
  }

  res.send(createAndSendShortURL(url));
});

app.get("/api/getfullurl/:hash", (req, res) => {
  let shortUrlHash = req.params.hash;

  const shortURL = shortURLPrefix + shortUrlHash;

  const url = shortURLToURLPairs.get(shortURL);

  if (!url) {
    res.status(404).send("Short URL not found");
    return;
  }
  res.send(url);
});

function createAndSendShortURL(url: string) {
  num += 1n;
  const hash = convertBigIntToBase62(num);
  const shortURL = shortURLPrefix + hash;
  shortURLToURLPairs.set(shortURL, url);
  return shortURL;
}

function convertBigIntToBase62(num: bigint) {
  const alphabet =
    "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  let result = "";

  while (num > 0n) {
    result = alphabet[Number(num % 62n)] + result;
    num = num / 62n;
  }
  return result;
}

const server = app.listen(port, () => console.log(`Listening on port ${port}`));
export { app, server };
