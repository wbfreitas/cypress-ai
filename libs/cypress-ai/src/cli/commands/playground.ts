import { spawn, exec } from 'child_process';
import * as chokidar from 'chokidar';
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

export interface PlaygroundOptions {
  port?: string;
  cypressFinal?: boolean;
  watch?: boolean;
}

export class PlaygroundCommand {
  private angularProcess: any = null;
  private cypressFinalProcess: any = null;
  private isAngularRunning = false;
  private isCypressFinalRunning = false;
  private watcher: any = null;
  private runningTests = new Set<string>();
  private options: PlaygroundOptions;

  constructor() {
    this.options = {};
  }

  async run(options: PlaygroundOptions = {}) {
    this.options = {
      port: process.env['CYPRESS_AI_PORT'] || '4200',
      cypressFinal: true,
      watch: true,
      ...options
    };

    console.log('- Iniciando Cypress AI Playground...\n');
    
    try {
      // 1. Inicia a aplicação Angular
      await this.startAngularApp();
      
      // 2. Aguarda a aplicação estar pronta
      await this.waitForAngularApp();
      
      // 3. Inicia o Cypress Final (se habilitado)
      if (this.options.cypressFinal) {
        await this.startCypressFinal();
      }
      
      // 4. Inicia o watcher para arquivos AI (se habilitado)
      if (this.options.watch) {
        this.startFileWatcher();
      }
      
      console.log('\n- Playground iniciado com sucesso!');
      console.log(`🌐 Aplicação rodando em http://localhost:${this.options.port}`);
      if (this.options.watch) {
        console.log('- Edite os arquivos em cypress/e2e-ai/ para executar testes automaticamente');
      }
      if (this.options.cypressFinal) {
        console.log('🎨 Cypress Final aberto para visualizar testes gerados');
      }
      console.log('- Pressione Ctrl+C para parar\n');
      
    } catch (error: any) {
      console.error('- Erro ao iniciar playground:', error.message);
      this.cleanup();
      process.exit(1);
    }
  }

  private async startAngularApp() {
    // Primeiro verifica se a aplicação já está rodando
    console.log('🔍 Verificando se a aplicação Angular já está rodando...');
    
    const isAlreadyRunning = await this.checkIfAngularIsRunning();
    if (isAlreadyRunning) {
      console.log(`- Aplicação Angular já está rodando em http://localhost:${this.options.port}`);
      this.isAngularRunning = true;
      return;
    }

    console.log('- Iniciando aplicação Angular...');
    
    return new Promise<void>((resolve, reject) => {
      this.angularProcess = spawn('npm', ['start'], {
        stdio: 'pipe',
        shell: true
      });

      this.angularProcess.stdout.on('data', (data: any) => {
        const output = data.toString();
        if (output.includes('Local:') || output.includes(`localhost:${this.options.port}`)) {
          console.log(`- Aplicação Angular iniciada em http://localhost:${this.options.port}`);
          this.isAngularRunning = true;
          resolve();
        }
      });

      this.angularProcess.stderr.on('data', (data: any) => {
        const error = data.toString();
        if (error.includes('EADDRINUSE')) {
          console.log(`- Porta ${this.options.port} já está em uso, assumindo que a aplicação já está rodando...`);
          this.isAngularRunning = true;
          resolve();
        } else if (!error.includes('webpack') && !error.includes('DevTools')) {
          console.error('- Erro na aplicação Angular:', error);
        }
      });

      this.angularProcess.on('error', (error: any) => {
        reject(error);
      });

      // Timeout de 30 segundos
      setTimeout(() => {
        if (!this.isAngularRunning) {
          reject(new Error('Timeout ao iniciar aplicação Angular'));
        }
      }, 30000);
    });
  }

  private async checkIfAngularIsRunning(): Promise<boolean> {
    return new Promise((resolve) => {
      exec(`curl -s http://localhost:${this.options.port} > /dev/null`, (error) => {
        resolve(!error);
      });
    });
  }

  private async waitForAngularApp() {
    // Se já verificamos que está rodando, não precisa aguardar
    if (this.isAngularRunning) {
      console.log('- Aplicação Angular já está pronta');
      return;
    }

    console.log('⏳ Aguardando aplicação Angular estar pronta...');
    
    return new Promise<void>((resolve) => {
      let attempts = 0;
      const maxAttempts = 30; // 30 segundos máximo
      
      const checkApp = () => {
        attempts++;
        exec(`curl -s http://localhost:${this.options.port} > /dev/null`, (error) => {
          if (!error) {
            console.log('- Aplicação Angular está respondendo');
            resolve();
          } else if (attempts < maxAttempts) {
            setTimeout(checkApp, 1000);
          } else {
            console.log('- Aplicação Angular pode não estar respondendo, mas continuando...');
            resolve();
          }
        });
      };
      checkApp();
    });
  }

  private async startCypressFinal() {
    console.log('- Iniciando Cypress Final...');
    
    return new Promise<void>((resolve) => {
      this.cypressFinalProcess = spawn('npm', ['run', 'cy:final'], {
        stdio: 'pipe',
        shell: true
      });

      this.cypressFinalProcess.stdout.on('data', (data: any) => {
        const output = data.toString();
        if (output.includes('Cypress') || output.includes('Electron') || output.includes('DevTools')) {
          console.log('- Cypress Final iniciado');
          this.isCypressFinalRunning = true;
          resolve();
        }
      });

      this.cypressFinalProcess.stderr.on('data', (data: any) => {
        const error = data.toString();
        if (error.includes('DevTools') || error.includes('WARNING')) {
          // Ignora warnings do DevTools
          return;
        }
        if (error.includes('Cypress') || error.includes('Electron')) {
          console.log('- Cypress Final iniciado');
          this.isCypressFinalRunning = true;
          resolve();
        } else if (error.trim()) {
          console.log('- Cypress Final:', error.trim());
        }
      });

      this.cypressFinalProcess.on('error', (error: any) => {
        console.log('- Erro ao iniciar Cypress Final:', error.message);
        console.log('- Continuando sem Cypress Final...');
        resolve();
      });

      // Timeout de 15 segundos
      setTimeout(() => {
        if (!this.isCypressFinalRunning) {
          console.log('- Cypress Final pode não ter iniciado corretamente, mas continuando...');
          resolve();
        }
      }, 15000);
    });
  }

  private startFileWatcher() {
    console.log('👀 Iniciando watcher para arquivos cypress/e2e-ai/...');
    
    const watchPath = path.join(process.cwd(), 'cypress', 'e2e-ai');
    
    // Verifica se o diretório existe
    if (!fs.existsSync(watchPath)) {
      console.log('- Diretório cypress/e2e-ai não existe, criando...');
      fs.mkdirSync(watchPath, { recursive: true });
    }

    this.watcher = chokidar.watch(`${watchPath}/**/*.cy.{js,ts}`, {
      ignored: /(^|[\/\\])\../, // ignora arquivos ocultos
      persistent: true,
      ignoreInitial: true
    });

    this.watcher
      .on('change', (filePath: string) => {
        this.handleFileChange(filePath, 'modificado');
      })
      .on('add', (filePath: string) => {
        this.handleFileChange(filePath, 'criado');
      });

    console.log('- Watcher iniciado');
  }

  private async handleFileChange(filePath: string, action: string) {
    const fileName = path.basename(filePath);
    const relativePath = path.relative(process.cwd(), filePath);
    
    // Evita executar o mesmo teste múltiplas vezes
    if (this.runningTests.has(fileName)) {
      console.log(`- Teste ${fileName} já está sendo executado, pulando...`);
      return;
    }

    console.log(`\n- Arquivo ${action}: ${relativePath}`);
    console.log(`- Executando teste: ${fileName}`);
    
    // Mostrar qual agente está sendo usado
          const selectedAgent = process.env['AI_AGENT'] || 'ollama';
      console.log(`- Agente configurado: ${selectedAgent}`);
      if (selectedAgent === 'stackspot') {
        console.log(`- Usando StackSpot (Cloud)`);
      } else {
        console.log(`- Usando Ollama (Local)`);
      }
    
    this.runningTests.add(fileName);
    
    try {
      await this.runCypressTest(filePath);
    } catch (error: any) {
      console.error(`- Erro ao executar teste ${fileName}:`, error.message);
    } finally {
      this.runningTests.delete(fileName);
    }
  }

  private async runCypressTest(filePath: string) {
    return new Promise<void>((resolve, reject) => {
      const relativePath = path.relative(process.cwd(), filePath);
      
      const cypressProcess = spawn('npx', [
        'cypress', 'run', 
        '--spec', relativePath,
        '--config', `baseUrl=http://localhost:${this.options.port}`,
        '--headless'
      ], {
        stdio: 'pipe',
        shell: true
      });

      let output = '';
      let hasError = false;

      cypressProcess.stdout.on('data', (data: any) => {
        output += data.toString();
      });

      cypressProcess.stderr.on('data', (data: any) => {
        const error = data.toString();
        if (error.includes('Error:') || error.includes('failed')) {
          hasError = true;
        }
        output += error;
      });

      cypressProcess.on('close', (code: number) => {
        if (code === 0) {
          console.log(`- Teste executado com sucesso!`);
          
          // Mostrar qual agente foi usado
          const selectedAgent = process.env['AI_AGENT'] || 'ollama';
          console.log(`- Agente usado: ${selectedAgent}`);
          if (selectedAgent === 'stackspot') {
            console.log(`- StackSpot (Cloud) foi usado para gerar o teste`);
          } else {
            console.log(`- Ollama (Local) foi usado para gerar o teste`);
          }
        } else {
          console.log(`- Teste falhou (código: ${code})`);
          hasError = true;
        }
        
        // Mostra apenas as últimas linhas do output para não poluir o console
        const lines = output.split('\n');
        const lastLines = lines.slice(-10).join('\n');
        if (lastLines.trim()) {
          console.log('- Últimas linhas do output:');
          console.log(lastLines);
        }
        
        console.log('─'.repeat(50));
        
        if (hasError) {
          reject(new Error(`Teste falhou com código ${code}`));
        } else {
          resolve();
        }
      });

      cypressProcess.on('error', (error: any) => {
        reject(error);
      });
    });
  }

  private cleanup() {
    console.log('\n- Parando playground...');
    
    if (this.watcher) {
      this.watcher.close();
      console.log('- Watcher parado');
    }
    
    if (this.cypressFinalProcess) {
      this.cypressFinalProcess.kill();
      console.log('- Cypress Final parado');
    }
    
    if (this.angularProcess) {
      this.angularProcess.kill();
      console.log('- Aplicação Angular parada');
    }
    
    console.log('👋 Playground finalizado!');
  }
}

