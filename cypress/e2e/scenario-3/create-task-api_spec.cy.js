describe("Create Task Via API", () => {
  beforeEach(() => {
    // Authenticate or obtain the auth token
    cy.AuthViaAPI();

    // Create project via API and retrieve the project ID
    cy.createProjectViaAPI();
  });

  it("should create task via API", () => {
    // Step 1: Create task via API
    cy.createTaskViaAPI().then((response) => {
      console.log(response);
      const createdTask = response.id;
      const projectId = Cypress.env("projectId");
      // Step 2: Login into the web application
      cy.loginViaUI();
      // Step 3: Verify on web application that task is created
      cy.visit("app/project/" + projectId + createdTask);
      // `Step 4: Assert that the project url is present on the page
      cy.url().should("include", "/app/project/" + projectId + createdTask);
    });
  });
});