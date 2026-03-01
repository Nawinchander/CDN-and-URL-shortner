const http = require("http");

// Simulated Origin Server Data
const originData = {
  "/image": "Image from Origin Server",
  "/video": "Video from Origin Server"
};

// CDN Cache
const cache = {};

function handleRequest(req, res) {
  const url = req.url;

  // Check if file is cached
  if (cache[url]) {
    console.log("Serving from CDN Cache");
    res.end(cache[url]);
  } else {
    console.log("Fetching from Origin Server");

    const data = originData[url];

    if (data) {
      cache[url] = data; // Store in cache
      res.end(data);
    } else {
      res.statusCode = 404;
      res.end("Not Found");
    }
  }
}

http.createServer(handleRequest).listen(3000, () => {
  console.log("CDN Server running on port 3000");
});