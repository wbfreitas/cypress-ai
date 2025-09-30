describe('Modal e Submodal - Elemento Especial', () => {
  beforeEach(() => {
    cy.visit('/dashboard');
  });

  it('não deve exibir o Elemento Especial antes do fluxo', () => {
    // Garante que "Elemento Especial" não está visível na página inicialmente
    cy.contains('Elemento Especial').should('not.exist');
  });

  it('deve exibir o Elemento Especial apenas após o fluxo correto', () => {
    // Clica no botão "Abrir Modal"
    cy.contains('button', 'Abrir Modal').should('be.visible').click();

    // Aguarda o modal abrir (ajuste o seletor conforme sua implementação)
    cy.get('.modal:visible, [role="dialog"]:visible', { timeout: 5000 }).should('be.visible');

    // Busca pelo botão "Abrir Submodal" dentro do modal
    cy.get('.modal:visible, [role="dialog"]:visible').within(() => {
      cy.contains('button', 'Abrir Submodal', { timeout: 5000 }).should('be.visible').click();
    });

    // Aguarda o submodal abrir (ajuste o seletor conforme sua implementação)
    cy.get('.submodal:visible, [data-testid="submodal"]:visible', { timeout: 5000 }).should('be.visible');

    // Após abrir o submodal, verifica se "Elemento Especial" aparece dentro do submodal
    cy.get('.submodal:visible, [data-testid="submodal"]:visible').within(() => {
      cy.contains('Elemento Especial', { timeout: 5000 }).should('be.visible');
    });
  });

  it('não deve exibir o Elemento Especial apenas com o modal aberto', () => {
    // Abre apenas o modal
    cy.contains('button', 'Abrir Modal').should('be.visible').click();

    // Aguarda o modal abrir (ajuste o seletor conforme sua implementação)
    cy.get('.modal:visible, [role="dialog"]:visible', { timeout: 5000 }).should('be.visible');

    // Garante que "Elemento Especial" não aparece antes de abrir o submodal
    cy.contains('Elemento Especial').should('not.exist');
  });
});