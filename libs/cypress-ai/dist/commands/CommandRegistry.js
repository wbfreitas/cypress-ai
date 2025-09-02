"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandRegistry = void 0;
// libs/cypress-ai/src/commands/CommandRegistry.ts
const CypressCommands_1 = require("./CypressCommands");
class CommandRegistry {
    /**
     * Registra todos os comandos customizados do Cypress
     */
    static registerSupportCommands() {
        // Comando 'ai' para geração de testes com IA
        Cypress.Commands.add('ai', CypressCommands_1.CypressCommands.ai);
        // Comando 'prompt' para instruções de teste
        Cypress.Commands.add('prompt', CypressCommands_1.CypressCommands.prompt);
        // Comando 'runFinal' para executar teste final e perguntar sobre substituição
        Cypress.Commands.add('runFinal', CypressCommands_1.CypressCommands.runFinal);
    }
    /**
     * Verifica se os comandos já foram registrados
     */
    static areCommandsRegistered() {
        return typeof Cypress !== 'undefined' &&
            Cypress.Commands._commands &&
            'ai' in Cypress.Commands._commands;
    }
    /**
     * Registra comandos automaticamente se o Cypress estiver disponível
     */
    static autoRegister() {
        if (typeof Cypress !== 'undefined') {
            this.registerSupportCommands();
        }
    }
}
exports.CommandRegistry = CommandRegistry;
//# sourceMappingURL=CommandRegistry.js.map