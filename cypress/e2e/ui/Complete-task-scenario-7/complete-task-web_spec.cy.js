import CompleteWebPage from "../../pom/completeWebPage";
describe("Complete Task via Web Application", () => {
  beforeEach(() => {
    // Step 1: Authenticate or obtain the auth token
    cy.AuthViaAPI();

    // Step 2: Log into the web application through the user interface
    cy.loginViaUI();
  });

  it("should complete task via web application", () => {
    const projectName = "Software Engineering Project";
    const content = "Eat Food";
    cy.wait(Math.floor(Math.random() * (60000 - 30000 + 1)) + 30000);
    // Click on the "Add project" button
    const projectPage = new CompleteWebPage();

    projectPage.addProject(projectName);
    projectPage.wait(15000);
    projectPage.selectProject();
    projectPage.addTask(content);
    projectPage.selectFirstItemAndClickCheckbox();
    projectPage.log("Food");
    projectPage.wait(30000);
    console.log("Food");

    cy.wait(30000);

    // Step 4: Retrieve the task via API and perform assertions
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
