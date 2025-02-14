#!/bin/sh

# Fetch a random Wikipedia URL
RANDOM_URL=$(curl -s -I "https://en.wikipedia.org/wiki/Special:Random" | grep -i "location:" | awk '{print $2}' | tr -d '\r')

# Create a todo with the random URL
curl -X POST "http://todo-backend-svc:2345/todos" \
  -H "Content-Type: application/json" \
  -d "{\"text\": \"Read $RANDOM_URL\"}"
