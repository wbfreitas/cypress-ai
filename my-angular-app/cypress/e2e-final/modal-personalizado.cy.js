describe('Funcionalidade do Modal', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4200/dashboard');
  });

  it('deve abrir e fechar o modal corretamente', () => {
    // Garante que o botão "Abrir Modal" está visível
    cy.contains('button', 'Abrir Modal').should('be.visible');

    // Garante que o modal NÃO está visível antes de abrir
    // Supondo que o modal tenha um texto único, por exemplo, "Título do Modal" ou botão "Fechar"
    // Adapte os seletores abaixo conforme a implementação do modal em sua aplicação
    cy.get('body').then(($body) => {
      // Teste negativo: modal não existe antes de abrir
      if ($body.find('.modal, [role="dialog"], .cdk-overlay-pane').length) {
        cy.get('.modal, [role="dialog"], .cdk-overlay-pane').should('not.be.visible');
      }
    });

    // Clica para abrir o modal
    cy.contains('button', 'Abrir Modal').click();

    // Aguarda o modal aparecer (tentando seletores comuns)
    cy.get('body').then(($body) => {
      if ($body.find('.modal').length) {
        cy.get('.modal').should('be.visible');
      } else if ($body.find('[role="dialog"]').length) {
        cy.get('[role="dialog"]').should('be.visible');
      } else if ($body.find('.cdk-overlay-pane').length) {
        cy.get('.cdk-overlay-pane').should('be.visible');
      } else {
        // Caso não encontre nenhum seletor comum, tenta pelo texto do modal
        cy.contains('Fechar').should('be.visible');
      }
    });

    // Testa fechar o modal pelo botão "Fechar" caso exista
    cy.get('body').then(($body) => {
      if ($body.find('button').filter((i, el) => Cypress.$(el).text().trim() === 'Fechar').length) {
        cy.contains('button', 'Fechar').click();
      } else {
        // Caso não exista botão "Fechar", tenta fechar clicando fora do modal (overlay)
        if ($body.find('.cdk-overlay-backdrop').length) {
          cy.get('.cdk-overlay-backdrop').click({ force: true });
        }
      }
    });

    // Verifica que o modal não está mais visível
    cy.get('body').then(($body) => {
      if ($body.find('.modal').length) {
        cy.get('.modal').should('not.exist');
      } else if ($body.find('[role="dialog"]').length) {
        cy.get('[role="dialog"]').should('not.exist');
      } else if ($body.find('.cdk-overlay-pane').length) {
        cy.get('.cdk-overlay-pane').should('not.exist');
      }
    });
  });

  it('não deve abrir o modal ao clicar em outros botões', () => {
    // Clica no botão "Ir para formulário"
    cy.contains('button', 'Ir para formulário').should('be.visible').click();

    // Verifica que o modal não está visível
    cy.get('body').then(($body) => {
      if ($body.find('.modal').length) {
        cy.get('.modal').should('not.exist');
      } else if ($body.find('[role="dialog"]').length) {
        cy.get('[role="dialog"]').should('not.exist');
      } else if ($body.find('.cdk-overlay-pane').length) {
        cy.get('.cdk-overlay-pane').should('not.exist');
      }
    });
  });
});