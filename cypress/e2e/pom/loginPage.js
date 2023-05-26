class LoginPage {
  navigate() {
    cy.visit("/auth/login");
    return this;
  }

  enterEmail(username) {
    const field = cy.get('[id^="element-"]').first();
    field.clear();
    field.type(username, { log: false });
    return this;
  }

  enterPassword(password) {
    const field = cy.get('[id^="element-"]').last();
    field.clear();
    field.type(password, { log: false });
    return this;
  }

  submit() {
    const button = cy.get('[data-gtm-id="start-email-login"]');
    button.click();
    return this;
  }
}

export default LoginPage;
