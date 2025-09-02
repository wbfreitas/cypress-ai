// libs/cypress-ai/src/agent.ts
import { CypressAiPlugin } from './plugin/CypressAiPlugin';
import { CypressAiConfig } from './types';

/**
 * Instala o plugin Cypress AI
 * @param on - Eventos do Cypress
 * @param config - Configuração do Cypress
 * @param defaults - Configurações padrão para o plugin
 * @returns Configuração atualizada do Cypress
 */
export function installCypressAiPlugin(
  on: any, 
  config: any, 
  defaults: CypressAiConfig = {}
): any {
  const plugin = new CypressAiPlugin(defaults);
  return plugin.installPlugin(on, config);
}

export { CypressAiPlugin } from './plugin/CypressAiPlugin';
export { CypressAiConfig } from './types';
