// libs/cypress-ai-v2/src/cli/setup.ts
import { Command } from 'commander';
import * as fs from 'fs';
import * as path from 'path';
import { SetupOptions } from '../types';

export class SetupCommand {
  private program: Command;

  constructor() {
    this.program = new Command();
    this.setupCommand();
  }

  private setupCommand(): void {
    this.program
      .name('cyai-v2 setup')
      .description('Configura o Cypress AI v2.0')
      .option('-r, --realm <realm>', 'StackSpot Realm', 'stackspot-freemium')
      .option('-c, --client-id <clientId>', 'StackSpot Client ID')
      .option('-a, --agent-id <agentId>', 'StackSpot Agent ID')
      .option('-k, --client-key <clientKey>', 'StackSpot Client Key')
      .option('-b, --base-url <baseUrl>', 'Base URL da aplicação', 'http://localhost:4200')
      .option('-m, --model <model>', 'Modelo de IA', 'qwen2.5-coder:latest')
      .action(async (options: SetupOptions) => {
        await this.runSetup(options);
      });
  }

  private async runSetup(options: SetupOptions): Promise<void> {
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

    } catch (error: any) {
      console.error('❌ Erro na configuração:', error.message);
      process.exit(1);
    }
  }

  private async createEnvFile(options: SetupOptions): Promise<void> {
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

  private async createCypressConfig(): Promise<void> {
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

  private async createSupportFile(): Promise<void> {
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

  private async createDirectories(): Promise<void> {
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

  private async createExampleFile(): Promise<void> {
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

  run(): void {
    this.program.parse();
  }
}
