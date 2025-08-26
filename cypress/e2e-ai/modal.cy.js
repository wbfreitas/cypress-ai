describe('Interação com modal e sidebar', () => {
  it('Deve abrir e fechar o modal e alternar a sidebar', () => {
    cy.visit('/');
    cy.prompt([
      'Efetue login com email "user@ex.com" e senha "123456"',
      'No dashboard, clique no botão "☰" para ocultar a sidebar',
      'Clique novamente no botão do menu para exibir a sidebar',
      'Clique no botão "Abrir Modal"',
      'Feche o modal clicando no botão "Fechar"'
    ]);
  });
});