// libs/cypress-ai-v2/src/cli/run.ts
import { spawn } from 'child_process';
import { existsSync } from 'fs';
import { join } from 'path';

export interface RunOptions {
  spec?: string;
  browser?: string;
  headless?: boolean;
  config?: string;
  env?: string;
  reporter?: string;
  reporterOptions?: string;
}

export class RunCommand {
  async run(options: RunOptions = {}) {
    console.log('Cypress AI v2.0 - Executando testes...');
    
    // Verifica se o Cypress está instalado
    if (!this.isCypressInstalled()) {
      console.error('Cypress não encontrado. Instale com: npm install cypress --save-dev');
      process.exit(1);
    }

    // Verifica se existe cypress.config.ts
    if (!this.hasCypressConfig()) {
      console.error('cypress.config.ts não encontrado. Execute: cyai-v2 setup');
      process.exit(1);
    }

    // Constrói comando Cypress
    const cypressArgs = this.buildCypressArgs(options);
    
    console.log(`Executando: npx cypress run ${cypressArgs.join(' ')}`);
    
    // Executa Cypress
    const cypress = spawn('npx', ['cypress', 'run', ...cypressArgs], {
      stdio: 'inherit',
      shell: true
    });

    cypress.on('close', (code) => {
      if (code === 0) {
        console.log('Testes executados com sucesso!');
      } else {
        console.error(`Testes falharam com código: ${code}`);
        process.exit(code || 1);
      }
    });

    cypress.on('error', (error) => {
      console.error('Erro ao executar Cypress:', error);
      process.exit(1);
    });
  }

  private isCypressInstalled(): boolean {
    try {
      const packageJsonPath = join(process.cwd(), 'package.json');
      if (!existsSync(packageJsonPath)) {
        return false;
      }
      
      const packageJson = require(packageJsonPath);
      return !!(packageJson.dependencies?.cypress || packageJson.devDependencies?.cypress);
    } catch {
      return false;
    }
  }

  private hasCypressConfig(): boolean {
    const configFiles = [
      'cypress.config.ts',
      'cypress.config.js',
      'cypress.json'
    ];
    
    return configFiles.some(file => existsSync(join(process.cwd(), file)));
  }

  private buildCypressArgs(options: RunOptions): string[] {
    const args: string[] = [];

    // Se não especificou um arquivo específico, usa a pasta e2e-final por padrão
    if (options.spec) {
      args.push('--spec', options.spec);
    } else {
      // Usa a pasta e2e-final por padrão
      args.push('--spec', '"cypress/e2e-final/**/*.cy.{js,ts}"');
    }

    if (options.browser) {
      args.push('--browser', options.browser);
    }

    if (options.headless === false) {
      args.push('--headed');
    }

    if (options.config) {
      args.push('--config-file', options.config);
    }

    if (options.env) {
      args.push('--env', options.env);
    }

    if (options.reporter) {
      args.push('--reporter', options.reporter);
    }

    if (options.reporterOptions) {
      args.push('--reporter-options', options.reporterOptions);
    }

    return args;
  }
}
