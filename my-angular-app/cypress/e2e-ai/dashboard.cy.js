// Teste complexo para demonstrar captura de HTML dinâmico
describe('Teste HTML Dinâmico Complexo', () => {
  beforeEach(() => {
    cy.visit('/dashboard');
  });

  it('deve testar dashboard', () => {
    cy.ai([
      '1) Abra o modal clicando no botão com o texto "abrir modal',
      '2) Verifique se o titulo do modal é "Título do Modal"',
      '3) Verifique se o conteudo do modal é "Conteúdo do modal. Clique fora ou no botão para fechar."',
      '4) CLique no botão com o texto "fechar modal"',
      '5) O conteudo do modal deve desaparecer'
    ]);
  });
});
