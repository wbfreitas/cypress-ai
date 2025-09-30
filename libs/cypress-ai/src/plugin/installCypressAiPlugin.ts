// libs/cypress-ai/src/plugin/installCypressAiPlugin.ts
import { CypressAiPlugin } from './CypressAiPlugin';

/**
 * Função simplificada para instalar o plugin Cypress AI
 * Uso: installCypressAiPlugin(on, config)
 */
export function installCypressAiPlugin(on: any, config: any, options: any = {}) {
  const plugin = new CypressAiPlugin({
    agent: 'stackspot',
    model: 'qwen2.5-coder:latest',
    ...options
  });
  
  return plugin.installPlugin(on, config);
}

// Exportação padrão para compatibilidade
export default installCypressAiPlugin;
