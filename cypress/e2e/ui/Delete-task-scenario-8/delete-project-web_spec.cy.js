import DeleteWebPage from "../../pom/deleteWebPage";

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

    cy.wait(Math.floor(Math.random() * (60000 - 30000 + 1)) + 30000);

    const projectPage = new DeleteWebPage();l 
    projectPage
      .addProject(projectName)
      .selectProject(projectName)
      .deleteProject();
  });
});

