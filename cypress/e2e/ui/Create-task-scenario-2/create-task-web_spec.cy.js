describe("Create Task via Web Application", () => {
  let projectId; // Declare projectId variable
  beforeEach(() => {
    // Step 1: Authenticate or obtain the auth token
    cy.AuthViaAPI();

    // Step 2: Login into the web application
    cy.loginViaUI();
  });

  it("should create task via web application", () => {
    // Step 3: Verify on web application that task is created
    cy.createProjectViaAPI().then((response) => {
      projectId = response.id; // Set projectId variable

      // Use projectId in the tests below
      cy.log(`Project ID: ${projectId}`);
      // Add your tests here
      cy.createTaskViaWeb(projectId).then(() => {
        cy.wait(2000);
        cy.getTaskViaAPI().then((apiResponse) => {
          // Here you have the response from your API.
          console.log("Eat food");
          console.log(apiResponse.body); // Logs the response body

          const allTasks = apiResponse.body; // This is the array of all tasks
          console.log("Your tasks: ", allTasks);
          const specificTask = allTasks.find(
            (task) =>
              task.content === "Follow up with client regarding proposal"
          ); //
          console.log("Specific tasks: ", specificTask);

          expect(specificTask).to.exist;
        });
      });
    });
  });
});
