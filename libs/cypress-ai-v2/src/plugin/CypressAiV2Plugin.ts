// libs/cypress-ai-v2/src/plugin/CypressAiV2Plugin.ts
import { TestGenerator } from '../core/TestGenerator';
import { CypressAiV2Config, TestGenerationOptions } from '../types';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Carrega variáveis de ambiente
const envPath = path.join(process.cwd(), '.env');
try {
  dotenv.config({ path: envPath });
} catch (error) {
  // Ignora erro se arquivo .env não existir
}

export class CypressAiV2Plugin {
  private testGenerator: TestGenerator;
  private config: CypressAiV2Config;

  constructor() {
    this.config = this.loadConfig();
    this.testGenerator = new TestGenerator(this.config);
  }

  /**
   * Carrega configuração do plugin
   */
  private loadConfig(): CypressAiV2Config {
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
  installPlugin(on: any, config: any): any {
    console.log('Cypress AI v2.0 - Plugin instalado');
    
    // Cria instância do plugin para usar nas tasks
    const self = this;
    
    // Task principal para geração de testes
    on('task', {
      async 'cypress-ai-v2:generate'(options: TestGenerationOptions): Promise<any> {
        try {
          console.log('Iniciando geração de teste...');
          const result = await self.testGenerator.generateTest(options);
          return result;
        } catch (error: any) {
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
  async checkDependencies(): Promise<{ stackspot: boolean }> {
    try {
      const isAvailable = await this.testGenerator['agent'].isAvailable();
      return { stackspot: isAvailable };
    } catch {
      return { stackspot: false };
    }
  }
}
