# Use Node.js-alpine as the base image
FROM node:23-alpine

# Set the working directory
WORKDIR /app

# Copy the application files
COPY package.json index.js ./

# Expose the port
EXPOSE ${PORT}

# Run the application
CMD ["node", "index.js"]
