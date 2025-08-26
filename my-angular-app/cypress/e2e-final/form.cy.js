describe('Login Test', () => {
  it('should log in successfully and display welcome message', () => {
    // Mock API login
    cy.intercept('POST', '/api/login', (req) => {
      req.reply({
        statusCode: 200,
        body: { token: 'fake_token' }
      });
    });

    cy.visit('/login');

    // Use data-cy selector if available, otherwise use role attribute
    cy.get('[data-cy="email"]').type('user@ex.com');
    cy.get('[data-cy="password"]').type('123456');
    
    // Click on the login button using role attribute
    cy.get('[role="button"]').click();

    // Wait for any async operations to complete
    cy.wait('@intercept');

    // Verify that the welcome message is visible
    cy.contains('Bem-vindo').should('be.visible');

    // Additional assertions can be added here if needed
  });
});