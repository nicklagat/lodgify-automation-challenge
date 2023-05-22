const { defineConfig } = require("cypress");

module.exports = defineConfig({
  video: true,
  videoTimeout: 120000,
  videoCompression: 5,
  e2e: {
    baseUrl: "https://todoist.com",
    env: {
      apiBaseUrl: "https://api.todoist.com",
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
