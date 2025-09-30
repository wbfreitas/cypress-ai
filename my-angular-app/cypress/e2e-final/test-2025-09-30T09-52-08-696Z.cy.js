describe('Modal e Submodal - Exibição do botão "Ação Especial"', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4200/dashboard');
  });

  it('deve exibir o botão "Ação Especial" apenas após abrir Modal e Submodal', () => {
    // Garante que o botão "Ação Especial" NÃO existe inicialmente
    cy.get('body').find('button').contains('Ação Especial').should('not.exist');

    // Clica em "Abrir Modal"
    cy.contains('button', 'Abrir Modal').should('be.visible').click();

    // Aguarda o modal abrir e verifica o botão de submodal
    cy.contains('button', 'Abrir Submodal').should('be.visible');

    // "Ação Especial" ainda não deve aparecer somente com o modal aberto
    cy.get('body').find('button').contains('Ação Especial').should('not.exist');

    // Abre o submodal dentro do modal
    cy.contains('button', 'Abrir Submodal').click();

    // Aguarda o submodal abrir e verifica se "Ação Especial" está visível
    cy.contains('button', 'Ação Especial', { timeout: 4000 }).should('be.visible');
  });

  it('não deve exibir o botão "Ação Especial" se apenas o Modal for aberto', () => {
    // Clica em "Abrir Modal"
    cy.contains('button', 'Abrir Modal').should('be.visible').click();

    // Garante que "Ação Especial" NÃO está visível só com o Modal aberto
    cy.get('body').find('button').contains('Ação Especial').should('not.exist');
  });

  it('não deve exibir o botão "Ação Especial" se nenhum modal for aberto', () => {
    // Garante que "Ação Especial" NÃO existe com a tela inicial
    cy.get('body').find('button').contains('Ação Especial').should('not.exist');
  });
});