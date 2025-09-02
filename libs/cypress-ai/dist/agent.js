"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CypressAiPlugin = void 0;
exports.installCypressAiPlugin = installCypressAiPlugin;
// libs/cypress-ai/src/agent.ts
const CypressAiPlugin_1 = require("./plugin/CypressAiPlugin");
/**
 * Instala o plugin Cypress AI
 * @param on - Eventos do Cypress
 * @param config - Configuração do Cypress
 * @param defaults - Configurações padrão para o plugin
 * @returns Configuração atualizada do Cypress
 */
function installCypressAiPlugin(on, config, defaults = {}) {
    const plugin = new CypressAiPlugin_1.CypressAiPlugin(defaults);
    return plugin.installPlugin(on, config);
}
var CypressAiPlugin_2 = require("./plugin/CypressAiPlugin");
Object.defineProperty(exports, "CypressAiPlugin", { enumerable: true, get: function () { return CypressAiPlugin_2.CypressAiPlugin; } });
//# sourceMappingURL=agent.js.map