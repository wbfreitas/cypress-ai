describe('Teste E2E', () => {
  it('deve preencher o formulário de login com email "user@ex.com" e senha "123456" e clicar no botão "Entrar"', () => {
    cy.visit('/');
    
    cy.get('#email').type('user@ex.com');
    cy.get('#password').type('123456');
    cy.contains('button', 'Entrar').click();
  });
});