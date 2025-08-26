describe('Formulário', () => {
  it('Deve abrir o formulário, preencher campos e submeter', () => {
    cy.visit('/');
    cy.prompt([
      'Digite o email "user@ex.com" e a senha "123456" e clique em "Entrar"',
      'No dashboard, clique no botão "Ir para formulário"',
      'No formulário, preencha o campo "Nome" com "João", "Idade" com "30" e "Descrição" com "Teste de formulário"',
      'Clique no botão "Enviar"',
      'Aguarde a mensagem "Formulário enviado com sucesso!"'
    ]);
  });
});