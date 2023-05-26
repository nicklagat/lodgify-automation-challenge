# Use the Cypress-provided base image, which includes all necessary dependencies.
FROM cypress/base:14

# Set the working directory to /app
WORKDIR /app

# Copy package.json and package-lock.json into the working directory
COPY package*.json ./


# To be implemented later