describe("Complete Task Via API", () => {
  beforeEach(() => {
    // Step 1: Authenticate via API to obtain the auth token
    cy.AuthViaAPI();

    // Step 2: Create a new project via API before each test as a setup step
    cy.createProjectViaAPI();
  });

  it("should complete task via API", () => {
    // Step 3: Complete a task via API and check the response status
    cy.completeTaskViaAPI().then((response) => {
      // Step 4: Verify that the task has been completed by checking the status code in the response
      expect(response.status).to.equal(204);

      // Step 5: Login to the web application
      cy.loginViaUI();

      // Step 6: Verify on the web application that the task has been completed
      // The specific steps to do this will depend on your application
    });

    // Step 7: Delete the project via API and check the response status
    cy.deleteProjectViaAPI().then((response) => {
      expect(response.status).to.equal(204);
    });
  });

  it("should not complete task via API without providing necessary information", () => {
    // Step 3: Attempt to mark a task as complete without providing a task ID
    cy.request({
      method: "POST",
      url: `${Cypress.env("apiBaseUrl")}/rest/v2/tasks//close`,
      headers: {
        Authorization: `Bearer ${Cypress.env("authToken")}`,
        "Content-Type": "application/json",
      },
      failOnStatusCode: false, // allow the request to fail without throwing an error
    }).then((response) => {
      // Step 4: Verify that the task completion attempt was unsuccessful by checking the status code in the response
      expect(response.status).to.not.equal(200);

      // Step 5: Log the response for debugging purposes
      console.log(response);
    });
  });
});
