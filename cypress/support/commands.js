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

Cypress.Commands.add("createProjectViaAPI", () => {
  const authToken = Cypress.env("authToken");
  return cy.fixture("createProject.json").then((project) => {
    const { name } = project;
    return cy
      .request({
        method: "POST",
        url: `${Cypress.env("apiBaseUrl")}/rest/v2/projects`,
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
        body: {
          name: project.name,
        },
      })
      .its("body")
      .then((response) => {
        expect(response).to.have.property("id");
        expect(response).to.have.property("name");
        return cy.wrap(response);
      });
  });
});

Cypress.Commands.add("loginViaUI", () => {
  cy.fixture("credentials.json").then((credentials) => {
    const { username, password } = credentials;
    cy.visit("/auth/login"); // Visit the login page

    // LoginPage.visit();

    // Enter the username
    cy.get('[id^="element-"]').first().clear(); // Clear the input field (if necessary)
    cy.get('[id^="element-"]').first().type(username); // Type the username into the input field

    // Enter the password
    cy.get('[id^="element-"]').last().type(password); // Type the password into the input field

    cy.get('[data-gtm-id="start-email-login"]').click(); // Click the login button
  });
});
