const fs = require('fs');
const path = '/shared-data/timestamp.txt';

const generateTimestamp = () => {
  return new Date().toISOString();
};

setInterval(() => {
  const timestamp = generateTimestamp();
  fs.writeFileSync(path, timestamp);
  console.log(`Writer: Generated timestamp - ${timestamp}`);
}, 5000);