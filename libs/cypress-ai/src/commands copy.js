// /* eslint-disable @typescript-eslint/no-var-requires */
// const fs = require('fs');
// const path = require('path');
// const { callAgent } = require('./agent');

// /**
//  * Registra os comandos personalizados `cy.ai` e `cy.prompt` no Cypress.
//  * Deve ser chamado no arquivo de suporte do Cypress (geralmente cypress/support/commands.js).
//  */
// function registerAiCommands() {
//   // cy.ai: recebe uma string de instruções e gera/atualiza o teste final.
//   Cypress.Commands.add('ai', (instructions, options = {}) => {
//     const agentName = options.agent || 'ollama';
//     return cy.then(async () => {
//       // Caminho do spec atual (ex.: cypress/e2e-ai/login.cy.js)
//       const specPath = Cypress.spec.relative;
//       const finalPath = specPath.replace(path.join('e2e-ai'), path.join('e2e-final'));
//       const absoluteFinalPath = path.join(Cypress.config('projectRoot'), finalPath);
//       let existing = '';
//       if (fs.existsSync(absoluteFinalPath)) {
//         existing = fs.readFileSync(absoluteFinalPath, 'utf8');
//       }
//       const { code } = await callAgent({ instructions, existing, agentName });
//       fs.mkdirSync(path.dirname(absoluteFinalPath), { recursive: true });
//       fs.writeFileSync(absoluteFinalPath, code, 'utf8');
//     });
//   });

//   // cy.prompt: aceita uma lista de instruções (passos) e envia para a IA.
//   Cypress.Commands.add('prompt', (steps, options = {}) => {
//     const instructionText = Array.isArray(steps) ? steps.join('\n') : String(steps);
//     return cy.ai(instructionText, options);
//   });
// }

// module.exports = { registerAiCommands };