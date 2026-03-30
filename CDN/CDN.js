// We simulate something like Cloudflare edge behavior.

// cache/LRUCache.js
class LRUCache {
  constructor(limit = 3) {
    this.cache = new Map();
    this.limit = limit;
  }

  get(key) {
    if (!this.cache.has(key)) return null;

    const value = this.cache.get(key);
    this.cache.delete(key);
    this.cache.set(key, value); // refresh priority
    return value;
  }

  set(key, value) {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.limit) {
      const oldest = this.cache.keys().next().value;
      this.cache.delete(oldest);
    }

    this.cache.set(key, value);
  }
}

module.exports = LRUCache;


// services/OriginServer.js
class OriginServer {
  constructor() {
    this.storage = {
      "/img1": "IMAGE_DATA_1",
      "/img2": "IMAGE_DATA_2",
      "/video": "VIDEO_DATA"
    };
  }

  fetch(path) {
    console.log("Fetching from ORIGIN");
    return this.storage[path] || "404";
  }
}

module.exports = new OriginServer();

// services/EdgeServer.js
const LRUCache = require("../cache/LRUCache");
const origin = require("./OriginServer");

class EdgeServer {
  constructor(name) {
    this.name = name;
    this.cache = new LRUCache(2);
  }

  handleRequest(path) {
    console.log(`\n[${this.name}] Request for ${path}`);

    let data = this.cache.get(path);

    if (data) {
      console.log("Cache HIT");
      return data;
    }

    console.log("Cache MISS");

    data = origin.fetch(path);
    this.cache.set(path, data);

    return data;
  }
}

module.exports = EdgeServer;

// services/DNSRouter.js
class DNSRouter {
  constructor(edges) {
    this.edges = edges;
  }

  route(userRegion) {
    // Simplified geo-routing
    return this.edges[userRegion] || this.edges["default"];
  }
}

module.exports = DNSRouter;

