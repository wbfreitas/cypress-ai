describe('Login final gerado', () => {
  it('Autentica e valida o dashboard', () => {
    cy.visit('/');
    cy.get('input#email').type('user@ex.com');
    cy.get('input#password').type('123456');
    cy.contains('button', 'Entrar').click();
    cy.contains('Bem-vindo').should('be.visible');
  });
});