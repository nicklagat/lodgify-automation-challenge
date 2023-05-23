describe("Complete Task Via API", () => {
    beforeEach(() => {
      // Authenticate or obtain the auth token
      cy.AuthViaAPI();
    });
  
    it("should complete task via API", () => {
      cy.completeTaskViaAPI();
    });
  });