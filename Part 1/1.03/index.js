const generateRandomString = () => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

const randomString = generateRandomString();

const logOutput = () => {
  const timestamp = new Date().toISOString();
  console.log(`${timestamp}: ${randomString}`);
};

// Log the random string every 5 seconds
setInterval(logOutput, 5000);

// Log the random string immediately on startup
logOutput();
