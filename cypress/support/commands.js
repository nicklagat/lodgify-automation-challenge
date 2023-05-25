import LoginPage from "../e2e/pom/loginPage";

import AuthService from "./api-commands/authService";

import ProjectService from "./api-commands/projectService";

import TaskService from "./api-commands/taskService";

import UpdateTaskService from "./api-commands/updateTaskService";

import CompleteTaskService from "./api-commands/completeTaskService";

import GetTasksService from "./api-commands/getTasksService";

import DeleteProjectService from "./api-commands/deleteProjectService";

import CreateWebTaskService from "./api-commands/createWebTaskService";

// --------------------------------  LOGIN VIA WEB APPLICATION ----------------------------------------------------------------

Cypress.Commands.add("loginViaUI", () => {
  cy.fixture("credentials.json").then((credentials) => {
    const { username, password } = credentials;

    const loginPage = new LoginPage();

    // Visit the login page
    loginPage.navigate();

    // Enter the username
    loginPage.enterEmail(username);

    // Enter the password
    loginPage.enterPassword(password);

    // Click the login button
    loginPage.submit();
  });
});

// --------------------------------  AUTHENTICATION VIA API----------------------------------------------------------------

Cypress.Commands.add("AuthViaAPI", () => {
  // Loading login credentials from the fixtures
  cy.fixture("loginDetails.json").then((authdetails) => {
    const authService = new AuthService();
    authService.loginViaAPI(authdetails);
  });
});

// --------------------------------  CREATE PROJECT VIA API----------------------------------------------------------------

Cypress.Commands.add("createProjectViaAPI", () => {
  // Retrieve the authentication token from Cypress environment variables
  const authToken = Cypress.env("authToken");

  // Check if authToken is not undefined or null
  if (!authToken) {
    throw new Error("authToken is undefined or null");
  }

  // Retrieve the API base URL from Cypress environment variables
  const apiBaseUrl = Cypress.env("apiBaseUrl");

  // Check if apiBaseUrl is not undefined or null
  if (!apiBaseUrl) {
    throw new Error("apiBaseUrl is undefined or null");
  }

  // Retrieve the project details from the `createProject.json` fixture
  cy.fixture("createProject.json").then((project) => {
    const projectService = new ProjectService();
    projectService
      .createProjectViaAPI(authToken, apiBaseUrl, project)
      .then((response) => {
        // Store the project ID in Cypress.env
        Cypress.env("projectId", response.id);
      });
  });
});

// --------------------------------  CREATE TASK VIA API----------------------------------------------------------------

Cypress.Commands.add("createTaskViaAPI", () => {
  // Retrieve the token and project ID from Cypress environment variables
  const authToken = Cypress.env("authToken");
  const projectId = Cypress.env("projectId");
  const apiBaseUrl = Cypress.env("apiBaseUrl");

  // Retrieve the task details from the `webAppTasks` fixture
  cy.fixture("webAppTasks").then((createdtasks) => {
    const taskService = new TaskService();
    taskService.createTaskViaAPI(
      authToken,
      apiBaseUrl,
      projectId,
      createdtasks
    );
  });
});

// -------------------------------- UPDATE TASK VIA API----------------------------------------------------------------

Cypress.Commands.add("updateTaskViaAPI", (dueString) => {
  // Retrieve the token and API base URL from Cypress environment variables
  const authToken = Cypress.env("authToken");
  const apiBaseUrl = Cypress.env("apiBaseUrl");

  // Step 1: Create a task via API and retrieve the response
  return cy.createTaskViaAPI().then((response) => {
    // Check if response is not undefined or null
    if (!response) {
      throw new Error("createTaskViaAPI response is undefined or null");
    }

    // Step 2: Extract the task_id from the response
    const taskId = response.id;

    // Step 3: Use the TaskService to update the task
    const taskService = new UpdateTaskService();
    return taskService.updateTaskViaAPI(
      authToken,
      apiBaseUrl,
      taskId,
      dueString
    );
  });
});
// --------------------------------  COMPLETE TASK VIA API ----------------------------------------------------------------

Cypress.Commands.add("completeTaskViaAPI", () => {
  const taskService = new CompleteTaskService();

  const authToken = Cypress.env("authToken");
  const apiBaseUrl = Cypress.env("apiBaseUrl");

  return taskService.completeTaskViaAPI(authToken, apiBaseUrl);
});

// --------------------------------  GET TASK VIA API----------------------------------------------------------------

Cypress.Commands.add("getTaskViaAPI", () => {
  const taskService = new GetTasksService();

  const authToken = Cypress.env("authToken");
  const apiBaseUrl = Cypress.env("apiBaseUrl");

  return taskService.getTaskViaAPI(authToken, apiBaseUrl);
});

// --------------------------------  DELETE PROJECT VIA API----------------------------------------------------------------

Cypress.Commands.add("deleteProjectViaAPI", () => {
  const projectService = new DeleteProjectService();

  const authToken = Cypress.env("authToken");
  const apiBaseUrl = Cypress.env("apiBaseUrl");
  const projectId = Cypress.env("projectId");

  return projectService.deleteProjectViaAPI(authToken, apiBaseUrl, projectId);
});

// --------------------------------  CREATE TASK VIA WEB APPLICATION ----------------------------------------------------------------

Cypress.Commands.add("createTaskViaWeb", (projectId) => {
  const taskService = new CreateWebTaskService();
  return taskService.createTaskViaWeb(projectId);
});

// --------------------------------  CREATE INVALID PROJECT VIA API ----------------------------------------------------------------

Cypress.Commands.add("createInvalidProjectViaAPI", () => {
  const authToken = Cypress.env("authToken");
  const apiBaseUrl = Cypress.env("apiBaseUrl");

  return cy.request({
    method: "POST",
    url: `${apiBaseUrl}/rest/v2/projects`,
    headers: {
      Authorization: `Bearer ${authToken}`,
      "Content-Type": "application/json",
    },
    body: {}, // An empty body signifies missing required fields
    failOnStatusCode: false, // Prevent Cypress from failing the test if the status code is 4xx or 5xx
  });
});
