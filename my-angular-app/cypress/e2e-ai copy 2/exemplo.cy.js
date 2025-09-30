// Exemplo de uso do Cypress AI v2.0
describe('Exemplo de Teste', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('deve gerar teste automaticamente', () => {
    // Comando único - captura contexto e gera teste
    cy.ai('Teste o botão de login');
  });

  it('deve gerar teste com instruções múltiplas', () => {
    cy.ai([
      'Teste fazer login',
      'Verifique se foi redirecionado',
      'Teste fazer logout'
    ]);
  });

  it('deve gerar teste com caminho personalizado', () => {
    cy.ai('Teste o formulário', { 
      specPath: 'cypress/e2e-final/formulario-teste.cy.js' 
    });
  });
});
