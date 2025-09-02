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

      // Monta o comando para rodar apenas o spec existente
      const args = ['cypress', 'run', '--spec', absPath, '--config', `baseUrl=${baseUrl}`];
      
      // Usa npx para executar cypress a partir do projeto (garante binário local)
      const cmd = process.platform === 'win32' ? 'npx.cmd' : 'npx';

      // Roda de forma síncrona para simplificar e retornar o resultado
      const result = child_process.spawnSync(cmd, args, { encoding: 'utf8' });

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

