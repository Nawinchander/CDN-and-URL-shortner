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

