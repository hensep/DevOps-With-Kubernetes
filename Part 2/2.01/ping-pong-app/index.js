const express = require('express');
const app = express();
let counter = 0;

// Endpoint to increment and return the counter
app.get('/pingpong', (req, res) => {
  counter++;
  res.send(`pong ${counter}`);
});

// Endpoint to get the current counter value
app.get('/count', (req, res) => {
  res.json({ count: counter });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Ping-Pong App started on port ${PORT}`);
});