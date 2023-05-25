describe("Create Task Via API", () => {
  beforeEach(() => {
    // Step 1: Authenticate or obtain the auth token
    cy.AuthViaAPI();

    // Step 2: Create a new project via API
    cy.createProjectViaAPI();
  });

  it("should create task via API", () => {
    // Step 3: Create a new task via API
    cy.createTaskViaAPI().then((response) => {
      // Retrieve the ID of the created task and the project ID
      const createdTask = response.id;
      const projectId = Cypress.env("projectId");

      // Step 4: Log in to the web application
      cy.loginViaUI();

      // Step 5: Visit the task's page on the web application to verify it's been created
      cy.visit("app/project/" + projectId + createdTask);

      // Step 6: Assert that the current URL includes the created task's ID
      cy.url().should("include", "/app/project/" + projectId + createdTask);
    });
  });

  it("should not create task without required fields", () => {
    // Step 3: Attempt to create a new task without providing any required fields
    cy.request({
      method: "POST",
      url: `${Cypress.env("apiBaseUrl")}/rest/v2/tasks`,
      headers: {
        Authorization: `Bearer ${Cypress.env("authToken")}`,
        "Content-Type": "application/json",
      },
      body: {},
      failOnStatusCode: false,
    }).then((response) => {
      // Step 4: Check the response's status code. It should not be 200 (OK) because the task creation should have failed
      expect(response.status).to.not.equal(200);
    });
  });
});
