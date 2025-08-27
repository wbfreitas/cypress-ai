```javascript
describe('Teste E2E', () => {
  it('deve preencher o formulário de login e navegar para o dashboard', () => {
    cy.visit('/');

    cy.get('[formcontrolname="email"]').type('user@ex.com');
    cy.get('[formcontrolname="password"]').type('123456');
    cy.contains('button', 'Entrar').click();

    cy.contains('h1', 'Bem-vindo').should('be.visible');
  });
});
```