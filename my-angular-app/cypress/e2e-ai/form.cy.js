describe('Fluxo de Login', () => {
  it('Deve autenticar e abrir o dashboard', () => {
    cy.visit('/');
    // cy.prompt([
    //   'Na tela de login, digite o email "user@ex.com" e a senha "123456"',
    //   'Clique no botão "Entrar"',
    //   'Verifique que aparece "Bem‑vindo" no dashboard'
    // ]);

    // Dispara a geração do teste final:
    cy.ai('Na tela de login digite o email \"user@ex.com\" e a senha \"123456\"; clique em \"Entrar\"; verifique que aparece \"Bem‑vindo\" no dashboard');
  });
});




