describe("Authentication  via API", () => {
  it("should authenticate via API and generate access token", () => {
    // Step 0: Login via API and generate token
    cy.AuthViaAPI()

      // Smart check 1: Verify auth token exists
      .then(() => {
        expect(Cypress.env("authToken")).to.exist;

        // Smart check 2: Verify the token is not empty
        expect(Cypress.env("authToken")).to.not.be.empty;
        // Smart check 3: Verify the token length is within a certain range
        const tokenLength = Cypress.env("authToken").length;
        expect(tokenLength).to.be.within(20, 50);

        // Smart check 4: Verify the token format matches a specific pattern
        const tokenPattern = /^[a-zA-Z0-9]+$/; // pattern to match
        expect(Cypress.env("authToken")).to.match(tokenPattern);
      });
  });
});
