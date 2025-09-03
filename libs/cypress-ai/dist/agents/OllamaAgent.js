"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OllamaAgent = void 0;
// libs/cypress-ai/src/agents/OllamaAgent.ts
const node_fetch_1 = __importDefault(require("node-fetch"));
class OllamaAgent {
    constructor(apiBase = 'http://127.0.0.1:11434', defaultModel = 'qwen2.5-coder:latest') {
        this.apiBase = apiBase;
        this.defaultModel = defaultModel;
    }
    /**
     * Gera código de teste usando o Ollama
     */
    async generateTest(prompt, model) {
        console.log('- OllamaAgent: Iniciando geração de teste');
        console.log('- Configuração Ollama:', {
            apiBase: this.apiBase,
            model: model || this.defaultModel
        });
        const resolvedModel = model || this.defaultModel;
        const request = {
            model: resolvedModel,
            prompt,
            stream: false
        };
        try {
            console.log('- OllamaAgent: Enviando requisição para:', `${this.apiBase}/api/generate`);
            const response = await (0, node_fetch_1.default)(`${this.apiBase}/api/generate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(request)
            });
            if (!response.ok) {
                const errorText = await response.text().catch(() => '');
                throw new Error(`Ollama retornou ${response.status}: ${errorText}`);
            }
            const data = await response.json();
            const code = (data?.response || '').trim();
            if (!code) {
                throw new Error('IA não retornou código de teste.');
            }
            console.log('- OllamaAgent: Teste gerado com sucesso');
            return code;
        }
        catch (error) {
            console.error('- OllamaAgent: Erro:', error);
            if (error instanceof Error) {
                throw error;
            }
            throw new Error(`Erro ao comunicar com Ollama: ${String(error)}`);
        }
    }
    /**
     * Verifica se o agente está disponível
     */
    async isAvailable() {
        try {
            const response = await (0, node_fetch_1.default)(`${this.apiBase}/api/tags`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            });
            return response.ok;
        }
        catch {
            return false;
        }
    }
}
exports.OllamaAgent = OllamaAgent;
//# sourceMappingURL=OllamaAgent.js.map