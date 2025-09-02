describe('Teste E2E', () => {
  it('deve preencher o email e a senha na tela de login, clicar no botão "Entrar" e verificar a mensagem "Bem-vindo"', () => {
    cy.visit('/');
    
    // Preenche o campo de email
    cy.get('[id="email"]').type('user@ex.com');
    
    // Preenche o campo de senha
    cy.get('[id="password"]').type('123456');
    
    // Clica no botão "Entrar"
    cy.contains('button', 'Entrar').click();
    
    // Verifica que aparece "Bem-vindo" no dashboard
    cy.contains('h2', 'Bem-vindo').should('be.visible');
  });
});