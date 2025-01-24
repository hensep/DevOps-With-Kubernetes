const express = require('express');

const app = express();
let counter = 0;

// Endpoint for /pingpong
app.get('/pingpong', (req, res) => {
  res.send(`pong ${counter}`);
  counter++;
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Ping-pong server started in port ${PORT}`);
});
