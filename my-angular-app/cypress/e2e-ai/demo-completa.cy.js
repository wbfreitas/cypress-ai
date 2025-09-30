// Demo completa da biblioteca Cypress AI v2.0
// Este teste demonstra todas as funcionalidades da aplicação
describe('Demo Completa - Fluxo Completo da Aplicação', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  it('deve executar o fluxo completo: login → modal → formulário → validação', () => {
    console.log('🚀 Iniciando demo completa da biblioteca Cypress AI v2.0');
    
    // 1. FAZER LOGIN
    cy.ai('Faça login na aplicação preenchendo o campo email com "teste@exemplo.com" e senha com "123456", depois clique no botão "Entrar"');
    
    // 2. TESTAR MODAL
    cy.ai('Teste o modal: clique no botão "Abrir Modal", verifique se o título "Título do Modal" aparece, e feche clicando no botão "Fechar"');
    
    // 3. NAVEGAR PARA FORMULÁRIO
    cy.ai('Clique no botão "Ir para formulário" para navegar para a página de formulário');
    
    // 4. PREENCHER E ENVIAR FORMULÁRIO
    cy.ai('Preencha o formulário com nome "João Silva", email "joao@exemplo.com" e mensagem "Esta é uma mensagem de teste", depois clique no botão "Enviar"');
    
    // 5. VALIDAR SUCESSO
    cy.ai('Verifique se apareceu a mensagem "Formulário enviado com sucesso!" na tela');
    
    console.log('✅ Demo completa finalizada com sucesso!');
  });
});
