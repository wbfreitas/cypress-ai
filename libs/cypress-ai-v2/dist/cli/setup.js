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
exports.SetupCommand = void 0;
// libs/cypress-ai-v2/src/cli/setup.ts
const commander_1 = require("commander");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
class SetupCommand {
    constructor() {
        this.program = new commander_1.Command();
        this.setupCommand();
    }
    setupCommand() {
        this.program
            .name('cyai-v2 setup')
            .description('Configura o Cypress AI v2.0')
            .option('-r, --realm <realm>', 'StackSpot Realm', 'stackspot-freemium')
            .option('-c, --client-id <clientId>', 'StackSpot Client ID')
            .option('-a, --agent-id <agentId>', 'StackSpot Agent ID')
            .option('-k, --client-key <clientKey>', 'StackSpot Client Key')
            .option('-b, --base-url <baseUrl>', 'Base URL da aplicação', 'http://localhost:4200')
            .option('-m, --model <model>', 'Modelo de IA', 'qwen2.5-coder:latest')
            .action(async (options) => {
            await this.runSetup(options);
        });
    }
    async runSetup(options) {
        console.log('🚀 Configurando Cypress AI v2.0...\n');
        try {
            // Valida configurações obrigatórias
            if (!options.clientId || !options.agentId || !options.clientKey) {
                console.log('❌ Configurações obrigatórias não fornecidas!');
                console.log('Use: cyai-v2 setup --client-id <id> --agent-id <id> --client-key <key>');
                process.exit(1);
            }
            // Cria arquivo .env
            await this.createEnvFile(options);
            // Cria cypress.config.ts se não existir
            await this.createCypressConfig();
            // Cria arquivo de suporte
            await this.createSupportFile();
            // Cria diretórios necessários
            await this.createDirectories();
            // Cria arquivo de exemplo
            await this.createExampleFile();
            console.log('\n✅ Configuração concluída com sucesso!');
            console.log('\n📋 Próximos passos:');
            console.log('1. Execute: npm start (para iniciar sua aplicação)');
            console.log('2. Execute: npx cypress open');
            console.log('3. Use: cy.ai("Teste o botão de login")');
        }
        catch (error) {
            console.error('❌ Erro na configuração:', error.message);
            process.exit(1);
        }
    }
    async createEnvFile(options) {
        const envContent = `# Cypress AI v2.0 Configuration
CYPRESS_AI_MODEL=${options.model}
CYPRESS_AI_BASE_URL=https://genai-inference-app.stackspot.com
STACKSPOT_REALM=${options.realm}
STACKSPOT_CLIENT_ID=${options.clientId}
STACKSPOT_AGENT_ID=${options.agentId}
STACKSPOT_CLIENT_KEY=${options.clientKey}
CYPRESS_AI_MAX_RETRIES=3
CYPRESS_AI_TIMEOUT=120000
`;
        fs.writeFileSync('.env', envContent);
        console.log('✅ Arquivo .env criado');
    }
    async createCypressConfig() {
        const configPath = 'cypress.config.ts';
        if (fs.existsSync(configPath)) {
            console.log('⚠️  cypress.config.ts já existe - pulando criação');
            return;
        }
        const configContent = `import { defineConfig } from 'cypress'
import { installCypressAiV2 } from 'cypress-ai-v2'

export default defineConfig({
  e2e: {
    baseUrl: '${process.env.CYPRESS_AI_BASE_URL || 'http://localhost:4200'}',
    supportFile: 'cypress/support/e2e.ts',
    specPattern: [
      'cypress/e2e-ai/**/*.cy.{js,ts}',
      'cypress/e2e-final/**/*.cy.{js,ts}'
    ],
    setupNodeEvents(on, config) {
      return installCypressAiV2(on, config)
    },
    video: false,
    screenshotOnRunFailure: false
  }
})
`;
        fs.writeFileSync(configPath, configContent);
        console.log('✅ cypress.config.ts criado');
    }
    async createSupportFile() {
        const supportDir = 'cypress/support';
        const supportFile = path.join(supportDir, 'e2e.ts');
        if (!fs.existsSync(supportDir)) {
            fs.mkdirSync(supportDir, { recursive: true });
        }
        const supportContent = `import '@testing-library/cypress/add-commands'
import 'cypress-ai-v2/dist/commands'

// Comandos personalizados podem ser adicionados aqui
declare global {
  namespace Cypress {
    interface Chainable {
      ai(instructions: string | string[], options?: any): Chainable<any>
    }
  }
}
`;
        fs.writeFileSync(supportFile, supportContent);
        console.log('✅ Arquivo de suporte criado');
    }
    async createDirectories() {
        const dirs = [
            'cypress/e2e-ai',
            'cypress/e2e-final'
        ];
        dirs.forEach(dir => {
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
                console.log(`✅ Diretório criado: ${dir}`);
            }
        });
    }
    async createExampleFile() {
        const exampleContent = `// Exemplo de uso do Cypress AI v2.0
describe('Exemplo de Teste', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('deve gerar teste automaticamente', () => {
    // Comando único - captura contexto e gera teste
    cy.ai('Teste o botão de login');
  });

  it('deve gerar teste com instruções múltiplas', () => {
    cy.ai([
      'Teste fazer login',
      'Verifique se foi redirecionado',
      'Teste fazer logout'
    ]);
  });

  it('deve gerar teste sem atualizar final', () => {
    cy.ai('Teste o formulário', { updateFinal: false });
  });
});
`;
        fs.writeFileSync('cypress/e2e-ai/exemplo.cy.js', exampleContent);
        console.log('✅ Arquivo de exemplo criado');
    }
    run() {
        this.program.parse();
    }
}
exports.SetupCommand = SetupCommand;
//# sourceMappingURL=setup.js.map