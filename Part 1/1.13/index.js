const express = require('express');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

// Define the path for the cached image
const CACHE_DIR = path.join(__dirname, 'cache');
const CACHE_IMAGE_PATH = path.join(CACHE_DIR, 'image.jpg');

// Ensure the cache directory exists
if (!fs.existsSync(CACHE_DIR)) {
  fs.mkdirSync(CACHE_DIR, { recursive: true }); // Create the directory if it doesn't exist
}

// Function to fetch a new image from Lorem Picsum
const fetchNewImage = async () => {
  try {
    const response = await axios.get('https://picsum.photos/1200', {
      responseType: 'stream',
    });
    // Ensure the cache directory exists before writing the image
    if (!fs.existsSync(CACHE_DIR)) {
      fs.mkdirSync(CACHE_DIR, { recursive: true });
    }
    response.data.pipe(fs.createWriteStream(CACHE_IMAGE_PATH));
    console.log('New image fetched and cached.');
  } catch (error) {
    console.error('Error fetching new image:', error);
  }
};

// Fetch a new image when the server starts (if the image doesn't exist)
if (!fs.existsSync(CACHE_IMAGE_PATH)) {
  fetchNewImage();
}

// Serve the cached image only when /image.jpg is requested
app.get('/image.jpg', async (req, res) => {
  if (fs.existsSync(CACHE_IMAGE_PATH)) {
    const stats = fs.statSync(CACHE_IMAGE_PATH);
    const now = new Date().getTime();
    const imageAge = (now - stats.mtime.getTime()) / 1000 / 60; // Age in minutes

    if (imageAge < 60) {
      // Serve the cached image if it's less than 60 minutes old
      res.sendFile(CACHE_IMAGE_PATH);
      return;
    }
  }

  // Fetch a new image if the cached image is older than 60 minutes or doesn't exist
  await fetchNewImage();
  res.sendFile(CACHE_IMAGE_PATH);
});

// Serve the HTML page with the input field, send button, todo list, and resized image
app.get('/', (req, res) => {
  res.status(200).send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Todo List</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 20px;
          }
          #todo-input {
            width: 300px;
            padding: 10px;
            font-size: 16px;
          }
          #send-button {
            padding: 10px 20px;
            font-size: 16px;
            margin-left: 10px;
          }
          #todo-list {
            margin-top: 20px;
            list-style-type: none;
            padding: 0;
          }
          #todo-list li {
            background: #f9f9f9;
            padding: 10px;
            border: 1px solid #ddd;
            margin-bottom: 5px;
          }
          .error {
            color: red;
            font-size: 14px;
            margin-top: 5px;
          }
          #image-container {
            margin-top: 20px;
            text-align: center;
          }
          #cached-image {
            max-width: 50%; /* Adjust this value to control the image size */
            height: auto;
            border: 1px solid #ddd;
            border-radius: 5px;
          }
        </style>
      </head>
      <body>
        <h1>Todo List</h1>
        <div>
          <input type="text" id="todo-input" placeholder="Enter a new todo (max 140 characters)" maxlength="140" />
          <button id="send-button">Send</button>
          <div id="error-message" class="error"></div>
        </div>
        <ul id="todo-list">
          <li>Buy groceries</li>
          <li>Walk the dog</li>
          <li>Read a book</li>
        </ul>

        <!-- Image container -->
        <div id="image-container">
          <img id="cached-image" src="/image.jpg" alt="Cached Image" />
        </div>

        <script>
          const inputField = document.getElementById('todo-input');
          const sendButton = document.getElementById('send-button');
          const todoList = document.getElementById('todo-list');
          const errorMessage = document.getElementById('error-message');

          // Add todo to the list
          sendButton.addEventListener('click', () => {
            const todoText = inputField.value.trim();
            if (todoText) {
              const newTodo = document.createElement('li');
              newTodo.textContent = todoText;
              todoList.appendChild(newTodo);
              inputField.value = ''; // Clear the input field
            }
          });
        </script>
      </body>
    </html>
  `);
});

// Start the server
const server = app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});