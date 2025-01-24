const fs = require('fs');
const crypto = require('crypto');
const path = '/shared-data/timestamp.txt';

const generateHash = (data) => {
  return crypto.createHash('sha256').update(data).digest('hex');
};

setInterval(() => {
  try {
    const timestamp = fs.readFileSync(path, 'utf8');
    const hash = generateHash(timestamp);
    console.log(`Reader: Timestamp - ${timestamp}, Hash - ${hash}`);
  } catch (err) {
    console.error('Reader: Error reading file', err);
  }
}, 5000);