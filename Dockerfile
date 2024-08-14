# Use the official Node.js image as the base image
FROM node:18-alpine
# Set the working directory inside the container
WORKDIR /app
# Enable corepack and set the Yarn version to 3.4.1
RUN corepack enable \
    && corepack prepare yarn@3.4.1 --activate
# Copy package.json and yarn.lock first for better caching
COPY package.json yarn.lock ./
# Copy all files from the current directory to the container, including node_modules
COPY . .
RUN yarn
# Expose the port the app runs on (adjust if necessary)
EXPOSE 3000
WORKDIR /app
CMD ["yarn", "start"]