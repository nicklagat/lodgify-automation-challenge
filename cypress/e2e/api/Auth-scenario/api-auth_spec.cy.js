describe("Authentication via API", () => {
  it("should authenticate via API and generate access token", () => {
    // Step 1: Login via API and generate a token using valid credentials
    cy.AuthViaAPI()

      .then(() => {
        // Step 2: Verify that the authToken exists in the Cypress environment variables
        expect(Cypress.env("authToken")).to.exist;

        // Step 3: Verify that the authToken is not empty
        expect(Cypress.env("authToken")).to.not.be.empty;

        // Step 4: Verify that the length of the authToken falls within the expected range
        const tokenLength = Cypress.env("authToken").length;
        expect(tokenLength).to.be.within(20, 50);

        // Step 5: Verify that the authToken matches the expected pattern (only contains alphanumeric characters)
        const tokenPattern = /^[a-zA-Z0-9]+$/; // pattern to match
        expect(Cypress.env("authToken")).to.match(tokenPattern);
      });
  });

  it("should fail to authenticate via API with incorrect credentials", () => {
    // Step 1: Attempt to login via API using incorrect credentials
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
      failOnStatusCode: false, // allow the request to fail without throwing an error
    }).then((response) => {
      // Step 2: Verify that the response status code is not 200 (indicating an unsuccessful authentication attempt)
      expect(response.status).to.not.equal(200);

      // Step 3: Verify that the response body does not contain a token (as the authentication attempt was unsuccessful)
      expect(response.body.token).to.not.exist;
    });
  });
});
