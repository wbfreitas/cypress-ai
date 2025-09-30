import '@testing-library/cypress/add-commands'
import { CypressCommands } from 'cypress-ai-v2/dist/commands'

// Registra comandos do Cypress AI v2.0
Cypress.Commands.add('ai', CypressCommands.ai)

// Comandos personalizados podem ser adicionados aqui
declare global {
  namespace Cypress {
    interface Chainable {
      ai(instructions: string | string[], options?: any): Chainable<any>
    }
  }
}
