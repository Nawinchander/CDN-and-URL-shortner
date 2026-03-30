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

