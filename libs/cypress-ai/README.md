# Cypress‑AI

Esta biblioteca adiciona comandos personalizados ao **Cypress** permitindo que você escreva testes end‑to‑end usando instruções em linguagem natural (por exemplo, português). Um agente de IA generativa interpreta essas instruções, gera ou atualiza o código Cypress correspondente e o grava em arquivos de testes finais. Assim, você ganha produtividade criando a base dos testes e mantém a possibilidade de ajustar manualmente o resultado.

## Instalação

Dentro do seu projeto Angular/Cypress, execute:

```bash
npm install ./libs/cypress-ai
```

Em seguida, registre os comandos no Cypress. No arquivo `cypress/support/commands.js` (ou `commands.ts`), adicione:

```javascript
const { registerAiCommands } = require('cypress-ai');
registerAiCommands();
```

Pronto! Agora você tem à disposição os comandos `cy.ai()` e `cy.prompt()`.

## Comandos disponíveis

### cy.ai(instructions: string, options?: { agent?: string })

Recebe um texto em linguagem natural descrevendo os passos desejados do teste. Chama o agente configurado (Ollama por padrão) e grava o arquivo de teste gerado em `cypress/e2e-final/<nome-do-spec>.cy.js`. Se um teste já existir, ele é passado como contexto para que a IA evolua o código mantendo o que já foi escrito.

**Exemplo:**

```javascript
describe('Login com IA', () => {
  it('deve autenticar e validar o dashboard', () => {
    cy.visit('/');
    cy.ai('Clique em "Entrar", digite email "user@ex.com" e senha "123456", clique em "Continuar" e verifique que aparece "Bem‑vindo"');
  });
});
```

### cy.prompt(steps: string[] | string, options?: { agent?: string })

Variante do `cy.ai()` que aceita uma lista de passos (array de strings) em vez de um texto contínuo. Útil para escrever sequências claras de ações.

**Exemplo:**

```javascript
cy.prompt([
  'Clique em "Entrar"',
  'Digite email "user@ex.com" e senha "123456"',
  'Clique em "Continuar"',
  'Verifique que aparece "Bem‑vindo"'
]);
```

## Sobrescrever o agente

O comportamento do comando é controlado pela função `callAgent()` definida em `src/agent.js`. Por padrão, ele utiliza o [Ollama](https://github.com/ollama/ollama) e espera um endpoint exposto em `/api/v1/chat/completions` (conforme configurado no proxy Angular). Se você quiser usar outro serviço (OpenAI, Azure, etc.), basta editar `callAgent()` para enviar as instruções para o serviço desejado. Também é possível passar `{ agent: 'meu-modelo' }` como opção de `cy.ai()` para alterar o nome do modelo enviado.

## Execução dos testes

Crie duas pastas na raiz `cypress/e2e-ai` e `cypress/e2e-final`. Os arquivos em `e2e-ai` utilizam os comandos de IA, enquanto `e2e-final` contém o resultado gerado. Recomendamos dois scripts no seu `package.json`:

```json
{
  "scripts": {
    "cy:ai": "cypress run --spec cypress/e2e-ai/**/*",
    "cy:run": "cypress run --spec cypress/e2e-final/**/*"
  }
}
```

Assim você separa a fase de geração (lenta) da execução normal de pipeline (rápida).

## Exemplo de fluxo de desenvolvimento

1. Escreva um novo arquivo em `cypress/e2e-ai`, por exemplo `login.cy.js`, e utilize `cy.ai()` ou `cy.prompt()` com instruções em português.
2. Execute `npm run cy:ai`. A IA receberá as instruções e gerará ou atualizará o arquivo correspondente em `cypress/e2e-final/login.cy.js`.
3. Revise o código gerado em `e2e-final`, ajuste conforme necessário e rode `npm run cy:run` para garantir que o teste está passando.
4. Comite apenas os arquivos em `e2e-final`. Os arquivos em `e2e-ai` funcionam como base textual e não precisam ser executados no pipeline.

## Observações

* Para evitar problemas de CORS ao chamar o agente de IA a partir da aplicação Angular, utilizamos um **proxy** configurado em `my-angular-app/proxy.conf.json`, apontando `/api` para a porta local do Ollama (por padrão 11434). Ajuste conforme necessário.
* Para uso corporativo, considere adicionar autenticação, cache de respostas e tratamento de erros no agente.