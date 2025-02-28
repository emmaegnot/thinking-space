#!/bin/bash
echo "Building the application..."
docker build -t my-node-app .

echo "Starting the application..."
docker run -d -p 3000:3000 my-node-app