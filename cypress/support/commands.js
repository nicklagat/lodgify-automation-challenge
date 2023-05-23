// custom commands
Cypress.Commands.add("AuthViaAPI", () => {
  // Loading login credentials from the fixtures
  cy.fixture("loginDetails.json").then((authdetails) => {
    // Destructure the properties from the authdetails object to have concise way of accessing them
    const {
      email,
      password,
      pkce_oauth,
      web_session,
      permanent_login,
      device_id,
    } = authdetails;

    // POST request to the API for user login
    cy.request("POST", "/API/v9.0/user/login", {
      email,
      password,
      pkce_oauth,
      web_session,
      permanent_login,
      device_id,
    })
      .its("body")
      .then((response) => {
        // Verify that the response contains a 'token' property
        expect(response).to.have.property("token");

        // Store the generated token in the local storage
        window.localStorage.setItem("authToken", response.token);

        // Store the token in the Cypress.env for access in other tests
        const authToken = response.token;
        Cypress.env("authToken", authToken); // Store the token in Cypress.env
        // cy.log(authToken);
      });
  });
});

Cypress.Commands.add("createProjectViaAPI", () => {
  // Retrieve the authentication token from Cypress environment variables
  const authToken = Cypress.env("authToken");

  // Retrieve the project details from the `createProject.json` fixture
  return cy.fixture("createProject.json").then((project) => {
    const { name } = project;

    // Send a POST request to create a project
    return cy
      .request({
        method: "POST",
        url: `${Cypress.env("apiBaseUrl")}/rest/v2/projects`,
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
        body: {
          name: project.name,
        },
      })
      .its("body")
      .then((response) => {
        // Assert that the response contains the expected properties
        expect(response).to.have.property("id");
        expect(response).to.have.property("name");

        // Store the project ID in Cypress.env
        Cypress.env("projectId", response.id);

        // Return the response for further use in the test
        return cy.wrap(response);
      });
  });
});

Cypress.Commands.add("createTaskViaAPI", () => {
  // Retrieve the token from Cypress.env
  const authToken = Cypress.env("authToken");

  // Retrieve the project ID from Cypress.env
  const projectId = Cypress.env("projectId");

  cy.fixture("webAppTasks").then((createdtasks) => {
    const { content } = createdtasks;

    // Step 1: Send a POST request to create a task via API
    cy.request({
      method: "POST",
      url: `${Cypress.env("apiBaseUrl")}/rest/v2/tasks`,
      headers: {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
      },
      body: {
        content: content,
        project_id: projectId,
      },
    })
      .its("body")
      .then((response) => {
        // Step 2: Assert that the response contains the expected properties
        expect(response).to.have.property("content");
        expect(response).to.have.property("creator_id");
        expect(response.is_completed).to.equal(false);

        // Step 3: Output relevant information for verification or debugging
        console.log(response.is_completed);
        console.log(response.content);
      });
  });
});

Cypress.Commands.add("updateTaskViaAPI", (dueString) => {
  // Retrieve the token from Cypress.env
  const authToken = Cypress.env("authToken");
  // Step 1: Create a task via API and retrieve the response
  return cy.createTaskViaAPI().then((response) => {
    // Step 2: Extract the task_id from the response
    const taskId = response.id;
    // Step 3: Perform a PUT request using the extracted task_id
    return cy
      .request({
        method: "POST",
        url: `${Cypress.env("apiBaseUrl")}/rest/v2/tasks/${taskId}`,
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
        body: {
          due_string: dueString,
        },
      })
      .its("body");
  });
});

Cypress.Commands.add("completeTaskViaAPI", () => {
  // Retrieve the token from Cypress.env
  const authToken = Cypress.env("authToken");

  // Create a task via API
  return cy.createTaskViaAPI().then((response) => {
    // Step 2: Extract the task_id from the response
    const taskId = response.id;
    cy.log(taskId)

    // Perform a POST request to complete the task
    return cy
      .request({
        method: "POST",
        url: `${Cypress.env("apiBaseUrl")}/rest/v2/tasks/${taskId}/close`,
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      })
      .then((completeResponse) => {
        // Step 4: Output relevant information for verification or debugging
        console.log(completeResponse);
      });
  });
});


Cypress.Commands.add("deleteProjectViaAPI", () => {
  // Retrieve the authentication token from Cypress environment variables
  const authToken = Cypress.env("authToken");

  // Retrieve the project ID from Cypress.env
  const projectId = Cypress.env("projectId");

  // Send a DELETE request to delete the project
  return cy
    .request({
      method: "DELETE",
      url: `${Cypress.env("apiBaseUrl")}/rest/v2/projects/${projectId}`,
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    })
    .then((deleteResponse) => {
      // Output relevant information for verification or debugging
      console.log(deleteResponse);

      // Verify that the project was successfully deleted
      expect(deleteResponse.status).to.equal(204);

      // Return the delete response for further use in the test
      return cy.wrap(deleteResponse);
    });
});


















Cypress.Commands.add("loginViaUI", () => {
  cy.fixture("credentials.json").then((credentials) => {
    const { username, password } = credentials;

    // Visit the login page
    cy.visit("/auth/login");

    // Enter the username
    cy.get('[id^="element-"]').first().clear(); // Clear the input field (if necessary)
    cy.get('[id^="element-"]').first().type(username); // Type the username into the input field

    // Enter the password
    cy.get('[id^="element-"]').last().type(password); // Type the password into the input field

    // Click the login button
    cy.get('[data-gtm-id="start-email-login"]').click();
  });
});

const TIMEOUT = 70000; // Adjust this value as needed

Cypress.Commands.add("createTaskViaWeb", () => {
  // Retrieve the tasks from the webAppTasks.json fixture
  cy.fixture("webAppTasks.json").then((webTasks) => {
    // Iterate over each webTask
    webTasks.forEach((webTask, index) => {
      const { content, project_id } = webTask;

      // Click on the add task button
      cy.get(".plus_add_button", { timeout: TIMEOUT })
        .eq(index)
        .should("be.visible")
        .click();

      // Select the project from the project list
      cy.get("#projects_list");
      cy.get(
        `li[data-type="project_list_item"][data-id="${project_id}"]`
      ).click();

      // Click on the add task button within the project
      cy.get("button.plus_add_button").should("be.visible").click();

      // Type the task content
      cy.get('p[data-placeholder="Task name"]').type(content);

      // Submit the task
      cy.get('button[data-testid="task-editor-submit-button"]')
        .should("be.visible")
        .click();
    });
  });
});
