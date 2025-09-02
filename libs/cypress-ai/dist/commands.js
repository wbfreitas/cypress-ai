"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CypressCommands = exports.CommandRegistry = void 0;
exports.registerSupportCommands = registerSupportCommands;
exports.autoRegisterCommands = autoRegisterCommands;
// libs/cypress-ai/src/commands.ts
const CommandRegistry_1 = require("./commands/CommandRegistry");
/**
 * Registra os comandos customizados do Cypress AI
 */
function registerSupportCommands() {
    CommandRegistry_1.CommandRegistry.registerSupportCommands();
}
/**
 * Auto-registra os comandos se o Cypress estiver disponível
 */
function autoRegisterCommands() {
    CommandRegistry_1.CommandRegistry.autoRegister();
}
var CommandRegistry_2 = require("./commands/CommandRegistry");
Object.defineProperty(exports, "CommandRegistry", { enumerable: true, get: function () { return CommandRegistry_2.CommandRegistry; } });
var CypressCommands_1 = require("./commands/CypressCommands");
Object.defineProperty(exports, "CypressCommands", { enumerable: true, get: function () { return CypressCommands_1.CypressCommands; } });
//# sourceMappingURL=commands.js.map