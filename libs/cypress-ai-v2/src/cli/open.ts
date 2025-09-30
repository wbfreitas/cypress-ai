// libs/cypress-ai-v2/src/cli/open.ts
import { spawn } from 'child_process';
import { existsSync } from 'fs';
import { join } from 'path';

export interface OpenOptions {
  spec?: string;
  browser?: string;
  config?: string;
  env?: string;
  global?: boolean;
}

export class OpenCommand {
  async run(options: OpenOptions = {}) {
    console.log('Cypress AI v2.0 - Abrindo Cypress...');
    
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
    
    console.log(`Executando: npx cypress open ${cypressArgs.join(' ')}`);
    
    // Executa Cypress
    const cypress = spawn('npx', ['cypress', 'open', ...cypressArgs], {
      stdio: 'inherit',
      shell: true
    });

    cypress.on('close', (code) => {
      if (code === 0) {
        console.log('Cypress fechado com sucesso!');
      } else {
        console.error(`Cypress fechou com código: ${code}`);
      }
    });

    cypress.on('error', (error) => {
      console.error('Erro ao abrir Cypress:', error);
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

  private buildCypressArgs(options: OpenOptions): string[] {
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

    if (options.config) {
      args.push('--config-file', options.config);
    }

    if (options.env) {
      args.push('--env', options.env);
    }

    if (options.global) {
      args.push('--global');
    }

    return args;
  }
}
