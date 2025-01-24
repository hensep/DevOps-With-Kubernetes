const http = require('http');

const generateRandomString = () => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

let randomString = generateRandomString();
let lastTimestamp = new Date().toISOString();

const logOutput = () => {
  const timestamp = new Date().toISOString();
  console.log(`${timestamp}: ${randomString}`);
};

// Log the random string every 5 seconds
setInterval(() => {
  lastTimeStamp = new Date().toISOString();
  console.log(`${lastTimestamp}: ${randomString}`);
}, 5000);

// Create an HTTP server
const server = http.createServer((req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ timestamp: lastTimestamp, randomString: randomString })); 
});

// Start the server
const PORT = process.env.PORT ||3000;
server.listen(PORT, () => {
  console.log(`Server started in port ${PORT}`);
});