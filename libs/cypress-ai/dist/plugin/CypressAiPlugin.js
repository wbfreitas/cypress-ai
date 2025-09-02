"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CypressAiPlugin = void 0;
// libs/cypress-ai/src/plugin/CypressAiPlugin.ts
const TestGenerator_1 = require("../core/TestGenerator");
class CypressAiPlugin {
    constructor(config = {}) {
        this.testGenerator = new TestGenerator_1.TestGenerator();
        this.config = config;
    }
    /**
     * Instala o plugin no Cypress
     */
    installPlugin(on, config) {
        const self = this;
        // Task para gerar testes
        on('task', {
            async 'cypress-ai:generate'(options) {
                return self.testGenerator.generateTest(options, self.config);
            },
            // Task para executar testes existentes
            async 'cypress-ai:run-if-exists'(options) {
                return self.testGenerator.runTestIfExists(options);
            },
            // Task para executar teste final e perguntar sobre substituição
            async 'cypress-ai:run-final-and-ask'(options) {
                return self.testGenerator.runFinalTestAndAsk(options);
            }
        });
        // Aplica valores padrão de specPattern e baseUrl se não definidos
        if (!config.specPattern) {
            config.specPattern = 'cypress/e2e-ai/**/*.cy.{js,ts}';
        }
        if (!config.baseUrl) {
            config.baseUrl = 'http://localhost:4200';
        }
        return config;
    }
    /**
     * Verifica se as dependências estão disponíveis
     */
    async checkDependencies() {
        return this.testGenerator.checkDependencies();
    }
    /**
     * Atualiza a configuração do plugin
     */
    updateConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
    }
}
exports.CypressAiPlugin = CypressAiPlugin;
//# sourceMappingURL=CypressAiPlugin.js.map