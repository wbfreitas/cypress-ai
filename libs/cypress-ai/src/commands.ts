// libs/cypress-ai/src/commands.ts
import { CommandRegistry } from './commands/CommandRegistry';

/**
 * Registra os comandos customizados do Cypress AI
 */
export function registerSupportCommands(): void {
  CommandRegistry.registerSupportCommands();
}

/**
 * Auto-registra os comandos se o Cypress estiver disponível
 */
export function autoRegisterCommands(): void {
  CommandRegistry.autoRegister();
}

export { CommandRegistry } from './commands/CommandRegistry';
export { CypressCommands } from './commands/CypressCommands';

