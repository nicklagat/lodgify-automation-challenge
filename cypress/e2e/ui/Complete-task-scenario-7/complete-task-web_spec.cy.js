describe("Complete Task via Web Application", () => {
  beforeEach(() => {
    // Step 1: Get auth token
    cy.AuthViaAPI();

    //Step 2: Login via UI
    cy.loginViaUI();
  });

  it("should complete task via web application", () => {
    const projectName = "Software Engineering Project";
    const content = "Eat Food";

    // Step 3: Verify on web application that task is updated
    cy.wait(Math.floor(Math.random() * (60000 - 30000 + 1)) + 30000);
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

        cy.get("button")
          .filter('[type="submit"][aria-disabled="false"][class^="_8313bd46"]')
          .click();
      });

    console.log(projectName);
    cy.wait(15000);
    // cy.get("#projects_list").contains(`"${projectName}"`).click();
    cy.get("#projects_list li").each((listItem) => {
      cy.wrap(listItem)
        .should("contain", "Software Engineering Project")
        .click();
    });

    cy.get("button.plus_add_button").should("be.visible").click();

    // Type the task content
    cy.get('p[data-placeholder="Task name"]').type(content);

    cy.get('button[data-testid="task-editor-submit-button"]')
      .should("be.visible")
      .click();

    cy.wait(4000);
    cy.get("button")
      .filter(
        '[aria-label="Cancel"][type="button"][aria-disabled="false"][class^="_8313bd46"]'
      )
      .click();

    cy.get(".items li").first().click();
    cy.get("button.task_checkbox.priority_1").first().click({ force: true });

    cy.get('button[aria-label="Close modal"]').click();

    console.log("Food");

    cy.wait(30000);
    cy.getTaskViaAPI().then((response) => {
      const responseBody = response.body;
      const responseStatus = response.status;

      // Assert that the response body is an empty array
      expect(responseBody).to.deep.equal([]);

      // Assert that the response status is 200 (OK)
      expect(responseStatus).to.equal(200);
    });
  });
});
