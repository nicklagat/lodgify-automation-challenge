class DeleteWebPage {
  addProject(projectName) {
    cy.get("button")
      .filter(
        '[aria-label="Add project"][type="button"][aria-disabled="false"][tabindex="0"]',
        { timeout: 90000 }
      )
      .click()
      .then(() => {
        cy.get('[data-testid="modal-overlay"]')
          .find("input#edit_project_modal_field_name")
          .type(projectName);
        cy.get("button")
          .filter('[type="submit"][aria-disabled="false"][class^="_8313bd46"]')
          .click();
      });
    cy.wait(15000);
    return this;
  }

  selectProject(projectName) {
    cy.get("#projects_list li").contains(projectName).click();
    cy.get('button[aria-label="More project actions"][aria-expanded="false"]')
      .last()
      .click();
    return this;
  }

  deleteProject() {
    cy.contains("div.icon_menu_item__content", "Delete project").click({
      force: true,
    });

    cy.get('[data-testid="modal-overlay"]');
    cy.get("[data-dialog]")
      .find('button[data-autofocus="true"][type="submit"]')
      .click();
    return this;
  }
}

export default DeleteWebPage;
