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
  fs.mkdirSync(CACHE_DIR);
}

// Function to fetch a new image from Lorem Picsum
const fetchNewImage = async () => {
  try {
    const response = await axios.get('https://picsum.photos/1200', {
      responseType: 'stream',
    });
    response.data.pipe(fs.createWriteStream(CACHE_IMAGE_PATH));
    console.log('New image fetched and cached.');
  } catch (error) {
    console.error('Error fetching new image:', error);
  }
};

// Middleware to serve the cached image or fetch a new one if needed
app.use(async (req, res, next) => {
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

// Start the server
const server = app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});