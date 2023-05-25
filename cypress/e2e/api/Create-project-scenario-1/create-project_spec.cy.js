describe("Create Project", () => {
  beforeEach(() => {
    // Step 1: Authenticate or obtain the auth token
    cy.AuthViaAPI();
  });

  it("should create project via API", () => {
    // Step 2: Create a new project via API
    cy.createProjectViaAPI().then((response) => {
      // Retrieve the ID of the created project
      const createdProject = response.id;

      // Step 3: Log in to the web application
      cy.loginViaUI();

      // Step 4: Verify that the project was created by visiting its URL on the web application
      cy.visit("app/project/" + createdProject);

      // Step 5: Assert that the project name is visible on the page
      cy.contains(response.name).should("be.visible");

      // Step 6: Assert that the current URL includes the project's ID
      cy.url().should("include", "/app/project/" + createdProject);

      // Output the ID of the created project for further use or debugging
      cy.log("Project ID:", createdProject);

      // Step 7: Delete the created project via API
      cy.deleteProjectViaAPI();
    });
  });

  it("should return error when creating project without required fields", () => {
    // Step 2: Attempt to create a new project without providing any required fields
    cy.createInvalidProjectViaAPI().then((response) => {
      // Step 3: Verify that the API returns an error response indicating the missing information
      expect(response.status).to.eq(400);
      expect(response.statusText).to.eq("Bad Request");

      // Step 4: Check the API response to ensure it contains the correct error message
      expect(response.body).to.eq(
        "Name must be provided for the project creation"
      );
    });
  });
});
