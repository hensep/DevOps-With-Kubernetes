const http = require('http');

// Read the PORT environment variable or default to 3000
const PORT = process.env.PORT || 3000;

// Create a simple HTTP server
const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello, World!');
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server started in port ${PORT}`);
});
