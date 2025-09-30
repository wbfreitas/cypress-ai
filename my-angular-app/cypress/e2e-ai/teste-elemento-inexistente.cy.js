// Teste que vai falhar para demonstrar captura de HTML dinâmico
describe('Teste Elemento Inexistente', () => {
  beforeEach(() => {
    cy.visit('/dashboard');
  });

  it('deve testar elemento que não existe na aplicação', () => {
    // Este teste vai falhar propositalmente para ativar o sistema de captura de HTML dinâmico
    cy.ai('Teste um botão chamado "Botão Inexistente" que não existe na aplicação. Este teste deve falhar para demonstrar o sistema de captura de HTML dinâmico.');
  });
});
