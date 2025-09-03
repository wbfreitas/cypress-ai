import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';
import * as readline from 'readline';

export interface SetupOptions {
  model?: string;
  baseUrl?: string;
  aiDir?: string;
  finalDir?: string;
  port?: string;
  force?: boolean;
  agent?: string;
  interactive?: boolean;
  // Ollama
  ollamaBaseUrl?: string;
  // StackSpot
  stackspotRealm?: string;
  stackspotClientId?: string;
  stackspotClientKey?: string;
  stackspotAgentId?: string;
  stackspotBaseUrl?: string;
}

export class SetupCommand {
  private options: SetupOptions;

  constructor() {
    this.options = {};
  }

  async run(options: SetupOptions = {}) {
    this.options = {
      model: 'qwen2.5-coder:latest',
      baseUrl: 'http://localhost:4200',
      aiDir: 'cypress/e2e-ai',
      finalDir: 'cypress/e2e-final',
      port: '4200',
      force: false,
      interactive: true,
      ...options
    };

    console.log('- Configurando Cypress AI no projeto...\n');

    try {
      // 1. Verificar se é um projeto Angular
      await this.checkAngularProject();

      // 2. Selecionar agente (se interativo)
      if (this.options.interactive && !this.options.agent) {
        this.options.agent = await this.selectAgent();
      }

      // 3. Configurar variáveis específicas do agente
      if (this.options.interactive) {
        await this.configureAgentVariables();
      }

      // 4. Criar arquivo .env
      await this.createEnvFile();

      // 5. Configurar cypress.config.ts
      await this.configureCypressConfig();

      // 6. Criar support file
      await this.createSupportFile();

      // 7. Criar diretórios
      await this.createDirectories();

      // 8. Atualizar package.json
      await this.updatePackageJson();

      // 9. Instalar dependências
      await this.installDependencies();

      console.log('\n- Configuração concluída com sucesso!');
      console.log('\n- Próximos passos:');
      console.log('  1. cyai playground     # Iniciar ambiente de desenvolvimento');
      console.log('  2. cyai version        # Verificar versão');
      console.log('  3. cyai help           # Ver todos os comandos');
      console.log('\n- Documentação: https://github.com/seu-usuario/cypress-ai');

    } catch (error: any) {
      console.error('- Erro na configuração:', error.message);
      process.exit(1);
    }
  }

  private async checkAngularProject(): Promise<void> {
    console.log('🔍 Verificando se é um projeto Angular...');

    const packageJsonPath = path.join(process.cwd(), 'package.json');
    if (!fs.existsSync(packageJsonPath)) {
      throw new Error('package.json não encontrado. Execute este comando na raiz do projeto Angular.');
    }

    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    const hasAngular = packageJson.dependencies?.['@angular/core'] || 
                      packageJson.devDependencies?.['@angular/core'];

    if (!hasAngular) {
      throw new Error('Este não parece ser um projeto Angular. @angular/core não encontrado nas dependências.');
    }

    console.log('- Projeto Angular detectado');
  }

  private async selectAgent(): Promise<string> {
    console.log('\n🤖 Selecione o agente de IA:');
    console.log('  1. Ollama (Local) - Modelo local executando no seu computador');
    console.log('  2. StackSpot (Cloud) - Serviço de IA em nuvem');
    
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    return new Promise((resolve) => {
      rl.question('\nDigite sua escolha (1 ou 2): ', (answer) => {
        rl.close();
        const choice = answer.trim();
        
        if (choice === '1') {
          console.log('- Ollama selecionado');
          resolve('ollama');
        } else if (choice === '2') {
          console.log('- StackSpot selecionado');
          resolve('stackspot');
        } else {
          console.log('- Escolha inválida, usando Ollama como padrão');
          resolve('ollama');
        }
      });
    });
  }

  private async configureAgentVariables(): Promise<void> {
    if (this.options.agent === 'stackspot') {
      console.log('\n- Configurando StackSpot...');
      
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      });

      // Configurar variáveis do StackSpot
      this.options.stackspotRealm = await this.askQuestion(rl, 'Digite o REALM do StackSpot: ');
      this.options.stackspotClientId = await this.askQuestion(rl, 'Digite o CLIENT_ID do StackSpot: ');
      this.options.stackspotClientKey = await this.askQuestion(rl, 'Digite o CLIENT_KEY do StackSpot: ');
      this.options.stackspotAgentId = await this.askQuestion(rl, 'Digite o AGENT_ID do StackSpot: ');
      
      const customBaseUrl = await this.askQuestion(rl, 'Digite a BASE_URL do StackSpot (ou pressione Enter para usar padrão): ');
      if (customBaseUrl.trim()) {
        this.options.stackspotBaseUrl = customBaseUrl.trim();
      }

      rl.close();
      console.log('- Configuração do StackSpot concluída');
    } else {
      console.log('\n- Configurando Ollama...');
      
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      });

      const customModel = await this.askQuestion(rl, 'Digite o modelo do Ollama (ou pressione Enter para usar qwen2.5-coder:latest): ');
      if (customModel.trim()) {
        this.options.model = customModel.trim();
      }

      const customBaseUrl = await this.askQuestion(rl, 'Digite a URL base do Ollama (ou pressione Enter para usar http://localhost:11434): ');
      if (customBaseUrl.trim()) {
        this.options.ollamaBaseUrl = customBaseUrl.trim();
      }

      rl.close();
      console.log('- Configuração do Ollama concluída');
    }
  }

  private async askQuestion(rl: readline.Interface, question: string): Promise<string> {
    return new Promise((resolve) => {
      rl.question(question, (answer) => {
        resolve(answer.trim());
      });
    });
  }

  private async createEnvFile(): Promise<void> {
    console.log('- Criando arquivo .env...');

    const envPath = path.join(process.cwd(), '.env');
    
    if (fs.existsSync(envPath) && !this.options.force) {
      console.log('- Arquivo .env já existe. Use --force para sobrescrever.');
      return;
    }

    let envContent = `# Cypress AI Configuration
# Agent Configuration
AI_AGENT=${this.options.agent || 'ollama'}

# Project Configuration
CYPRESS_AI_BASE_URL=${this.options.baseUrl}
CYPRESS_AI_PORT=${this.options.port}

# Directory Configuration
CYPRESS_AI_DIR=${this.options.aiDir}
CYPRESS_FINAL_DIR=${this.options.finalDir}

# Auto-Retry Configuration
CYPRESS_AI_AUTO_RETRY=true
CYPRESS_AI_MAX_RETRIES=3

`;

    // Adicionar configurações específicas do agente
    if (this.options.agent === 'ollama') {
      envContent += `# Ollama Configuration
AI_OLLAMA_BASE_URL=${this.options.ollamaBaseUrl || 'http://localhost:11434'}
AI_OLLAMA_MODEL=${this.options.model}

`;
    } else if (this.options.agent === 'stackspot') {
      envContent += `# StackSpot Configuration
STACKSPOT_REALM=${this.options.stackspotRealm || ''}
STACKSPOT_CLIENT_ID=${this.options.stackspotClientId || ''}
STACKSPOT_CLIENT_KEY=${this.options.stackspotClientKey || ''}
STACKSPOT_AGENT_ID=${this.options.stackspotAgentId || ''}
STACKSPOT_BASE_URL=${this.options.stackspotBaseUrl || 'https://genai-inference-app.stackspot.com'}

`;
    }

    envContent += `# Optional: Custom prompts
# CYPRESS_AI_SYSTEM_PROMPT=Você é um especialista em testes E2E com Cypress.
`;

    fs.writeFileSync(envPath, envContent);
    console.log('- Arquivo .env criado');
  }

  private async configureCypressConfig(): Promise<void> {
    console.log('- Configurando cypress.config.ts...');

    const configPath = path.join(process.cwd(), 'cypress.config.ts');
    
    if (fs.existsSync(configPath) && !this.options.force) {
      console.log('- cypress.config.ts já existe. Use --force para sobrescrever.');
      return;
    }

    const configContent = `import { defineConfig } from 'cypress'
const { installCypressAiPlugin } = require('cypress-ai/dist/agent')

export default defineConfig({
  e2e: {
    baseUrl: '${this.options.baseUrl}',
    supportFile: 'cypress/support/e2e.ts',
    specPattern: [
      '${this.options.aiDir}/**/*.cy.{js,ts}',
      '${this.options.finalDir}/**/*.cy.{js,ts}'
    ],
    setupNodeEvents(on, config) {
      return installCypressAiPlugin(on, config, { 
        agent: process.env.AI_AGENT || '${this.options.agent || 'ollama'}',
        model: process.env.AI_OLLAMA_MODEL || '${this.options.model}',
        baseUrl: process.env.AI_OLLAMA_BASE_URL || 'http://localhost:11434'
      })
    },
    video: false,
    screenshotOnRunFailure: false
  }
})
`;

    fs.writeFileSync(configPath, configContent);
    console.log('- cypress.config.ts configurado');
  }

  private async createSupportFile(): Promise<void> {
    console.log('📁 Criando cypress/support/e2e.ts...');

    const supportDir = path.join(process.cwd(), 'cypress', 'support');
    const supportFile = path.join(supportDir, 'e2e.ts');

    // Criar diretório se não existir
    if (!fs.existsSync(supportDir)) {
      fs.mkdirSync(supportDir, { recursive: true });
    }

    if (fs.existsSync(supportFile) && !this.options.force) {
      console.log('- cypress/support/e2e.ts já existe. Use --force para sobrescrever.');
      return;
    }

    const supportContent = `import '@testing-library/cypress/add-commands'
require('cypress-ai/dist/commands').registerSupportCommands()
export {}
`;

    fs.writeFileSync(supportFile, supportContent);
    console.log('- cypress/support/e2e.ts criado');
  }

  private async createDirectories(): Promise<void> {
    console.log('📂 Criando diretórios...');

    const aiDir = path.join(process.cwd(), this.options.aiDir!);
    const finalDir = path.join(process.cwd(), this.options.finalDir!);

    if (!fs.existsSync(aiDir)) {
      fs.mkdirSync(aiDir, { recursive: true });
      console.log(`- Diretório ${this.options.aiDir} criado`);
    }

    if (!fs.existsSync(finalDir)) {
      fs.mkdirSync(finalDir, { recursive: true });
      console.log(`- Diretório ${this.options.finalDir} criado`);
    }

    // Criar arquivo .gitkeep para manter os diretórios no git
    const gitkeepAi = path.join(aiDir, '.gitkeep');
    const gitkeepFinal = path.join(finalDir, '.gitkeep');

    if (!fs.existsSync(gitkeepAi)) {
      fs.writeFileSync(gitkeepAi, '# Este arquivo mantém o diretório no git\n');
    }

    if (!fs.existsSync(gitkeepFinal)) {
      fs.writeFileSync(gitkeepFinal, '# Este arquivo mantém o diretório no git\n');
    }
  }

  private async updatePackageJson(): Promise<void> {
    console.log('- Atualizando package.json...');

    const packageJsonPath = path.join(process.cwd(), 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

    // Adicionar scripts se não existirem
    if (!packageJson.scripts) {
      packageJson.scripts = {};
    }

    const newScripts = {
      'start': `ng serve --port ${this.options.port}`,
      'cy:ai:run': 'cypress run --e2e --config baseUrl=http://localhost:4200',
      'cy:final': `cypress open --e2e --config specPattern='${this.options.finalDir}/**/*.cy.{js,ts}',baseUrl=http://localhost:4200`,
      'cy:ai:setup': 'cyai setup'
    };

    let scriptsUpdated = false;
    for (const [key, value] of Object.entries(newScripts)) {
      if (!packageJson.scripts[key]) {
        packageJson.scripts[key] = value;
        scriptsUpdated = true;
      }
    }

    // Adicionar cypress-ai e dotenv como devDependencies se não existirem
    if (!packageJson.devDependencies) {
      packageJson.devDependencies = {};
    }

    if (!packageJson.devDependencies['cypress-ai']) {
      packageJson.devDependencies['cypress-ai'] = 'latest';
      console.log('- cypress-ai adicionado às devDependencies');
    }

    if (!packageJson.devDependencies['dotenv']) {
      packageJson.devDependencies['dotenv'] = '^16.0.0';
      console.log('- dotenv adicionado às devDependencies');
    }

    if (scriptsUpdated) {
      fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
      console.log('- Scripts adicionados ao package.json');
    } else {
      console.log('- Scripts já existem no package.json');
    }
  }

  private async installDependencies(): Promise<void> {
    console.log('📥 Instalando dependências...');

    try {
      // Verificar se cypress está instalado
      const packageJsonPath = path.join(process.cwd(), 'package.json');
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      
      const hasCypress = packageJson.devDependencies?.['cypress'] || 
                        packageJson.dependencies?.['cypress'];

      if (!hasCypress) {
        console.log('- Instalando Cypress...');
        execSync('npm install --save-dev cypress', { stdio: 'inherit' });
      }

      console.log('- Instalando cypress-ai...');
      execSync('npm install --save-dev cypress-ai', { stdio: 'inherit' });

      console.log('- Dependências instaladas');

    } catch (error: any) {
      console.log('- Erro ao instalar dependências:', error.message);
      console.log('- Você pode instalar manualmente com: npm install --save-dev cypress cypress-ai');
    }
  }
}
