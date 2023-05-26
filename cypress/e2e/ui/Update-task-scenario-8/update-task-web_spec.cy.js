import UpdateWebPage from "../../pom/updateWebPage";
import DeleteWebPage from "../../pom/deleteWebPage";
describe("Update Task via Web Application", () => {
  beforeEach(() => {
    // Step 1: Get auth token
    cy.AuthViaAPI();

    // Step 2: Login into the web application through the user interface
    cy.loginViaUI();
  });

  it("should update the task via the web application/ui", () => {
    const projectName = "Software Engineering Project";

    // Step 3: Verify on the web application that the task is updated
    cy.wait(Math.floor(Math.random() * (60000 - 30000 + 1)) + 30000);

    const projectPage = new UpdateWebPage();

    projectPage.addProject();
    projectPage.wait(15000);
    projectPage.selectProject();
    projectPage.addTask("Content here");
    projectPage.updateFirstTask("New description Four");
    projectPage.log("Food");
    projectPage.wait(30000);

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
