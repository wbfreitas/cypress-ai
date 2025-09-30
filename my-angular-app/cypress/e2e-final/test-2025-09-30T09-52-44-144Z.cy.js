describe('Teste do botão Abrir Modal', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4200/dashboard');
  });

  it('deve exibir o modal ao clicar no botão "Abrir Modal"', () => {
    // Verifica que não existe nenhum modal visível antes de clicar
    // Tenta encontrar um elemento comum de modal (exemplo: dialog, [role="dialog"], .modal)
    // Como não temos o HTML do modal, fazemos um negative check amplo
    cy.get('body').then(($body) => {
      const hasDialog = $body.find('dialog:visible, [role="dialog"]:visible, .modal:visible').length > 0;
      expect(hasDialog).to.equal(false);
    });

    // Clica no botão "Abrir Modal"
    cy.contains('button', 'Abrir Modal').should('be.visible').click();

    // Aguarda o modal ficar visível
    // Tenta localizar por dialog, [role="dialog"] ou .modal
    cy.get('body').then(($body) => {
      if ($body.find('dialog').length) {
        cy.get('dialog').should('be.visible');
      } else if ($body.find('[role="dialog"]').length) {
        cy.get('[role="dialog"]').should('be.visible');
      } else if ($body.find('.modal').length) {
        cy.get('.modal').should('be.visible');
      } else {
        // Se nenhum padrão de modal for encontrado, falha explicitamente
        throw new Error('Nenhum elemento de modal padrão foi encontrado após clicar em "Abrir Modal".');
      }
    });
  });
});