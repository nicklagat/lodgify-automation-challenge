describe("Update Task Via API", () => {
  beforeEach(() => {
    // Authenticate or obtain the auth token
    cy.AuthViaAPI();

    cy.createProjectViaAPI();
  });

  it("should update task via API", () => {
    // Step 1: Update task via API
    cy.updateTaskViaAPI("2023-08-23").then((updatedTask) => {
      // Handle the updated task response as needed
      console.log(updatedTask);
      // Step 2: Login into the web application
      cy.loginViaUI();
      // Step 3: Verify on web application that task is updated
    });
  });

  it("should return error when updating task without providing any information", () => {
    // Attempt to update a task without providing any required fields
    cy.updateTaskViaAPI("").then((response) => {
      // Verify that the due date in the response is null
      expect(response.due).to.eq(null);
    });
  });
});
