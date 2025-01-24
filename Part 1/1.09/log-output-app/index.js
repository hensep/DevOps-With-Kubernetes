const express = require('express');
const app = express();

let lastTimestamp = new Date().toISOString();
let randomString = Math.random().toString(36).substring(2, 15);

app.get('/', (req, res) => {
  res.json({ timestamp: lastTimestamp, randomString: randomString });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Log Output server started on port ${PORT}`);
});
