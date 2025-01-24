const express = require('express');
const fs = require('fs');
const crypto = require('crypto');
const path = '/shared-data/request-count.txt';

const app = express();

const generateHash = (data) => {
  return crypto.createHash('sha256').update(data).digest('hex');
};

app.get('/', (req, res) => {
  const timestamp = new Date().toISOString();
  let requestCount = '0';

  try {
    requestCount = fs.readFileSync(path, 'utf8');
  } catch (err) {
    console.error('Error reading request count:', err);
  }

  const hash = generateHash(timestamp + requestCount);
  res.send(`${timestamp}: ${hash}\nPing / Pongs: ${requestCount}`);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Log Output App started on port ${PORT}`);
});
