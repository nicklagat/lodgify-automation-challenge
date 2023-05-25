# Use the Cypress-provided base image, which includes all necessary dependencies.
FROM cypress/base:14

# Set the working directory to /app
WORKDIR /app

# Copy package.json and package-lock.json into the working directory
COPY package*.json ./

# By setting the CI environment variable, we switch the Cypress install messages to 
# a more minimal style to avoid many lines of progress messages
ENV CI=1

# Install npm dependencies including Cypress
RUN npm ci

# Verify that Cypress is installed correctly
RUN npx cypress verify

# Copy the rest of the application source code
COPY . .

# If your application listens on a specific port, expose that port.
# Replace 3000 if your application uses a different port.
EXPOSE 3000

# Set the default command to build and run your application
# Here, we're using "cypress run" to run the tests.
CMD ["npm", "run", "start"]
