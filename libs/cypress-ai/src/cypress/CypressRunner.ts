// libs/cypress-ai/src/cypress/CypressRunner.ts
import * as child_process from 'child_process';
import { RunTestOptions, RunTestResult } from '../types';

export class CypressRunner {
  /**
   * Executa um teste Cypress se o arquivo existir
   */
  async runTestIfExists(options: RunTestOptions): Promise<RunTestResult> {
    try {
      const { specPath, baseUrl = 'http://localhost:4200' } = options;
      const absPath = require('path').resolve(specPath);
      
      if (!require('fs').existsSync(absPath)) {
        return { ran: false };
      }

      // Encontra o diretório do projeto Angular (onde está o cypress.config.ts)
      const projectDir = this.findProjectDirectory(absPath);

      // Monta o comando para rodar apenas o spec existente
      const args = ['run', '--spec', absPath, '--config', `baseUrl=${baseUrl}`, '--headless'];
      
      // Usa o executável do Cypress diretamente
      const cmd = require('path').join(projectDir, 'node_modules', '.bin', 'cypress');

      // Roda de forma síncrona para simplificar e retornar o resultado
      const result = child_process.spawnSync(cmd, args, { 
        encoding: 'utf8',
        cwd: projectDir
      });

      return {
        ran: true,
        status: result.status || 0,
        stdout: result.stdout || '',
        stderr: result.stderr || ''
      };
    } catch (error) {
      return { 
        ran: false, 
        error: String(error) 
      };
    }
  }

  /**
   * Encontra o diretório do projeto Angular baseado no caminho do spec
   */
  private findProjectDirectory(specPath: string): string {
    const path = require('path');
    const fs = require('fs');
    
    let currentDir = path.dirname(specPath);
    
    // Sobe na hierarquia até encontrar o cypress.config.ts
    while (currentDir !== path.dirname(currentDir)) {
      const configPath = path.join(currentDir, 'cypress.config.ts');
      if (fs.existsSync(configPath)) {
        return currentDir;
      }
      currentDir = path.dirname(currentDir);
    }
    
    // Se não encontrar, retorna o diretório atual
    return process.cwd();
  }

  /**
   * Verifica se o Cypress está disponível
   */
  async isCypressAvailable(): Promise<boolean> {
    try {
      const cmd = process.platform === 'win32' ? 'npx.cmd' : 'npx';
      const result = child_process.spawnSync(cmd, ['cypress', '--version'], { encoding: 'utf8' });
      return result.status === 0;
    } catch {
      return false;
    }
  }
}

