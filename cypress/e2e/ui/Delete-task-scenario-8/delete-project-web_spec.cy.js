describe("Delete Project via Web Application", () => {
  beforeEach(() => {
    // Step 1: Get auth token
    cy.AuthViaAPI();

    //Step 2: Login via UI
    cy.loginViaUI();
  });

  it("should delete project via web application", () => {
    const projectName = "Pilot Project";
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
          .type(projectName);

        cy.get("button")
          .filter('[type="submit"][aria-disabled="false"][class^="_8313bd46"]')
          .click();
      });

    cy.wait(15000);
    cy.get("#projects_list li").contains(projectName).click();
    cy.get(
      'button[aria-label="More project actions"][aria-expanded="false"]'
    ).click();

    cy.contains("div.icon_menu_item__content", "Delete project").click();

    cy.get('[data-testid="modal-overlay"]');
    cy.get("[data-dialog]")
      .find('button[data-autofocus="true"][type="submit"]')
      .click();
  });
});
