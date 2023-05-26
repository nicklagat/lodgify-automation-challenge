
class UpdateWebPage {
    constructor() {
        this.addButton = '[aria-label="Add project"][type="button"][aria-disabled="false"][tabindex="0"]';
        this.modalOverlay = '[data-testid="modal-overlay"]';
        this.projectNameField = 'input#edit_project_modal_field_name';
        this.submitButton = '[type="submit"][aria-disabled="false"][class^="_8313bd46"]';
        this.projectsList = '#projects_list li';
        this.plusAddButton = 'button.plus_add_button';
        this.taskName = 'p[data-placeholder="Task name"]';
        this.taskSubmitButton = 'button[data-testid="task-editor-submit-button"]';
        this.cancelButton = '[aria-label="Cancel"][type="button"][aria-disabled="false"][class^="_8313bd46"]';
        this.itemList = '.items li';
        this.taskDescriptionPlaceholder = '.task-overview-description-placeholder';
        this.taskDescriptionField = 'p[data-placeholder="Description"].is-empty.is-editor-empty';
    }

    addProject() {
        cy.get(this.addButton).click().then(() => {
            cy.get(this.modalOverlay).find(this.projectNameField).type("Software Engineering Project");
            cy.get(this.submitButton).click();
        });
    }

    selectProject() {
        cy.get(this.projectsList).each((listItem) => {
            cy.wrap(listItem).should("contain", "Software Engineering Project").click();
        });
    }

    addTask(content) {
        cy.get(this.plusAddButton).should("be.visible").click();
        cy.get(this.taskName).type(content);
        cy.get(this.taskSubmitButton).should("be.visible").click();
        cy.wait(4000);
        cy.get(this.cancelButton).click();
    }

    updateFirstTask(description) {
        cy.get(this.itemList).first().click().then(() => {
            cy.get(this.modalOverlay).find('[data-testid="task-details-modal"]').click();
            cy.get(this.taskDescriptionPlaceholder).click();
            cy.get(this.taskDescriptionField).type(description);
            cy.get(this.taskSubmitButton).click();
        });
    }

    wait(time) {
        cy.wait(time);
    }

    log(message) {
        console.log(message);
    }
}


export default UpdateWebPage
