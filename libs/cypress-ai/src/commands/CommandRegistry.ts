// libs/cypress-ai/src/commands/CommandRegistry.ts
import { CypressCommands } from './CypressCommands';

// Declaração global para o Cypress
declare const Cypress: any;

export class CommandRegistry {
  /**
   * Registra todos os comandos customizados do Cypress
   */
  static registerSupportCommands(): void {
    // Comando 'ai' para geração de testes com IA
    Cypress.Commands.add('ai', CypressCommands.ai);

    // Comando 'prompt' para instruções de teste
    Cypress.Commands.add('prompt', CypressCommands.prompt);
  }

  /**
   * Verifica se os comandos já foram registrados
   */
  static areCommandsRegistered(): boolean {
    return typeof Cypress !== 'undefined' && 
           Cypress.Commands._commands && 
           'ai' in Cypress.Commands._commands;
  }

  /**
   * Registra comandos automaticamente se o Cypress estiver disponível
   */
  static autoRegister(): void {
    if (typeof Cypress !== 'undefined') {
      this.registerSupportCommands();
    }
  }
}
