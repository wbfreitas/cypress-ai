// libs/cypress-ai/src/plugin/CypressAiPlugin.ts
import { TestGenerator } from '../core/TestGenerator';
import { GenerateTestOptions, RunTestOptions, CypressAiConfig } from '../types';

export class CypressAiPlugin {
  private testGenerator: TestGenerator;
  private config: CypressAiConfig;

  constructor(config: CypressAiConfig = {}) {
    this.testGenerator = new TestGenerator();
    this.config = config;
  }

  /**
   * Instala o plugin no Cypress
   */
  installPlugin(on: any, config: any): any {
    const self = this;
    
    // Task para gerar testes
    on('task', {
      async 'cypress-ai:generate'(options: GenerateTestOptions): Promise<boolean> {
        return self.testGenerator.generateTest(options, self.config);
      },

      // Task para executar testes existentes
      async 'cypress-ai:run-if-exists'(options: RunTestOptions) {
        return self.testGenerator.runTestIfExists(options);
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
  async checkDependencies(): Promise<{ cypress: boolean; agent: boolean }> {
    return this.testGenerator.checkDependencies();
  }

  /**
   * Atualiza a configuração do plugin
   */
  updateConfig(newConfig: Partial<CypressAiConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }
}
