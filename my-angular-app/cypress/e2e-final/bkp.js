describe('Teste E2E', () => {
  it('deve preencher o email, senha e clicar em Entrar', () => {
    cy.visit('/');
    cy.get('[id="email"]').type('user@ex.com');
    cy.get('[id="password"]').type('123456');
    cy.contains('button', 'Entrar').click();
  });

  it('deve abrir o modal ao clicar no botão "Abrir Modal"', () => {
    cy.visit('/');
    cy.contains('button', 'Abrir Modal').click();
    cy.get('.modal').should('be.visible');
  });
});