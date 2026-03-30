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

