# Use Node.js-alpine as the base image
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Copy the files
COPY . .

# Install dependencies
RUN npm install

# Run the application
CMD ["node", "index.js"]
