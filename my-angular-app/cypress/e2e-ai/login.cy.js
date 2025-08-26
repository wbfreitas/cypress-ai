describe('Fluxo de Login', () => {
  it('Deve autenticar e abrir o dashboard', () => {
    cy.visit('/');
    cy.ai(`
      Na tela de login, digite o email "user@ex.com" e a senha "123456",
      Clique no botão "Entrar",
      Verifique que aparece "Bem‑vindo" no dashboard`
    );
  });
});