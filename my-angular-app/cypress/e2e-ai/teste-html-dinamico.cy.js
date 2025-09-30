// Teste para demonstrar captura de HTML dinâmico
describe('Teste HTML Dinâmico - Modal', () => {
  beforeEach(() => {
    cy.visit('/dashboard');
  });

  it('deve testar modal que só aparece após clique', () => {
    // Este teste vai falhar propositalmente para ativar o sistema de captura de HTML dinâmico
    cy.ai('Teste o modal que só aparece após clicar no botão "Abrir Modal". Verifique se o modal tem o título "Título do Modal" e se pode ser fechado clicando no botão "Fechar".');
  });
});
