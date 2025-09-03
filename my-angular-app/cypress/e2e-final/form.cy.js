describe('Teste E2E', () => {
  it('deve preencher o email, senha e clicar em Entrar', () => {
    cy.visit('/');
    cy.get('[id="email"]').type('user@ex.com');
    cy.get('[id="password"]').type('123456');
    cy.contains('button', 'Entrar').click();
  });

  it('deve validar se a mensagem "Bem-vindo" está sendo exibida', () => {
    cy.visit('/');
    cy.get('.content h2').should('contain.text', 'Bem-vindo');
  });
});