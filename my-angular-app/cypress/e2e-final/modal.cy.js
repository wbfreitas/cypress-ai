describe('Teste E2E', () => {
  it('deve efetuar login e realizar ações no modal', () => {
    cy.visit('/');

    // Efetua login
    cy.get('#email').type('user@ex.com');
    cy.get('#password').type('123456');
    cy.get('button[type="submit"]').click();

    // Clique no botão que tenha o texto "Abrir Modal"
    cy.contains('Abrir Modal').click();

    // Feche o modal clicando no botão com o texto "Fechar"
    cy.contains('Fechar').click();
  });
});