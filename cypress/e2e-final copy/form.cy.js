describe('Formulário final gerado', () => {
  it('Preenche e envia o formulário', () => {
    cy.visit('/');
    // login
    cy.get('input#email').type('user@ex.com');
    cy.get('input#password').type('123456');
    cy.contains('button', 'Entrar').click();

    // navegar para formulário
    cy.contains('button', 'Ir para formulário').click();
    cy.get('input#name').type('João');
    cy.get('input#age').type('30');
    cy.get('textarea#description').type('Teste de formulário');
    cy.contains('button', 'Enviar').click();
    cy.contains('Formulário enviado com sucesso!').should('be.visible');
  });
});