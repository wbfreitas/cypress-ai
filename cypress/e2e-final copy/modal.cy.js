describe('Modal e Sidebar final gerado', () => {
  it('Alterna sidebar e modal', () => {
    cy.visit('/');
    // login
    cy.get('input#email').type('user@ex.com');
    cy.get('input#password').type('123456');
    cy.contains('button', 'Entrar').click();

    // fechar sidebar
    cy.get('.header button').first().click();
    // abrir sidebar
    cy.get('.header button').first().click();

    // abrir modal
    cy.contains('button', 'Abrir Modal').click();
    // fechar modal
    cy.contains('.modal-content button', 'Fechar').click();
  });
});