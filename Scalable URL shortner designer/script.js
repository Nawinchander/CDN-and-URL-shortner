const redis = require("redis");
const client = redis.createClient();
client.connect();

const database = {}; // pretend this is real DB

async function shortenURL(longUrl) {
  const shortCode = generateShortCode();

  database[shortCode] = longUrl;

  // Store in Redis
  await client.set(shortCode, longUrl);

  return shortCode;
}

async function redirect(shortCode) {

  // 1️⃣ Check Redis
  let longUrl = await client.get(shortCode);

  if (longUrl) {
    console.log("From Redis");
    return longUrl;
  }

  // 2️⃣ Check DB
  console.log("From Database");

  longUrl = database[shortCode];

  if (longUrl) {
    await client.set(shortCode, longUrl);
  }

  return longUrl;
}