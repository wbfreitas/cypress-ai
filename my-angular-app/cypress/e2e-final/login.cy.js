describe('Login and Dashboard Test', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  it('should login with valid credentials and navigate to the dashboard', () => {
    cy.intercept('POST', '/api/login').as('loginRequest');

    cy.get('[data-testid="email"]').type('user@ex.com');
    cy.get('[data-testid="password"]').type('123456');
    cy.get('[data-testid="login-button"]').click();

    cy.wait('@loginRequest').then((xhr) => {
      expect(xhr.response.statusCode).to.eq(200);
    });

    cy.contains('Bem-vindo').should('be.visible');

    // Adicione múltiplas assertions para verificar outros elementos do dashboard
    cy.get('[data-testid="dashboard-header"]').should('contain.text', 'Dashboard');
    cy.get('.user-profile').should('exist');
  });
});