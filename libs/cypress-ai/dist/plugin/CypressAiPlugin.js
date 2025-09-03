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
exports.CypressAiPlugin = void 0;
// libs/cypress-ai/src/plugin/CypressAiPlugin.ts
const TestGenerator_1 = require("../core/TestGenerator");
const dotenv = __importStar(require("dotenv"));
const path = __importStar(require("path"));
// Carregar arquivo .env se existir
const envPath = path.join(process.cwd(), '.env');
try {
    dotenv.config({ path: envPath });
}
catch (error) {
    // Ignorar erro se arquivo .env não existir
}
class CypressAiPlugin {
    constructor(config = {}) {
        this.testGenerator = new TestGenerator_1.TestGenerator();
        this.config = {
            // Prioridade: .env > config > padrão
            agent: process.env['AI_AGENT'] || config.agent || 'ollama',
            model: process.env['AI_OLLAMA_MODEL'] || config.model || 'qwen2.5-coder:latest',
            baseUrl: process.env['AI_OLLAMA_BASE_URL'] || config.baseUrl || 'http://localhost:11434',
            ...config
        };
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