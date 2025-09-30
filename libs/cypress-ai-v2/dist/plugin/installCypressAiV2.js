"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.installCypressAiV2 = installCypressAiV2;
// libs/cypress-ai-v2/src/plugin/installCypressAiV2.ts
const CypressAiV2Plugin_1 = require("./CypressAiV2Plugin");
/**
 * Função simplificada para instalar o plugin Cypress AI v2.0
 *
 * Uso no cypress.config.ts:
 * ```typescript
 * import { installCypressAiV2 } from 'cypress-ai-v2';
 *
 * export default defineConfig({
 *   e2e: {
 *     setupNodeEvents(on, config) {
 *       return installCypressAiV2(on, config);
 *     }
 *   }
 * });
 * ```
 */
function installCypressAiV2(on, config) {
    const plugin = new CypressAiV2Plugin_1.CypressAiV2Plugin();
    return plugin.installPlugin(on, config);
}
// Exportação padrão para compatibilidade
exports.default = installCypressAiV2;
//# sourceMappingURL=installCypressAiV2.js.map