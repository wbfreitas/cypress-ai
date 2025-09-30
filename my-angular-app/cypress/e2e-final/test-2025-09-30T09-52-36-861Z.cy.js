describe('Modal - Teste de abertura e fechamento', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4200/dashboard');
  });

  it('deve abrir o modal ao clicar em "Abrir Modal", exibir o título correto e fechar ao clicar em "Fechar"', () => {
    // Verifica que o modal NÃO está presente antes de abrir
    cy.contains('Título do Modal').should('not.exist');

    // Clica no botão "Abrir Modal"
    cy.contains('button', 'Abrir Modal').should('be.visible').click();

    // Garante que o modal é exibido com o título correto
    cy.contains('Título do Modal').should('be.visible');

    // Verifica se existe o botão "Fechar" visível no modal
    cy.contains('button', 'Fechar').should('be.visible').click();

    // Garante que o modal foi fechado e o título não está mais presente
    cy.contains('Título do Modal').should('not.exist');
  });
});