describe('Teste E2E - Botão Inexistente', () => {
  beforeEach(() => {
    // Acessa a página do dashboard
    cy.visit('/dashboard');
  });

  it('deve falhar ao tentar encontrar o botão "Botão Inexistente"', () => {
    // Tenta localizar o botão inexistente
    // Este teste deve falhar para demonstrar a captura dinâmica do HTML
    cy.contains('button', 'Botão Inexistente').should('be.visible');
  });
});