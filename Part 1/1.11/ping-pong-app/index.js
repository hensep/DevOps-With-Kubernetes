const express = require('express');
const fs = require('fs');
const path = '/shared-data/request-count.txt';

const app = express();
let counter = 0;

app.get('/pingpong', (req, res) => {
  counter++;
  fs.writeFileSync(path, counter.toString());
  res.send(`pong ${counter}`);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Ping-Pong App started on port ${PORT}`);
});
