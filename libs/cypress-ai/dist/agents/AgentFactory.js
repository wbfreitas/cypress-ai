"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgentFactory = void 0;
// libs/cypress-ai/src/agents/AgentFactory.ts
const OllamaAgent_1 = require("./OllamaAgent");
class AgentFactory {
    /**
     * Cria uma instância do agente baseado na configuração
     */
    static createAgent(agentType, config) {
        switch (agentType) {
            case 'ollama':
                const apiBase = process.env['AI_OLLAMA_BASE_URL'] || config.apiBase || 'http://127.0.0.1:11434';
                const model = config.model || 'qwen2.5-coder:latest';
                return new OllamaAgent_1.OllamaAgent(apiBase, model);
            default:
                throw new Error(`Agente '${agentType}' não implementado. Estenda AgentFactory para suportá-lo.`);
        }
    }
    /**
     * Lista os agentes disponíveis
     */
    static getAvailableAgents() {
        return ['ollama'];
    }
}
exports.AgentFactory = AgentFactory;
//# sourceMappingURL=AgentFactory.js.map