const fs = require("fs");
const path = require("path");
const { defineConfig } = require("cypress");

// Define the path to the results directory
const resultsDir = path.join(__dirname, "./cypress/reports");

// Delete the results directory if it exists
if (fs.existsSync(resultsDir)) {
  fs.rmdirSync(resultsDir, { recursive: true });
}

module.exports = defineConfig({
  video: true,
  videoTimeout: 2200000,
  videoCompression: 5,
  e2e: {
    baseUrl: "https://todoist.com",
    env: {
      apiBaseUrl: "https://api.todoist.com",
      // projectId: response.id,
    },
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },

  browser: "chrome",

  reporter: "mochawesome",
  reporterOptions: {
    reportDir: "cypress/reports",
    overwrite: false,
    html: true,
    json: false,
  },
});
