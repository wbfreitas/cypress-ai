// libs/cypress-ai/src/agent.ts
import { CypressAiPlugin } from './plugin/CypressAiPlugin';
import { CypressAiConfig } from './types';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Carregar arquivo .env se existir
const envPath = path.join(process.cwd(), '.env');
try {
  dotenv.config({ path: envPath });
} catch (error) {
  // Ignorar erro se arquivo .env não existir
}

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
  // Usar variáveis de ambiente se disponíveis
  const envConfig: CypressAiConfig = {
    model: process.env['AI_OLLAMA_MODEL'] || defaults.model || 'qwen2.5-coder:latest',
    baseUrl: process.env['AI_OLLAMA_BASE_URL'] || defaults.baseUrl || 'http://localhost:11434',
    ...defaults
  };
  
  const plugin = new CypressAiPlugin(envConfig);
  return plugin.installPlugin(on, config);
}

export { CypressAiPlugin } from './plugin/CypressAiPlugin';
export { CypressAiConfig } from './types';
