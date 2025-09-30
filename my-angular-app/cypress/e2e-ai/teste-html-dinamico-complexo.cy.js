// Teste complexo para demonstrar captura de HTML dinâmico
describe('Teste HTML Dinâmico Complexo', () => {
  beforeEach(() => {
    cy.visit('/dashboard');
  });

  it('deve testar um elemento que só aparece após múltiplas ações', () => {
    // Este teste vai falhar propositalmente para ativar o sistema de captura de HTML dinâmico
    cy.ai('Teste um elemento que só aparece após clicar em "Abrir Modal", depois clicar em "Abrir Submodal" dentro do modal, e então verificar se existe um botão "Ação Especial" que só aparece nesse contexto específico.');
  });
});
