// libs/cypress-ai-v2/src/cli/setup.ts
import { Command } from 'commander';
import * as fs from 'fs';
import * as path from 'path';
import { createInterface } from 'readline';
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
      .description('Configuração interativa do Cypress AI v2.0')
      .action(async () => {
        await this.runInteractiveSetup();
      });
  }

  private async runInteractiveSetup(): Promise<void> {
    console.log('🚀 Cypress AI v2.0 - Configuração Completa');
    console.log('==========================================');
    console.log('Este comando irá configurar tudo que você precisa para usar a biblioteca.');
    console.log('');
    
    const rl = createInterface({
      input: process.stdin,
      output: process.stdout
    });

    const question = (prompt: string): Promise<string> => {
      return new Promise((resolve) => {
        rl.question(prompt, resolve);
      });
    };

    const questionWithDefault = (prompt: string, defaultValue: string): Promise<string> => {
      return new Promise((resolve) => {
        rl.question(`${prompt} (padrão: ${defaultValue}): `, (answer) => {
          resolve(answer.trim() || defaultValue);
        });
      });
    };

    try {
      // Verifica se já existe configuração
      if (fs.existsSync('.env')) {
        const overwrite = await question('⚠️  Arquivo .env já existe. Deseja sobrescrever? (s/N): ');
        if (overwrite.toLowerCase() !== 's' && overwrite.toLowerCase() !== 'sim') {
          console.log('❌ Configuração cancelada');
          process.exit(0);
        }
      }

      // Passo 1: Configuração do StackSpot AI
      console.log('\n📋 PASSO 1: Configuração do StackSpot AI');
      console.log('==========================================');
      console.log('Você precisa das credenciais do StackSpot para usar a IA.');
      console.log('Acesse: https://console.stackspot.com para obter suas credenciais.');
      console.log('');

      const realm = await questionWithDefault('1. StackSpot Realm', 'stackspot-freemium');
      const clientId = await question('2. StackSpot Client ID: ');
      const agentId = await question('3. StackSpot Agent ID: ');
      const clientKey = await question('4. StackSpot Client Key: ');

      if (!clientId || !agentId || !clientKey) {
        console.error('❌ Erro: Client ID, Agent ID e Client Key são obrigatórios');
        process.exit(1);
      }

      // Passo 2: Configuração da Aplicação
      console.log('\n🌐 PASSO 2: Configuração da Aplicação');
      console.log('=====================================');
      console.log('Configure a URL da sua aplicação e preferências de IA.');
      console.log('');

      const baseUrl = await questionWithDefault('1. Base URL da aplicação', 'http://localhost:4200');
      const model = await questionWithDefault('2. Modelo de IA', 'qwen2.5-coder:latest');

      // Passo 3: Configurações Avançadas
      console.log('\n⚙️  PASSO 3: Configurações Avançadas');
      console.log('====================================');
      console.log('Configure o comportamento da biblioteca.');
      console.log('');

      const maxRetries = await questionWithDefault('1. Máximo de tentativas de retry', '3');
      const timeout = await questionWithDefault('2. Timeout em milissegundos', '120000');

      // Validações
      const maxRetriesNum = parseInt(maxRetries);
      const timeoutNum = parseInt(timeout);

      if (isNaN(maxRetriesNum) || maxRetriesNum < 1 || maxRetriesNum > 10) {
        console.error('❌ Erro: Máximo de tentativas deve ser um número entre 1 e 10');
        process.exit(1);
      }

      if (isNaN(timeoutNum) || timeoutNum < 10000 || timeoutNum > 300000) {
        console.error('❌ Erro: Timeout deve ser um número entre 10000 e 300000');
        process.exit(1);
      }

      // Passo 4: Criação dos Arquivos
      console.log('\n📁 PASSO 4: Criação dos Arquivos de Configuração');
      console.log('=================================================');

      // Cria arquivo .env
      await this.createEnvFile({
        realm,
        clientId,
        agentId,
        clientKey,
        baseUrl,
        model,
        maxRetries: maxRetriesNum,
        timeout: timeoutNum
      });

      // Configura cypress.config.ts
      await this.createCypressConfig(baseUrl);

      // Configura cypress/support/e2e.ts
      await this.createSupportFile();

      // Cria estrutura de diretórios
      await this.createDirectories();

      // Cria arquivo de exemplo
      await this.createExampleFile();

      // Passo 5: Teste de Conexão
      console.log('\n🔍 PASSO 5: Teste de Conexão');
      console.log('=============================');
      console.log('Testando conexão com o StackSpot...');

      try {
        await this.testConnection();
        console.log('✅ Conexão com StackSpot funcionando!');
      } catch (error) {
        console.log('⚠️  Aviso: Não foi possível testar a conexão agora');
        console.log('   Você pode testar depois com: npx cyai-v2 run');
      }

      // Passo 6: Instruções Finais
      console.log('\n🎉 CONFIGURAÇÃO CONCLUÍDA COM SUCESSO!');
      console.log('=====================================');
      console.log('');
      console.log('📖 Próximos passos:');
      console.log('');
      console.log('1. 🚀 Inicie sua aplicação:');
      console.log('   npm start');
      console.log('');
      console.log('2. 🧪 Execute testes gerados:');
      console.log('   npx cyai-v2 run');
      console.log('');
      console.log('3. 🖥️  Abra o Cypress interativo:');
      console.log('   npx cyai-v2 open');
      console.log('');
      console.log('4. 🤖 Use nos seus testes:');
      console.log('   cy.ai("Teste o botão de login")');
      console.log('');
      console.log('📁 Arquivos criados:');
      console.log('   - .env (configurações)');
      console.log('   - cypress.config.ts (configuração do Cypress)');
      console.log('   - cypress/support/e2e.ts (comandos customizados)');
      console.log('   - cypress/e2e-ai/ (testes de geração)');
      console.log('   - cypress/e2e-final/ (testes finais)');
      console.log('');
      console.log('🔧 Comandos disponíveis:');
      console.log('   - npx cyai-v2 setup (reconfigurar)');
      console.log('   - npx cyai-v2 run (executar testes)');
      console.log('   - npx cyai-v2 open (abrir Cypress)');
      console.log('   - npx cyai-v2 generate (gerar testes)');
      console.log('   - npx cyai-v2 help (ajuda)');

    } catch (error: any) {
      console.error('❌ Erro durante a configuração:', error.message);
      process.exit(1);
    } finally {
      rl.close();
    }
  }

  private async createEnvFile(options: SetupOptions): Promise<void> {
    const envContent = `# Cypress AI v2.0 Configuration
# Gerado automaticamente em ${new Date().toISOString()}

# StackSpot AI Configuration
STACKSPOT_REALM=${options.realm}
STACKSPOT_CLIENT_ID=${options.clientId}
STACKSPOT_AGENT_ID=${options.agentId}
STACKSPOT_CLIENT_KEY=${options.clientKey}

# Application Configuration
CYPRESS_AI_BASE_URL=https://genai-inference-app.stackspot.com
CYPRESS_AI_MODEL=${options.model}

# Library Configuration
CYPRESS_AI_MAX_RETRIES=${options.maxRetries || 3}
CYPRESS_AI_TIMEOUT=${options.timeout || 120000}
`;

    fs.writeFileSync('.env', envContent);
    console.log('✅ Arquivo .env criado');
  }

  private async createCypressConfig(baseUrl: string): Promise<void> {
    const configPath = 'cypress.config.ts';
    
    if (fs.existsSync(configPath)) {
      console.log('⚠️  cypress.config.ts já existe - atualizando configuração');
    }

    const configContent = `import { defineConfig } from 'cypress'
import { installCypressAiV2 } from 'cypress-ai-v2'

export default defineConfig({
  e2e: {
    baseUrl: '${baseUrl}',
    supportFile: 'cypress/support/e2e.ts',
    specPattern: [
      'cypress/e2e-ai/**/*.cy.{js,ts}',
      'cypress/e2e-final/**/*.cy.{js,ts}'
    ],
    setupNodeEvents(on, config) {
      return installCypressAiV2(on, config)
    },
    video: false,
    screenshotOnRunFailure: false,
    viewportWidth: 1280,
    viewportHeight: 720,
    defaultCommandTimeout: 10000,
    requestTimeout: 10000,
    responseTimeout: 10000
  }
})
`;

    fs.writeFileSync(configPath, configContent);
    console.log('✅ cypress.config.ts configurado');
  }

  private async createSupportFile(): Promise<void> {
    const supportDir = 'cypress/support';
    const supportFile = path.join(supportDir, 'e2e.ts');
    
    if (!fs.existsSync(supportDir)) {
      fs.mkdirSync(supportDir, { recursive: true });
    }

    const supportContent = `import '@testing-library/cypress/add-commands'
import { CypressCommands } from 'cypress-ai-v2/dist/commands'

// Registra comandos do Cypress AI v2.0
Cypress.Commands.add('ai', CypressCommands.ai)

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
      } else {
        console.log(`✅ Diretório já existe: ${dir}`);
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

  it('deve gerar teste com caminho personalizado', () => {
    cy.ai('Teste o formulário', { 
      specPath: 'cypress/e2e-final/formulario-teste.cy.js' 
    });
  });
});
`;

    fs.writeFileSync('cypress/e2e-ai/exemplo.cy.js', exampleContent);
    console.log('✅ Arquivo de exemplo criado');
  }

  private async testConnection(): Promise<void> {
    // Carrega variáveis do .env
    const envContent = fs.readFileSync('.env', 'utf8');
    const envVars: { [key: string]: string } = {};
    
    envContent.split('\n').forEach(line => {
      const [key, value] = line.split('=');
      if (key && value) {
        envVars[key.trim()] = value.trim();
      }
    });

    // Testa autenticação
    const { spawn } = require('child_process');
    
    return new Promise((resolve, reject) => {
      const curl = spawn('curl', [
        '-s',
        `https://idm.stackspot.com/${envVars.STACKSPOT_REALM}/oidc/oauth/token`,
        '-H', 'Content-Type: application/x-www-form-urlencoded',
        '-d', 'grant_type=client_credentials',
        '-d', `client_id=${envVars.STACKSPOT_CLIENT_ID}`,
        '-d', `client_secret=${envVars.STACKSPOT_CLIENT_KEY}`
      ]);

      let output = '';
      curl.stdout.on('data', (data: any) => {
        output += data.toString();
      });

      curl.on('close', (code: number) => {
        try {
          const result = JSON.parse(output);
          if (result.access_token) {
            resolve();
          } else {
            reject(new Error('Falha na autenticação'));
          }
        } catch (error) {
          reject(new Error('Resposta inválida da API'));
        }
      });

      curl.on('error', (error: any) => {
        reject(error);
      });
    });
  }

  run(): void {
    this.program.parse();
  }
}