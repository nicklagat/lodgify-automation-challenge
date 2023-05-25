describe("Update Task via Web Application", () => {
  beforeEach(() => {
    // Step 1: Get auth token
    cy.AuthViaAPI();

    // Step 2: Login into the web application through the user interface
    cy.loginViaUI();
  });

  it("should update the task via the web application/ui", () => {
    const projectName = "Software Engineering Project";
    const content = "Eat Food";

    // Step 3: Verify on the web application that the task is updated
    cy.wait(Math.floor(Math.random() * (60000 - 30000 + 1)) + 30000);

    // Click on the "Add project" button
    cy.get("button")
      .filter(
        '[aria-label="Add project"][type="button"][aria-disabled="false"][tabindex="0"]'
      )
      .click()
      .then(() => {
        // Here you can interact with the modal or perform further actions

        // Creating a project via UI
        cy.get('[data-testid="modal-overlay"]')
          .find("input#edit_project_modal_field_name")
          .type("Software Engineering Project");

        // Click on the submit button to create the project
        cy.get("button")
          .filter('[type="submit"][aria-disabled="false"][class^="_8313bd46"]')
          .click();
      });

    console.log(projectName);
    cy.wait(15000);

    // Iterate over the project list items and click on the project with the specified name
    cy.get("#projects_list li").each((listItem) => {
      cy.wrap(listItem)
        .should("contain", "Software Engineering Project")
        .click();
    });

    // Click on the "Add task" button
    cy.get("button.plus_add_button").should("be.visible").click();

    // Type the task content
    cy.get('p[data-placeholder="Task name"]').type(content);

    // Click on the submit button to create the task
    cy.get('button[data-testid="task-editor-submit-button"]')
      .should("be.visible")
      .click();

    cy.wait(4000);

    // Click on the cancel button to close the task creation modal
    cy.get("button")
      .filter(
        '[aria-label="Cancel"][type="button"][aria-disabled="false"][class^="_8313bd46"]'
      )
      .click();

    // Click on the first task in the list
    cy.get(".items li")
      .first()
      .click()
      .then(() => {
        // Click on the task details modal
        cy.get('[data-testid="modal-overlay"]')
          .find('div[data-testid="task-details-modal"]')
          .click();

        // Click on the task description placeholder to edit it
        cy.get(".task-overview-description-placeholder").click();

        // Type a new description for the task
        cy.get(
          'p[data-placeholder="Description"].is-empty.is-editor-empty'
        ).type("New description Four");

        // Click on the submit button to update the task
        cy.get('[data-testid="task-editor-submit-button"]').click();
      });

    console.log(cy.getTaskViaAPI());

    cy.wait(30000);

    cy.getTaskViaAPI().then((response) => {
      const allTasks = response.body; // This is the array of all tasks
      console.log("Your tasks: ", allTasks);
      const updatedTask = allTasks.find(
        (task) => task.description === "New description Four"
      );

      expect(updatedTask).to.exist;
    });

  });
});
