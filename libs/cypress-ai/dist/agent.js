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
exports.installCypressAiPlugin = installCypressAiPlugin;
// libs/cypress-ai/src/agent.ts
const CypressAiPlugin_1 = require("./plugin/CypressAiPlugin");
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
/**
 * Instala o plugin Cypress AI
 * @param on - Eventos do Cypress
 * @param config - Configuração do Cypress
 * @param defaults - Configurações padrão para o plugin
 * @returns Configuração atualizada do Cypress
 */
function installCypressAiPlugin(on, config, defaults = {}) {
    // Usar variáveis de ambiente se disponíveis
    const envConfig = {
        model: process.env['AI_OLLAMA_MODEL'] || defaults.model || 'qwen2.5-coder:latest',
        baseUrl: process.env['AI_OLLAMA_BASE_URL'] || defaults.baseUrl || 'http://localhost:11434',
        ...defaults
    };
    const plugin = new CypressAiPlugin_1.CypressAiPlugin(envConfig);
    return plugin.installPlugin(on, config);
}
var CypressAiPlugin_2 = require("./plugin/CypressAiPlugin");
Object.defineProperty(exports, "CypressAiPlugin", { enumerable: true, get: function () { return CypressAiPlugin_2.CypressAiPlugin; } });
//# sourceMappingURL=agent.js.map