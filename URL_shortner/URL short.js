// Key Concepts Used
// Base62 encoding
// In-memory DB (simulate real DB)
// Redis-like cache
// Read-heavy optimization


// utils/base62.js
const BASE62 = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

function encodeBase62(num) {
  let str = "";
  while (num > 0) {
    str = BASE62[num % 62] + str;
    num = Math.floor(num / 62);
  }
  return str || "a";
}

module.exports = { encodeBase62 };

// cache/RedisMock.js
class RedisMock {
  constructor() {
    this.store = new Map();
  }

  get(key) {
    return this.store.get(key) || null;
  }

  set(key, value) {
    this.store.set(key, value);
  }
}

module.exports = new RedisMock();


// db/DatabaseMock.js
class DatabaseMock {
  constructor() {
    this.data = new Map();
    this.id = 0;
  }

  insert(longUrl) {
    this.id++;
    this.data.set(this.id, longUrl);
    return this.id;
  }

  findById(id) {
    return this.data.get(id);
  }
}

module.exports = new DatabaseMock();

// services/UrlShortenerService.js
const db = require("../db/DatabaseMock");
const cache = require("../cache/RedisMock");
const { encodeBase62 } = require("../utils/base62");

class UrlShortenerService {
  shorten(longUrl) {
    const id = db.insert(longUrl);
    const shortKey = encodeBase62(id);

    cache.set(shortKey, longUrl); // cache write-through
    return `short.ly/${shortKey}`;
  }

  redirect(shortKey) {
    // 🔥 Cache-first (critical FAANG pattern)
    let longUrl = cache.get(shortKey);
    if (longUrl) {
      console.log("Cache HIT");
      return longUrl;
    }

    console.log("Cache MISS");

    // Decode base62 → ID
    const id = this.decodeBase62(shortKey);
    longUrl = db.findById(id);

    if (longUrl) {
      cache.set(shortKey, longUrl);
    }

    return longUrl || "404 Not Found";
  }

  decodeBase62(str) {
    const BASE62 = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let num = 0;

    for (let char of str) {
      num = num * 62 + BASE62.indexOf(char);
    }

    return num;
  }
}

module.exports = new UrlShortenerService();

// app.js
const urlService = require("./services/UrlShortenerService");

const short = urlService.shorten("https://google.com");
console.log("Short URL:", short);

const key = short.split("/")[1];

// First call → MISS
console.log(urlService.redirect(key));

// Second call → HIT
console.log(urlService.redirect(key));

