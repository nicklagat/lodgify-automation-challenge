describe("Complete Task Via API", () => {
  // This function runs before each test inside this block
  beforeEach(() => {
    // Authenticate or obtain the auth token
    cy.AuthViaAPI();

    // Creates a project via API, this is done before each test as a setup step.
    // This also stores the project ID in Cypress environment variables for later use.
    cy.createProjectViaAPI();
  });

  // This is a single test which checks if a task can be completed via API
  it("should complete task via API", () => {
    // Step 1: Complete task via API
    cy.completeTaskViaAPI().then((response) => {
      // Check the response's status
      expect(response.status).to.equal(204);
      // Step 2: Login into the web application
      cy.loginViaUI();
      // Step 3: Verify on web application that the task is completed
    });
    cy.deleteProjectViaAPI().then((response) => {
      // Check the response's status
      expect(response.status).to.equal(204);
    });
  });
});
