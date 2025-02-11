const express = require('express');
const axios = require('axios');
const crypto = require('crypto');

const app = express();
const PING_PONG_SERVICE_URL = 'http://localhost:8081';

const generateHash = (data) => {
  return crypto.createHash('sha256').update(data).digest('hex');
};

app.get('/', async (req, res) => {
  const timestamp = new Date().toISOString();
  let requestCount = '5';
  try {
    const response = await axios.get(`${PING_PONG_SERVICE_URL}/count`);
    console.log('Response:', response.data);
    requestCount = response.data.count;
  } catch (err) {
    console.error('Error fetching request count:', err);
  }

  const hash = generateHash(timestamp + requestCount);
  res.send(`${timestamp}: ${hash}\nPing / Pongs: ${requestCount}`);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Log Output App started on port ${PORT}`);
});