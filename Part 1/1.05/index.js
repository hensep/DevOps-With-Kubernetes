const http = require('http');

// Read the PORT environment variable or default to 3000
const PORT = process.env.PORT || 3000;

// Create a simple HTTP server
const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html');
  res.end(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Web Server</title>
      </head>
      <body>
        <h1>Hello from the Web Server!</h1>
        <p>This is a simple HTML page.</p>
      </body>
    </html>
  `);
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server started in port ${PORT}`);
});
