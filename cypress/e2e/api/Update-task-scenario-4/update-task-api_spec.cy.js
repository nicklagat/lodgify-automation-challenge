describe("Update Task Via API", () => {
  beforeEach(() => {
    // Step 1: Authenticate or obtain the auth token
    cy.AuthViaAPI();

    // Step 2: Create a new project via API, which will be used as a prerequisite for creating tasks
    cy.createProjectViaAPI();
  });

  it("should update task via API", () => {
    // Step 3: Update the due date of a task via API to "2023-08-23"
    cy.updateTaskViaAPI("2023-08-23").then((updatedTask) => {
      // Step 4: Output the updated task details for validation or debugging
      console.log(updatedTask);

      // Step 5: Log in to the web application through the user interface
      cy.loginViaUI();

    });

    cy.wait(60000)

    cy.deleteProjectViaAPI();
  });

  it("should return error when updating task without providing any information", () => {
    // Step 3: Attempt to update the due date of a task via API without providing the new due date
    cy.updateTaskViaAPI("").then((response) => {
      // Step 4: Check the response and ensure the due date is null, indicating the update attempt has failed
      expect(response.due).to.eq(null);
    });
    cy.deleteProjectViaAPI();
  });
});
