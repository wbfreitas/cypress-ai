describe('Teste do Modal', () => {
  // Sempre começa na página correta
  beforeEach(() => {
    cy.visit('/dashboard');
  });

  it('deve abrir e fechar o modal corretamente', () => {
    // 1) Abre o modal
    cy.contains('button', 'Abrir Modal').click();

    // 2) Verifica se o título do modal está visível
    cy.get('.modal').should('be.visible').within(() => {
      cy.contains('h3', 'Título do Modal').should('be.visible');
    });

    // 3) Verifica o conteúdo do modal
    cy.get('.modal').within(() => {
      cy.contains('p', 'Conteúdo do modal. Clique fora ou no botão para fechar.').should('be.visible');
    });

    // 4) Clica no botão de fechar modal
    cy.get('.modal').within(() => {
      cy.contains('button', 'Fechar').click();
    });

    // 5) O conteúdo do modal deve desaparecer
    cy.get('.modal').should('not.exist');
  });
});