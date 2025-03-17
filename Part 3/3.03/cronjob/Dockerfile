FROM alpine:latest

# Install curl
RUN apk add --no-cache curl

# Copy the script
COPY fetch-random-wikipedia.sh /usr/local/bin

# Make the script executable
RUN chmod +x /usr/local/bin/fetch-random-wikipedia.sh

# Set the script as the entrypoint
ENTRYPOINT ["fetch-random-wikipedia.sh"]
