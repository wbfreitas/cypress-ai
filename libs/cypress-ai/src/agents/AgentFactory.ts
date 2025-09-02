// libs/cypress-ai/src/agents/AgentFactory.ts
import { OllamaAgent } from './OllamaAgent';
import { CypressAiConfig } from '../types';

export interface IAgent {
  generateTest(prompt: string, model?: string): Promise<string>;
  isAvailable(): Promise<boolean>;
}

export class AgentFactory {
  /**
   * Cria uma instância do agente baseado na configuração
   */
  static createAgent(agentType: 'ollama', config: CypressAiConfig): IAgent {
    switch (agentType) {
      case 'ollama':
        const apiBase = process.env['AI_OLLAMA_BASE_URL'] || config.apiBase || 'http://127.0.0.1:11434';
        const model = config.model || 'qwen2.5-coder:latest';
        return new OllamaAgent(apiBase, model);
      
      default:
        throw new Error(`Agente '${agentType}' não implementado. Estenda AgentFactory para suportá-lo.`);
    }
  }

  /**
   * Lista os agentes disponíveis
   */
  static getAvailableAgents(): string[] {
    return ['ollama'];
  }
}
