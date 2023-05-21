// custom commands

Cypress.Commands.add("AuthViaAPI", () => {
  // Loading login credentials from the fixtures
  cy.fixture("loginDetails.json").then((authdetails) => {
    // Destructure the properties from the authdetails object to have concise way of accessing them
    const {
      email,
      password,
      pkce_oauth,
      web_session,
      permanent_login,
      device_id,
    } = authdetails;

    // POST request to the API for user login
    cy.request("POST", "/API/v9.0/user/login", {
      email,
      password,
      pkce_oauth,
      web_session,
      permanent_login,
      device_id,
    })
      .its("body")
      .then((response) => {
        // Verify that the response contains a 'token' property
        expect(response).to.have.property("token");
        
        // Store the generated token in the local storage
        window.localStorage.setItem("authToken", response.token);

        // Store the token in the Cypress.env for access in other tests
        const authToken = response.token;
        Cypress.env("authToken", authToken); // Store the token in Cypress.env
        // cy.log(authToken);
      });
  });
});
