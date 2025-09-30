// libs/cypress-ai-v2/src/plugin/installCypressAiV2.ts
import { CypressAiV2Plugin } from './CypressAiV2Plugin';

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
export function installCypressAiV2(on: any, config: any): any {
  const plugin = new CypressAiV2Plugin();
  return plugin.installPlugin(on, config);
}

// Exportação padrão para compatibilidade
export default installCypressAiV2;
