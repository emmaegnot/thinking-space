@echo off
docker build -t my-node-app .
docker run -p 3000:3000 my-node-app
pause