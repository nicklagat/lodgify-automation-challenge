# Choose the version of Node.js
FROM node:14

# Create a new user to run the app
RUN useradd appuser && chown -R appuser /app

# Set the working directory in the container to /app
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies in the container
RUN npm ci

# Copy the rest of your app's source code from your host to your image filesystem.
COPY . .

# Make sure that Cypress binary was installed
RUN $(npm bin)/cypress verify

# If your app listens on a port, expose it (replace 3000 with the correct port)
EXPOSE 3000

# Change to the app user
USER appuser

# Set the default command for the container
CMD ["npm", "test"]
