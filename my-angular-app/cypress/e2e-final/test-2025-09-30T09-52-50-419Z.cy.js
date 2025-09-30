describe('Modal - Dashboard', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4200/dashboard');
  });

  it('deve abrir e fechar o modal corretamente', () => {
    // Clica no botão "Abrir Modal"
    cy.contains('button', 'Abrir Modal').should('be.visible').click();

    // Verifica se o modal aparece com o título correto
    // Supondo que o modal tenha um título visível, por exemplo "Título do Modal"
    // Ajuste o texto conforme o título real do modal
    cy.get('body').then(($body) => {
      // Procura por um possível título genérico, ajuste se necessário
      if ($body.find('h2:visible, h3:visible, h4:visible').length > 0) {
        cy.get('h2:visible, h3:visible, h4:visible').first().should('be.visible');
      } else {
        // Se o modal não usa header, verifica se algum conteúdo esperado do modal aparece
        cy.contains('Fechar').should('be.visible');
      }
    });

    // Testa fechar o modal clicando no botão "Fechar"
    cy.contains('button', 'Fechar').should('be.visible').click();

    // Verifica se o modal desaparece
    // Espera que o botão "Fechar" não esteja mais visível
    cy.contains('button', 'Fechar').should('not.exist');
  });
});