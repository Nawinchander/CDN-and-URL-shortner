async function getDataWithTTL(key) {

  const cached = await client.get(key);

  if (cached) {
    console.log("From Redis Cache");
    return cached;
  }

  console.log("From Main DB");

  const data = "Fresh data";

  // Store with 10 sec expiry
  await client.setEx(key, 10, data);

  return data;
}

getDataWithTTL("product1");