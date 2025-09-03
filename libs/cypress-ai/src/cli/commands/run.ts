import { spawn } from 'child_process';
import * as path from 'path';
import * as fs from 'fs';
import * as dotenv from 'dotenv';

// Carregar arquivo .env se existir
const envPath = path.join(process.cwd(), '.env');
try {
  dotenv.config({ path: envPath });
} catch (error) {
  // Ignorar erro se arquivo .env não existir
}

export interface RunOptions {
  spec?: string;
  port?: string;
  headless?: boolean;
  browser?: string;
}

export class RunCommand {
  private options: RunOptions;

  constructor() {
    this.options = {};
  }

  async run(options: RunOptions = {}) {
    this.options = {
      port: process.env['CYPRESS_AI_PORT'] || '4200',
      headless: true,
      browser: 'chrome',
      ...options
    };

    console.log('🚀 Executando testes Cypress AI...\n');

    try {
      // Verificar se é um projeto Angular
      await this.checkProject();

      // Verificar se o arquivo .env existe
      await this.checkEnvFile();

      // Executar testes
      await this.runTests();

    } catch (error: any) {
      console.error('❌ Erro ao executar testes:', error.message);
      process.exit(1);
    }
  }

  private async checkProject(): Promise<void> {
    console.log('🔍 Verificando projeto...');

    const packageJsonPath = path.join(process.cwd(), 'package.json');
    if (!fs.existsSync(packageJsonPath)) {
      throw new Error('package.json não encontrado. Execute este comando na raiz do projeto.');
    }

    const cypressConfigPath = path.join(process.cwd(), 'cypress.config.ts');
    if (!fs.existsSync(cypressConfigPath)) {
      throw new Error('cypress.config.ts não encontrado. Execute "cyai setup" primeiro.');
    }

    console.log('✅ Projeto verificado');
  }

  private async checkEnvFile(): Promise<void> {
    console.log('🔍 Verificando arquivo .env...');

    const envPath = path.join(process.cwd(), '.env');
    if (!fs.existsSync(envPath)) {
      console.log('⚠️  Arquivo .env não encontrado. Execute "cyai setup" primeiro.');
      console.log('ℹ️  Continuando com configurações padrão...');
    } else {
      console.log('✅ Arquivo .env encontrado');
    }
  }

  private async runTests(): Promise<void> {
    console.log('🧪 Executando testes...');

    const baseUrl = `http://localhost:${this.options.port}`;
    const args = [
      'cypress', 'run',
      '--config', `baseUrl=${baseUrl}`,
      '--browser', this.options.browser!
    ];

    if (this.options.headless) {
      args.push('--headless');
    }

    if (this.options.spec) {
      args.push('--spec', this.options.spec);
    }

    console.log(`📝 Comando: npx ${args.join(' ')}`);

    return new Promise<void>((resolve, reject) => {
      const cypressProcess = spawn('npx', args, {
        stdio: 'inherit',
        shell: true
      });

      cypressProcess.on('close', (code: number) => {
        if (code === 0) {
          console.log('\n✅ Testes executados com sucesso!');
          resolve();
        } else {
          console.log(`\n❌ Testes falharam com código: ${code}`);
          reject(new Error(`Testes falharam com código ${code}`));
        }
      });

      cypressProcess.on('error', (error: any) => {
        reject(error);
      });
    });
  }
}
