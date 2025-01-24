# Use an official Node.js runtime as the base image
FROM node:23-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY reader.js ./

# Create a directory for shared data
RUN mkdir -p /shared-data

# Command to run the application
CMD ["node", "reader.js"]
