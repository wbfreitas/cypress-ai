import { CypressAiConfig } from '../types';
export interface IAgent {
    generateTest(prompt: string, model?: string): Promise<string>;
    isAvailable(): Promise<boolean>;
}
export declare class AgentFactory {
    /**
     * Cria uma instância do agente baseado na configuração
     */
    static createAgent(agentType: 'ollama' | 'stackspot', config: CypressAiConfig): IAgent;
    /**
     * Lista os agentes disponíveis
     */
    static getAvailableAgents(): string[];
}
//# sourceMappingURL=AgentFactory.d.ts.map