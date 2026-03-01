const http = require("http");

const urlDatabase = {}; // Store short → long mapping

function generateShortCode() {
  return Math.random().toString(36).substring(2, 7);
}

function handleRequest(req, res) {
  const url = req.url;

  // Create short URL
  if (url.startsWith("/shorten?url=")) {
    const longUrl = url.split("=")[1];
    const shortCode = generateShortCode();

    urlDatabase[shortCode] = longUrl;

    res.end(`Short URL: http://localhost:4000/${shortCode}`);
  }

  // Redirect to long URL
  else {
    const shortCode = url.substring(1);
    const longUrl = urlDatabase[shortCode];

    if (longUrl) {
      res.writeHead(302, { Location: longUrl });
      res.end();
    } else {
      res.statusCode = 404;
      res.end("Short URL not found");
    }
  }
}

http.createServer(handleRequest).listen(4000, () => {
  console.log("URL Shortener running on port 4000");
});