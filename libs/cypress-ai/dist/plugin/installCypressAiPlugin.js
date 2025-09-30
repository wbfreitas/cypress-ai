"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.installCypressAiPlugin = installCypressAiPlugin;
// libs/cypress-ai/src/plugin/installCypressAiPlugin.ts
const CypressAiPlugin_1 = require("./CypressAiPlugin");
/**
 * Função simplificada para instalar o plugin Cypress AI
 * Uso: installCypressAiPlugin(on, config)
 */
function installCypressAiPlugin(on, config, options = {}) {
    const plugin = new CypressAiPlugin_1.CypressAiPlugin({
        agent: 'stackspot',
        model: 'qwen2.5-coder:latest',
        ...options
    });
    return plugin.installPlugin(on, config);
}
// Exportação padrão para compatibilidade
exports.default = installCypressAiPlugin;
//# sourceMappingURL=installCypressAiPlugin.js.map