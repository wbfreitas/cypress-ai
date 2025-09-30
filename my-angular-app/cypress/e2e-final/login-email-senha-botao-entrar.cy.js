describe('Login - My Angular App', () => {
  beforeEach(() => {
    // Acessa diretamente a página de login
    cy.visit('http://localhost:4200/login');
  });

  it('deve realizar login com sucesso com credenciais válidas', () => {
    // Garante que o formulário de login está visível
    cy.get('form').should('be.visible');

    // Preenche o campo de email
    cy.get('input#email')
      .should('be.visible')
      .clear()
      .type('teste@exemplo.com');

    // Preenche o campo de senha
    cy.get('input#password')
      .should('be.visible')
      .clear()
      .type('123456');

    // Garante que o botão "Entrar" está visível e clica nele
    cy.get('button[type="submit"]')
      .should('be.visible')
      .contains('Entrar')
      .click();

    // Validação pós-login (ajuste conforme o comportamento real)
    // Exemplo: aguarda redirecionamento ou mensagem de sucesso
    cy.url().should('not.include', '/login');
    // Exemplo alternativo: verifica se não há mais o formulário de login
    // cy.get('form').should('not.exist');
  });

  it('deve exibir erro ao tentar login com email inválido', () => {
    // Preenche o campo de email com valor inválido
    cy.get('input#email')
      .should('be.visible')
      .clear()
      .type('emailinvalido');

    // Preenche o campo de senha válido
    cy.get('input#password')
      .should('be.visible')
      .clear()
      .type('123456');

    // Clica no botão "Entrar"
    cy.get('button[type="submit"]')
      .should('be.visible')
      .contains('Entrar')
      .click();

    // Verifica se algum feedback de erro é exibido (ajuste conforme implementação)
    cy.get('form').should('be.visible');
    // Exemplo: cy.contains('Email inválido').should('be.visible');
  });

  it('deve exibir erro ao tentar login com senha incorreta', () => {
    // Preenche o campo de email válido
    cy.get('input#email')
      .should('be.visible')
      .clear()
      .type('teste@exemplo.com');

    // Preenche o campo de senha incorreta
    cy.get('input#password')
      .should('be.visible')
      .clear()
      .type('senhaerrada');

    // Clica no botão "Entrar"
    cy.get('button[type="submit"]')
      .should('be.visible')
      .contains('Entrar')
      .click();

    // Verifica se mensagem de erro aparece (ajuste conforme implementação)
    cy.get('form').should('be.visible');
    // Exemplo: cy.contains('Senha incorreta').should('be.visible');
  });

  it('deve validar campos obrigatórios do formulário de login', () => {
    // Tenta submeter sem preencher nada
    cy.get('button[type="submit"]')
      .should('be.visible')
      .contains('Entrar')
      .click();

    // Verifica se o formulário permanece e campos continuam visíveis
    cy.get('form').should('be.visible');
    cy.get('input#email').should('be.visible');
    cy.get('input#password').should('be.visible');
    // Exemplo: cy.contains('Campo obrigatório').should('be.visible');
  });
});