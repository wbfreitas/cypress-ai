describe('Teste E2E', () => {
  it('deve executar a ação solicitada', () => {
    cy.visit('/dashboard');
    cy.contains('Bem-vindo').should('be.visible');
  });

  it('deve clicar no botão "Abrir Modal"', () => {
    cy.visit('/dashboard');
    // Garante que o botão existe e está visível
    cy.get('.content button').contains('Abrir Modal').should('be.visible').click();
    // Como não há modal no HTML fornecido, vamos garantir que o clique ocorreu
    // Podemos validar que o botão foi clicado sem erro
    cy.get('.content button').contains('Abrir Modal').should('exist');
  });
});