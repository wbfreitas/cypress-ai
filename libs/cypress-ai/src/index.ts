// libs/cypress-ai/src/index.ts
export { registerSupportCommands, autoRegisterCommands } from './commands';
export { installCypressAiPlugin } from './agent';

// Exportações das classes principais para uso avançado
export { TestGenerator } from './core/TestGenerator';
export { FileManager } from './core/FileManager';
export { PromptBuilder } from './core/PromptBuilder';
export { CypressAiPlugin } from './plugin/CypressAiPlugin';
export { CommandRegistry } from './commands/CommandRegistry';
export { CypressCommands } from './commands/CypressCommands';
export { AgentFactory, IAgent } from './agents/AgentFactory';
export { OllamaAgent } from './agents/OllamaAgent';
export { CypressRunner } from './cypress/CypressRunner';

// Exportações dos tipos
export * from './types';

