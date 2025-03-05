const express = require('express');
const axios = require('axios');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const app = express();
const PING_PONG_SERVICE_URL = process.env.PING_PONG_SERVICE_URL
const MESSAGE = process.env.MESSAGE

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

  // Read the file content
  const filePath = path.join('/app/config', 'information.txt');
  let fileContent = 'file not found';
  try {
    fileContent = fs.readFileSync(filePath, 'utf8');
  } catch (err) {
    console.error('Error reading file:', err.message);
  }

  // Generate hash
  const hash = generateHash(timestamp + requestCount);

  // Send response
  res.send(`
    File content: ${fileContent}
    Env variable: MESSAGE=${MESSAGE}
    ${timestamp}: ${hash}
    Ping / Pongs: ${requestCount}
  `);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Log Output App started on port ${PORT}`);
});