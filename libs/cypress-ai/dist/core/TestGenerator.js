"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestGenerator = void 0;
// libs/cypress-ai/src/core/TestGenerator.ts
const FileManager_1 = require("./FileManager");
const PromptBuilder_1 = require("./PromptBuilder");
const AgentFactory_1 = require("../agents/AgentFactory");
const CypressRunner_1 = require("../cypress/CypressRunner");
class TestGenerator {
    constructor() {
        this.fileManager = new FileManager_1.FileManager();
        this.promptBuilder = new PromptBuilder_1.PromptBuilder();
        this.cypressRunner = new CypressRunner_1.CypressRunner();
    }
    /**
     * Gera um teste baseado nas instruções fornecidas
     */
    async generateTest(options, config = {}) {
        const { instructions, html, specPath, agent = 'ollama', model } = options;
        // Resolve o caminho absoluto
        const absPath = this.fileManager.resolvePath(specPath);
        // Lê o teste existente se houver
        const existingTest = this.fileManager.readFileIfExists(absPath);
        // Cria o agente
        const finalModel = model || config.model || 'qwen2.5-coder:latest';
        const aiAgent = AgentFactory_1.AgentFactory.createAgent(agent, { ...config, model: finalModel });
        // Constrói o prompt
        const prompt = this.promptBuilder.buildPrompt(instructions, existingTest, html);
        // Gera o código usando a IA
        const generatedCode = await aiAgent.generateTest(prompt, model);
        // Limpa o código gerado
        const cleanCode = this.promptBuilder.cleanGeneratedCode(generatedCode);
        // Salva o arquivo
        this.fileManager.writeFile(absPath, cleanCode);
        return true;
    }
    /**
     * Executa um teste se ele existir
     */
    async runTestIfExists(options) {
        return this.cypressRunner.runTestIfExists(options);
    }
    /**
     * Verifica se os componentes necessários estão disponíveis
     */
    async checkDependencies() {
        const [cypress, agent] = await Promise.all([
            this.cypressRunner.isCypressAvailable(),
            this.checkAgentAvailability()
        ]);
        return { cypress, agent };
    }
    async checkAgentAvailability() {
        try {
            const agent = AgentFactory_1.AgentFactory.createAgent('ollama', {});
            return await agent.isAvailable();
        }
        catch {
            return false;
        }
    }
}
exports.TestGenerator = TestGenerator;
//# sourceMappingURL=TestGenerator.js.map