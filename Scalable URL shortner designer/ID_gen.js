const characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

let counter = 1;

function generateShortCode() {
  let num = counter++;
  let short = "";

  while (num > 0) {
    short += characters[num % 62];
    num = Math.floor(num / 62);
  }

  return short;
}