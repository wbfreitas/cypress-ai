// libs/cypress-ai-v2/src/index.ts

// Exportações principais
export { installCypressAiV2 } from './plugin/installCypressAiV2';
export { CypressCommands } from './commands/CypressCommands';

// Exportações para uso avançado
export { TestGenerator } from './core/TestGenerator';
export { StackSpotAgent } from './agents/StackSpotAgent';
export { CypressAiV2Plugin } from './plugin/CypressAiV2Plugin';

// Exportações dos tipos
export * from './types';

// Função de registro automático dos comandos
export function registerCommands(): void {
  // Esta função será chamada pelo arquivo de suporte do Cypress
  // O registro real acontece no arquivo de comandos
}
