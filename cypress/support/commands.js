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

    // // Check if login details are not undefined, null or empty
    // if (!email || !password || !pkce_oauth || !web_session || !permanent_login || !device_id) {
    //   throw new Error("One or more login details are undefined, null or empty");
    // }

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
        // Check if response is not undefined or null
        if (!response) {
          throw new Error("AuthViaAPI response is undefined or null");
        }

        // Verify that the response contains a 'token' property
        expect(response).to.have.property("token");

        // Check if token is not undefined, null or empty
        const { token } = response;
        if (!token) {
          throw new Error("Token is undefined, null or empty");
        }

        // Store the generated token in the local storage
        window.localStorage.setItem("authToken", token);

        // Store the token in the Cypress.env for access in other tests
        Cypress.env("authToken", token);

        // Check if token stored in localStorage and Cypress.env matches the token in response
        if (
          window.localStorage.getItem("authToken") !== token ||
          Cypress.env("authToken") !== token
        ) {
          throw new Error(
            "Stored tokens do not match the token returned in the response"
          );
        }
      });
  });
});

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
  return cy.fixture("createProject.json").then((project) => {
    const { name } = project;

    // Check if project name is not undefined, null or empty
    if (!name) {
      throw new Error("project name is undefined, null or empty");
    }

    // Send a POST request to create a project
    return cy
      .request({
        method: "POST",
        url: `${apiBaseUrl}/rest/v2/projects`,
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
        // Check if response is not undefined or null
        if (!response) {
          throw new Error("createProjectViaAPI response is undefined or null");
        }

        // Check if the name of the project returned matches the name we sent
        if (response.name !== name) {
          throw new Error(
            "The project's name does not match the name provided"
          );
        }

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
  // Retrieve the token from Cypress environment variables
  const authToken = Cypress.env("authToken");

  // Check if authToken is not undefined or null
  if (!authToken) {
    throw new Error("authToken is undefined or null");
  }

  // Retrieve the project ID from Cypress environment variables
  const projectId = Cypress.env("projectId");

  // Check if projectId is not undefined, null or empty
  if (!projectId) {
    throw new Error("projectId is undefined, null or empty");
  }

  cy.fixture("webAppTasks").then((createdtasks) => {
    const { content } = createdtasks;

    // Check if content is not undefined, null or empty
    if (!content) {
      throw new Error("content is undefined, null or empty");
    }

    // Send a POST request to create a task via API
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
        // Check if response is not undefined or null
        if (!response) {
          throw new Error("createTaskViaAPI response is undefined or null");
        }

        // Check if the content of the task returned matches the content we sent
        if (response.content !== content) {
          throw new Error(
            "The task's content does not match the content provided"
          );
        }

        // Assert that the response contains the expected properties
        expect(response).to.have.property("content");
        expect(response).to.have.property("creator_id");
        expect(response.is_completed).to.equal(false);

        // Output relevant information for verification or debugging
        console.log(response.is_completed);
        console.log(response.content);
      });
  });
});

Cypress.Commands.add("updateTaskViaAPI", (dueString) => {
  // Retrieve the token from Cypress environment variables
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

  // Step 1: Create a task via API and retrieve the response
  return cy.createTaskViaAPI().then((response) => {
    // Check if response is not undefined or null
    if (!response) {
      throw new Error("createTaskViaAPI response is undefined or null");
    }

    // Step 2: Extract the task_id from the response
    const taskId = response.id;

    // Check if taskId is not undefined or null
    if (!taskId) {
      throw new Error("taskId is undefined or null");
    }

    // Step 3: Perform a POST request using the extracted task_id to update the task
    return cy
      .request({
        method: "POST",
        url: `${apiBaseUrl}/rest/v2/tasks/${taskId}`,
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
        body: {
          due_string: dueString,
        },
      })
      .then((updateResponse) => {
        // Check if updateResponse is not undefined or null
        if (!updateResponse) {
          throw new Error("updateResponse is undefined or null");
        }

        // Return the response body
        return cy.wrap(updateResponse.body);
      });
  });
});

Cypress.Commands.add("completeTaskViaAPI", () => {
  // Step 1: Retrieve the token from Cypress environment variables
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

  // Step 2: Create a task via API
  return cy.createTaskViaAPI().then((response) => {
    // Check if response is not undefined or null
    if (!response) {
      throw new Error("createTaskViaAPI response is undefined or null");
    }

    // Step 3: Extract the task_id from the response
    const taskId = response.id;

    // Check if taskId is not undefined or null
    if (!taskId) {
      throw new Error("taskId is undefined or null");
    }

    cy.log(taskId);

    // Step 4: Perform a POST request to complete the task
    return cy
      .request({
        method: "POST",
        url: `${apiBaseUrl}/rest/v2/tasks/${taskId}/close`,
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      })
      .then((completeResponse) => {
        // Check if completeResponse is not undefined or null
        if (!completeResponse) {
          throw new Error("completeResponse is undefined or null");
        }

        // Step 5: Output relevant information for verification or debugging
        console.log(completeResponse);
      });
  });
});

Cypress.Commands.add("getTaskViaAPI", () => {
  // Step 1: Retrieve the token from Cypress environment variables
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

  // Step 2: Perform a GET request to get an active task by ID
  return cy
    .request({
      method: "GET",
      url: `${apiBaseUrl}/rest/v2/tasks`,
      headers: {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
      },
    })
    .then((completeResponse) => {
      // Check if completeResponse is not undefined or null
      if (!completeResponse) {
        throw new Error("completeResponse is undefined or null");
      }

      // Step 5: Output relevant information for verification or debugging
      console.log(completeResponse);

      return completeResponse;
    });
});

Cypress.Commands.add("deleteProjectViaAPI", () => {
  // Retrieve the authentication token from Cypress environment variables
  const authToken = Cypress.env("authToken");

  // Retrieve the project ID from Cypress.env
  const projectId = Cypress.env("projectId");

  // Retrieve the API base URL from Cypress.env
  const apiBaseUrl = Cypress.env("apiBaseUrl");

  // Check if authToken, projectId, and apiBaseUrl are not undefined or null
  if (!authToken || !projectId || !apiBaseUrl) {
    throw new Error("authToken, projectId or apiBaseUrl is undefined or null");
  }

  // Send a DELETE request to delete the project
  return cy
    .request({
      method: "DELETE",
      url: `${apiBaseUrl}/rest/v2/projects/${projectId}`,
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    })
    .then((deleteResponse) => {
      // Check if deleteResponse is not undefined or null
      if (!deleteResponse) {
        throw new Error("deleteResponse is undefined or null");
      }

      // Output relevant information for verification or debugging
      console.log(deleteResponse);

      // Verify that the project was successfully deleted
      // HTTP status 204 means 'No Content', which is typically returned after a successful deletion
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
    cy.get('[id^="element-"]').first().type(username, { log: false }); // Type the username into the input field

    // Enter the password
    cy.get('[id^="element-"]').last().type(password, { log: false }); // Type the password into the input field

    // Click the login button
    cy.get('[data-gtm-id="start-email-login"]').click();
  });
});

const TIMEOUT = 70000; // Adjust this value as needed

Cypress.Commands.add("createTaskViaWeb", (projectId) => {
  // Retrieve the tasks from the webAppTasks.json fixture
  cy.fixture("webAppTasks.json").then((webTasks) => {
    const { content } = webTasks;

    // Click on the add task button
    cy.get(".plus_add_button", { timeout: TIMEOUT })
      .should("be.visible")
      .click();

    // Select the project from the project list
    cy.get("#projects_list");
    if (projectId) {
      // Ensure projectId is defined
      cy.get(`li[data-type="project_list_item"][data-id="${projectId}"]`, {
        timeout: 10000,
      }).click();
    } else {
      throw new Error("Project ID is undefined");
    }

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






// Negative scenarios

Cypress.Commands.add("createInvalidProjectViaAPI", () => {
  const authToken = Cypress.env("authToken");
  const apiBaseUrl = Cypress.env("apiBaseUrl");

  return cy
    .request({
      method: "POST",
      url: `${apiBaseUrl}/rest/v2/projects`,
      headers: {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
      },
      body: {}, // An empty body signifies missing required fields
      failOnStatusCode: false // Prevent Cypress from failing the test if the status code is 4xx or 5xx
    });
});
