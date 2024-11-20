#!/bin/bash
echo "Stopping the server..."
container_id=$(docker ps -q --filter "ancestor=my-node-app")
if [ -n "$container_id" ]; then
    docker stop "$container_id"
    echo "Server stopped."
else
    echo "No running server found."
fi