describe('Teste E2E', () => {
  it('deve preencher o email e senha e clicar no botão "Entrar"', () => {
    cy.visit('/');
    
    cy.get('[id="email"]').type('user@ex.com');
    cy.get('[id="password"]').type('123456');
    
    cy.get('[type="submit"]').click();
  });

  it('deve verificar se aparece "Bem-vindo" no dashboard', () => {
    cy.visit('/');
    
    cy.get('[id="email"]').type('user@ex.com');
    cy.get('[id="password"]').type('123456');
    
    cy.get('[type="submit"]').click();
    
    cy.contains('Bem-vindo').should('be.visible');
  });

  it('deve clicar no botão "Abrir Modal" e verificar se o modal aparece', () => {
    cy.visit('/');
    
    cy.get('[id="email"]').type('user@ex.com');
    cy.get('[id="password"]').type('123456');
    
    cy.get('[type="submit"]').click();
    
    cy.contains('Abrir Modal').click();
    
    cy.get('.modal').should('be.visible');
    cy.prompt([
      'click no botão "Fechar" do modal',
    ])
    cy.runFinal();
  });
});