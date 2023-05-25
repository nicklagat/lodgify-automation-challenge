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

  it("should fail to authenticate via API with incorrect credentials", () => {
    // Step 0: Login via API with incorrect credentials
    cy.request({
      method: "POST",
      url: `${Cypress.env("apiBaseUrl")}/auth/login`,
      headers: {
        "Content-Type": "application/json",
      },
      body: {
        email: "incorrect_email@test.com",
        password: "incorrect_password",
      },
      failOnStatusCode: false,
    }).then((response) => {
      // Smart check 1: Verify the response status is not 200
      expect(response.status).to.not.equal(200);

      // Smart check 2: Verify auth token does not exist
      expect(response.body.token).to.not.exist;
    });
  });
});
