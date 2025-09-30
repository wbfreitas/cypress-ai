// Teste para ativar o sistema de captura de HTML dinâmico
describe('Teste Ativar Captura HTML', () => {
  beforeEach(() => {
    cy.visit('/dashboard');
  });

  it('deve testar elemento que precisa de ação para aparecer', () => {
    // Este teste vai gerar um código que falha na validação para ativar o sistema de captura
    cy.ai('Teste um elemento que só aparece após clicar no botão "Abrir Modal" e depois clicar em "Abrir Submodal" dentro do modal. O elemento deve ter o texto "Elemento Especial" e só aparece nesse contexto específico.');
  });
});
