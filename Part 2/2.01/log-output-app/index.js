const express = require('express');
const axios = require('axios');
const crypto = require('crypto');

const app = express();
const PING_PONG_SERVICE_URL = process.env.PING_PONG_SERVICE_URL || 'http://ping-pong-svc:2345';

const generateHash = (data) => {
  return crypto.createHash('sha256').update(data).digest('hex');
};

app.get('/', async (req, res) => {
  const timestamp = new Date().toISOString();
  let requestCount = '0';

  try {
    // Fetch the current counter value from the Ping-Pong app
    const response = await axios.get(`${PING_PONG_SERVICE_URL}/count`);
    requestCount = response.data.count.toString();
  } catch (err) {
    console.error('Error fetching request count:', err.message);
    if (err.response) {
      console.error('Response data:', err.response.data);
      console.error('Response status:', err.response.status);
    }
  }

  const hash = generateHash(timestamp + requestCount);
  res.send(`${timestamp}: ${hash}\nPing / Pongs: ${requestCount}`);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Log Output App started on port ${PORT}`);
});