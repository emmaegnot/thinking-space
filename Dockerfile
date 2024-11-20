# Use the official Node.js base image
FROM node:18

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json for dependency installation
COPY src/server/package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY src/ /app/

# Expose the port the application listens on
EXPOSE 3000

# Command to start the application
CMD ["npm", "start"]
