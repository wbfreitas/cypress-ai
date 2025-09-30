// Teste da biblioteca Cypress AI v2.0
describe('Cypress AI v2.0 - Teste Simplificado', () => {
  beforeEach(() => {
    cy.visit('/dashboard');
  });

  it('deve testar o comando cy.ai() básico', () => {
    console.log('🤖 Testando Cypress AI v2.0...');
    
    // Comando único - captura contexto e gera teste automaticamente
    cy.ai('Teste o botão "Abrir Modal" e verifique se o modal aparece');
  });

  it('deve testar com instruções múltiplas', () => {
    console.log('🤖 Testando instruções múltiplas...');
    
    cy.ai([
      'Teste abrir o modal clicando no botão',
      'Verifique se o modal aparece com o título correto',
      'Teste fechar o modal clicando no botão Fechar',
      'Verifique se o modal desaparece'
    ]);
  });

  it('deve testar com caminho personalizado', () => {
    console.log('Testando importando outro teste...');
    
    cy.ai('Teste a funcionalidade do modal', { 
      specPath: 'cypress/e2e-final/modal-personalizado.cy.js'
    });
  });
});
