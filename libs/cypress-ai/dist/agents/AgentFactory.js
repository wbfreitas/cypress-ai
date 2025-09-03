"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgentFactory = void 0;
// libs/cypress-ai/src/agents/AgentFactory.ts
const OllamaAgent_1 = require("./OllamaAgent");
const StackSpotAgent_1 = require("./StackSpotAgent");
class AgentFactory {
    /**
     * Cria uma instância do agente baseado na configuração
     */
    static createAgent(agentType, config) {
        console.log('- AgentFactory: Criando agente do tipo:', agentType);
        switch (agentType) {
            case 'ollama':
                const apiBase = process.env['AI_OLLAMA_BASE_URL'] || config.apiBase || 'http://127.0.0.1:11434';
                const model = config.model || 'qwen2.5-coder:latest';
                console.log('- Criando OllamaAgent com:', { apiBase, model });
                return new OllamaAgent_1.OllamaAgent(apiBase, model);
            case 'stackspot':
                const stackSpotConfig = {
                    realm: process.env['STACKSPOT_REALM'] || '',
                    clientId: process.env['STACKSPOT_CLIENT_ID'] || '',
                    clientKey: process.env['STACKSPOT_CLIENT_KEY'] || '',
                    agentId: process.env['STACKSPOT_AGENT_ID'] || '',
                    baseUrl: process.env['STACKSPOT_BASE_URL'] || 'https://genai-inference-app.stackspot.com'
                };
                console.log('- Criando StackSpotAgent com:', {
                    realm: stackSpotConfig.realm,
                    clientId: stackSpotConfig.clientId,
                    agentId: stackSpotConfig.agentId,
                    baseUrl: stackSpotConfig.baseUrl
                });
                return new StackSpotAgent_1.StackSpotAgent(stackSpotConfig);
            default:
                throw new Error(`Agente '${agentType}' não implementado. Estenda AgentFactory para suportá-lo.`);
        }
    }
    /**
     * Lista os agentes disponíveis
     */
    static getAvailableAgents() {
        return ['ollama', 'stackspot'];
    }
}
exports.AgentFactory = AgentFactory;
//# sourceMappingURL=AgentFactory.js.map