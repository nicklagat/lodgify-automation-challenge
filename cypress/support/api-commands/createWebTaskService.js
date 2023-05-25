// TaskService.js
class CreateWebTaskService {
  createTaskViaWeb(projectId) {
    return cy.fixture("webAppTasks.json").then((webTasks) => {
      const { content } = webTasks;

      const TIMEOUT = 70000; // Adjust this value as needed
      cy.get(".plus_add_button", { timeout: TIMEOUT })
        .should("be.visible")
        .click();

      cy.get("#projects_list");
      if (projectId) {
        cy.get(`li[data-type="project_list_item"][data-id="${projectId}"]`, {
          timeout: 10000,
        }).click();
      } else {
        throw new Error("Project ID is undefined");
      }

      cy.get("button.plus_add_button").should("be.visible").click();

      cy.get('p[data-placeholder="Task name"]').type(content);

      cy.get('button[data-testid="task-editor-submit-button"]')
        .should("be.visible")
        .click();
    });
  }
}

export default CreateWebTaskService;
