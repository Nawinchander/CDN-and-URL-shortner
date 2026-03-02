const redis = require("redis");

const client = redis.createClient();

client.connect();

async function getData(key) {

  // 1️⃣ Check cache
  const cached = await client.get(key);

  if (cached) {
    console.log("From Redis Cache");
    return cached;
  }

  // 2️⃣ Simulate Origin DB
  console.log("From Main Database");
  const data = "User data from DB";

  // 3️⃣ Store in Redis
  await client.set(key, data);

  return data;
}

getData("user1");
getData("user1");


// First time → DB
// Second time → Redis

// That’s Redis-based CDN logic 🔥