"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.CypressAiV2Plugin = void 0;
// libs/cypress-ai-v2/src/plugin/CypressAiV2Plugin.ts
const TestGenerator_1 = require("../core/TestGenerator");
const dotenv = __importStar(require("dotenv"));
const path = __importStar(require("path"));
// Carrega variáveis de ambiente
const envPath = path.join(process.cwd(), '.env');
try {
    dotenv.config({ path: envPath });
}
catch (error) {
    // Ignora erro se arquivo .env não existir
}
class CypressAiV2Plugin {
    constructor() {
        this.config = this.loadConfig();
        this.testGenerator = new TestGenerator_1.TestGenerator(this.config);
    }
    /**
     * Carrega configuração do plugin
     */
    loadConfig() {
        return {
            agent: 'stackspot',
            model: process.env['CYPRESS_AI_MODEL'] || 'qwen2.5-coder:latest',
            baseUrl: process.env['CYPRESS_AI_BASE_URL'] || 'https://genai-inference-app.stackspot.com',
            stackspotRealm: process.env['STACKSPOT_REALM'] || 'stackspot-freemium',
            stackspotClientId: process.env['STACKSPOT_CLIENT_ID'] || '',
            stackspotAgentId: process.env['STACKSPOT_AGENT_ID'] || '',
            stackspotClientKey: process.env['STACKSPOT_CLIENT_KEY'] || '',
            maxRetries: parseInt(process.env['CYPRESS_AI_MAX_RETRIES'] || '3'),
            timeout: parseInt(process.env['CYPRESS_AI_TIMEOUT'] || '120000')
        };
    }
    /**
     * Instala o plugin no Cypress
     */
    installPlugin(on, config) {
        console.log('Cypress AI v2.0 - Plugin instalado');
        // Cria instância do plugin para usar nas tasks
        const self = this;
        // Task principal para geração de testes
        on('task', {
            async 'cypress-ai-v2:generate'(options) {
                try {
                    console.log('Iniciando geração de teste...');
                    const result = await self.testGenerator.generateTest(options);
                    return result;
                }
                catch (error) {
                    console.error('Erro na geração do teste:', error);
                    return {
                        success: false,
                        error: error.message || 'Erro desconhecido',
                        testPath: options.specPath || 'cypress/e2e-ai/error.cy.js'
                    };
                }
            }
        });
        // Configura padrões do Cypress
        if (!config.specPattern) {
            config.specPattern = [
                'cypress/e2e-ai/**/*.cy.{js,ts}',
                'cypress/e2e-final/**/*.cy.{js,ts}'
            ];
        }
        if (!config.baseUrl) {
            config.baseUrl = 'http://localhost:4200';
        }
        console.log('Configuração aplicada:');
        console.log(`   - Spec Pattern: ${config.specPattern}`);
        console.log(`   - Base URL: ${config.baseUrl}`);
        console.log(`   - Agent: ${this.config.agent}`);
        console.log(`   - Model: ${this.config.model}`);
        console.log(`   - Max Retries: ${this.config.maxRetries}`);
        return config;
    }
    /**
     * Verifica se as dependências estão disponíveis
     */
    async checkDependencies() {
        try {
            const isAvailable = await this.testGenerator['agent'].isAvailable();
            return { stackspot: isAvailable };
        }
        catch {
            return { stackspot: false };
        }
    }
}
exports.CypressAiV2Plugin = CypressAiV2Plugin;
//# sourceMappingURL=CypressAiV2Plugin.js.map