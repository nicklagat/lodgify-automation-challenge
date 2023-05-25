class AuthService {
  // Function to perform the login via API
  loginViaAPI(authdetails) {
    // Destructure the properties from the authdetails object to have a concise way of accessing them
    const {
      email,
      password,
      pkce_oauth,
      web_session,
      permanent_login,
      device_id,
    } = authdetails;

    // POST request to the API for user login
    return cy
      .request("POST", "/API/v9.0/user/login", {
        email,
        password,
        pkce_oauth,
        web_session,
        permanent_login,
        device_id,
      })
      .its("body")
      .then((response) => {
        // Check if response is not undefined or null
        if (!response) {
          throw new Error("AuthViaAPI response is undefined or null");
        }

        // Verify that the response contains a 'token' property
        expect(response).to.have.property("token");

        // Check if token is not undefined, null or empty
        const { token } = response;
        if (!token) {
          throw new Error("Token is undefined, null or empty");
        }

        // Store the generated token in the local storage
        window.localStorage.setItem("authToken", token);

        // Store the token in the Cypress.env for access in other tests
        Cypress.env("authToken", token);

        // Check if token stored in localStorage and Cypress.env matches the token in response
        if (
          window.localStorage.getItem("authToken") !== token ||
          Cypress.env("authToken") !== token
        ) {
          throw new Error(
            "Stored tokens do not match the token returned in the response"
          );
        }

        return token;
      });
  }
}

export default AuthService;
