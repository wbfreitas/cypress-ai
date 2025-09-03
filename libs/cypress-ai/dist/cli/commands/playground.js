"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlaygroundCommand = void 0;
const child_process_1 = require("child_process");
const chokidar = __importStar(require("chokidar"));
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
class PlaygroundCommand {
    constructor() {
        this.angularProcess = null;
        this.cypressFinalProcess = null;
        this.isAngularRunning = false;
        this.isCypressFinalRunning = false;
        this.watcher = null;
        this.runningTests = new Set();
        this.options = {};
    }
    async run(options = {}) {
        this.options = {
            port: '4200',
            cypressFinal: true,
            watch: true,
            ...options
        };
        console.log('🚀 Iniciando Cypress AI Playground...\n');
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
            console.log('\n✅ Playground iniciado com sucesso!');
            console.log(`🌐 Aplicação rodando em http://localhost:${this.options.port}`);
            if (this.options.watch) {
                console.log('📝 Edite os arquivos em cypress/e2e-ai/ para executar testes automaticamente');
            }
            if (this.options.cypressFinal) {
                console.log('🎨 Cypress Final aberto para visualizar testes gerados');
            }
            console.log('🔄 Pressione Ctrl+C para parar\n');
        }
        catch (error) {
            console.error('❌ Erro ao iniciar playground:', error.message);
            this.cleanup();
            process.exit(1);
        }
    }
    async startAngularApp() {
        // Primeiro verifica se a aplicação já está rodando
        console.log('🔍 Verificando se a aplicação Angular já está rodando...');
        const isAlreadyRunning = await this.checkIfAngularIsRunning();
        if (isAlreadyRunning) {
            console.log(`✅ Aplicação Angular já está rodando em http://localhost:${this.options.port}`);
            this.isAngularRunning = true;
            return;
        }
        console.log('🔄 Iniciando aplicação Angular...');
        return new Promise((resolve, reject) => {
            this.angularProcess = (0, child_process_1.spawn)('npm', ['start'], {
                stdio: 'pipe',
                shell: true
            });
            this.angularProcess.stdout.on('data', (data) => {
                const output = data.toString();
                if (output.includes('Local:') || output.includes(`localhost:${this.options.port}`)) {
                    console.log(`✅ Aplicação Angular iniciada em http://localhost:${this.options.port}`);
                    this.isAngularRunning = true;
                    resolve();
                }
            });
            this.angularProcess.stderr.on('data', (data) => {
                const error = data.toString();
                if (error.includes('EADDRINUSE')) {
                    console.log(`⚠️  Porta ${this.options.port} já está em uso, assumindo que a aplicação já está rodando...`);
                    this.isAngularRunning = true;
                    resolve();
                }
                else if (!error.includes('webpack') && !error.includes('DevTools')) {
                    console.error('❌ Erro na aplicação Angular:', error);
                }
            });
            this.angularProcess.on('error', (error) => {
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
    async checkIfAngularIsRunning() {
        return new Promise((resolve) => {
            (0, child_process_1.exec)(`curl -s http://localhost:${this.options.port} > /dev/null`, (error) => {
                resolve(!error);
            });
        });
    }
    async waitForAngularApp() {
        // Se já verificamos que está rodando, não precisa aguardar
        if (this.isAngularRunning) {
            console.log('✅ Aplicação Angular já está pronta');
            return;
        }
        console.log('⏳ Aguardando aplicação Angular estar pronta...');
        return new Promise((resolve) => {
            let attempts = 0;
            const maxAttempts = 30; // 30 segundos máximo
            const checkApp = () => {
                attempts++;
                (0, child_process_1.exec)(`curl -s http://localhost:${this.options.port} > /dev/null`, (error) => {
                    if (!error) {
                        console.log('✅ Aplicação Angular está respondendo');
                        resolve();
                    }
                    else if (attempts < maxAttempts) {
                        setTimeout(checkApp, 1000);
                    }
                    else {
                        console.log('⚠️  Aplicação Angular pode não estar respondendo, mas continuando...');
                        resolve();
                    }
                });
            };
            checkApp();
        });
    }
    async startCypressFinal() {
        console.log('🔄 Iniciando Cypress Final...');
        return new Promise((resolve) => {
            this.cypressFinalProcess = (0, child_process_1.spawn)('npm', ['run', 'cy:final'], {
                stdio: 'pipe',
                shell: true
            });
            this.cypressFinalProcess.stdout.on('data', (data) => {
                const output = data.toString();
                if (output.includes('Cypress') || output.includes('Electron') || output.includes('DevTools')) {
                    console.log('✅ Cypress Final iniciado');
                    this.isCypressFinalRunning = true;
                    resolve();
                }
            });
            this.cypressFinalProcess.stderr.on('data', (data) => {
                const error = data.toString();
                if (error.includes('DevTools') || error.includes('WARNING')) {
                    // Ignora warnings do DevTools
                    return;
                }
                if (error.includes('Cypress') || error.includes('Electron')) {
                    console.log('✅ Cypress Final iniciado');
                    this.isCypressFinalRunning = true;
                    resolve();
                }
                else if (error.trim()) {
                    console.log('📝 Cypress Final:', error.trim());
                }
            });
            this.cypressFinalProcess.on('error', (error) => {
                console.log('⚠️  Erro ao iniciar Cypress Final:', error.message);
                console.log('⚠️  Continuando sem Cypress Final...');
                resolve();
            });
            // Timeout de 15 segundos
            setTimeout(() => {
                if (!this.isCypressFinalRunning) {
                    console.log('⚠️  Cypress Final pode não ter iniciado corretamente, mas continuando...');
                    resolve();
                }
            }, 15000);
        });
    }
    startFileWatcher() {
        console.log('👀 Iniciando watcher para arquivos cypress/e2e-ai/...');
        const watchPath = path.join(process.cwd(), 'cypress', 'e2e-ai');
        // Verifica se o diretório existe
        if (!fs.existsSync(watchPath)) {
            console.log('⚠️  Diretório cypress/e2e-ai não existe, criando...');
            fs.mkdirSync(watchPath, { recursive: true });
        }
        this.watcher = chokidar.watch(`${watchPath}/**/*.cy.{js,ts}`, {
            ignored: /(^|[\/\\])\../, // ignora arquivos ocultos
            persistent: true,
            ignoreInitial: true
        });
        this.watcher
            .on('change', (filePath) => {
            this.handleFileChange(filePath, 'modificado');
        })
            .on('add', (filePath) => {
            this.handleFileChange(filePath, 'criado');
        });
        console.log('✅ Watcher iniciado');
    }
    async handleFileChange(filePath, action) {
        const fileName = path.basename(filePath);
        const relativePath = path.relative(process.cwd(), filePath);
        // Evita executar o mesmo teste múltiplas vezes
        if (this.runningTests.has(fileName)) {
            console.log(`⏭️  Teste ${fileName} já está sendo executado, pulando...`);
            return;
        }
        console.log(`\n🔄 Arquivo ${action}: ${relativePath}`);
        console.log(`🚀 Executando teste: ${fileName}`);
        this.runningTests.add(fileName);
        try {
            await this.runCypressTest(filePath);
        }
        catch (error) {
            console.error(`❌ Erro ao executar teste ${fileName}:`, error.message);
        }
        finally {
            this.runningTests.delete(fileName);
        }
    }
    async runCypressTest(filePath) {
        return new Promise((resolve, reject) => {
            const relativePath = path.relative(process.cwd(), filePath);
            const cypressProcess = (0, child_process_1.spawn)('npx', [
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
            cypressProcess.stdout.on('data', (data) => {
                output += data.toString();
            });
            cypressProcess.stderr.on('data', (data) => {
                const error = data.toString();
                if (error.includes('Error:') || error.includes('failed')) {
                    hasError = true;
                }
                output += error;
            });
            cypressProcess.on('close', (code) => {
                if (code === 0) {
                    console.log(`✅ Teste executado com sucesso!`);
                }
                else {
                    console.log(`❌ Teste falhou (código: ${code})`);
                    hasError = true;
                }
                // Mostra apenas as últimas linhas do output para não poluir o console
                const lines = output.split('\n');
                const lastLines = lines.slice(-10).join('\n');
                if (lastLines.trim()) {
                    console.log('📝 Últimas linhas do output:');
                    console.log(lastLines);
                }
                console.log('─'.repeat(50));
                if (hasError) {
                    reject(new Error(`Teste falhou com código ${code}`));
                }
                else {
                    resolve();
                }
            });
            cypressProcess.on('error', (error) => {
                reject(error);
            });
        });
    }
    cleanup() {
        console.log('\n🔄 Parando playground...');
        if (this.watcher) {
            this.watcher.close();
            console.log('✅ Watcher parado');
        }
        if (this.cypressFinalProcess) {
            this.cypressFinalProcess.kill();
            console.log('✅ Cypress Final parado');
        }
        if (this.angularProcess) {
            this.angularProcess.kill();
            console.log('✅ Aplicação Angular parada');
        }
        console.log('👋 Playground finalizado!');
    }
}
exports.PlaygroundCommand = PlaygroundCommand;
//# sourceMappingURL=playground.js.map