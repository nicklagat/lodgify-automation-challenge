describe("Create Project", () => {
  beforeEach(() => {
    // Authenticate or obtain the auth token
    cy.AuthViaAPI();
  });

  it("should create project via API", () => {
    // Step 1: Create test task via API
    cy.createProjectViaAPI().then((response) => {
      const createdProject = response.id;
      // Step 2: Login into the web application
      cy.loginViaUI();
      // Step 3: Verify on web application that projected is created
      cy.visit("app/project/" + createdProject);
      // Step 4: Assert that the project name is present on the page
      cy.contains(response.name).should("be.visible");
      // `Step 5: Assert that the project url is present on the page
      cy.url().should("include", "/app/project/" + createdProject);

      cy.log("Project ID:", createdProject);
      cy.deleteProjectViaAPI();
    });
  });

  it.only("should return error when creating project without required fields", () => {
    // Attempt to create a new project without providing any required fields
    cy.createInvalidProjectViaAPI().then((response) => {
      // Verify that the API returns an error response indicating the missing information.
      expect(response.status).to.eq(400);
      expect(response.statusText).to.eq("Bad Request");
      expect(response.body).to.eq(
        "Name must be provided for the project creation"
      );
    });
  });
});
