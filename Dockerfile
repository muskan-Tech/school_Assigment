# Use the official Node.js 18 Alpine image as the base image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /app

# Enable Corepack and prepare Yarn 3.4.1 for immediate use
RUN corepack enable && corepack prepare yarn@3.4.1 --activate

# Copy the package.json and yarn.lock files separately to leverage Docker cache
COPY package.json yarn.lock ./

# Install dependencies using Yarn. The --frozen-lockfile flag ensures that the versions specified in yarn.lock are used.
RUN yarn install --frozen-lockfile

# Copy the rest of the application code into the container
COPY . .

# Expose the port on which the application will run
EXPOSE 3000

# Define the command to start the application
CMD ["node", "index.js"]
