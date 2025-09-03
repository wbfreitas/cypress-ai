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
exports.RunCommand = void 0;
const child_process_1 = require("child_process");
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
const dotenv = __importStar(require("dotenv"));
// Carregar arquivo .env se existir
const envPath = path.join(process.cwd(), '.env');
try {
    dotenv.config({ path: envPath });
}
catch (error) {
    // Ignorar erro se arquivo .env não existir
}
class RunCommand {
    constructor() {
        this.options = {};
    }
    async run(options = {}) {
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
        }
        catch (error) {
            console.error('❌ Erro ao executar testes:', error.message);
            process.exit(1);
        }
    }
    async checkProject() {
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
    async checkEnvFile() {
        console.log('🔍 Verificando arquivo .env...');
        const envPath = path.join(process.cwd(), '.env');
        if (!fs.existsSync(envPath)) {
            console.log('⚠️  Arquivo .env não encontrado. Execute "cyai setup" primeiro.');
            console.log('ℹ️  Continuando com configurações padrão...');
        }
        else {
            console.log('✅ Arquivo .env encontrado');
        }
    }
    async runTests() {
        console.log('🧪 Executando testes...');
        const baseUrl = `http://localhost:${this.options.port}`;
        const args = [
            'cypress', 'run',
            '--config', `baseUrl=${baseUrl}`,
            '--browser', this.options.browser
        ];
        if (this.options.headless) {
            args.push('--headless');
        }
        if (this.options.spec) {
            args.push('--spec', this.options.spec);
        }
        console.log(`📝 Comando: npx ${args.join(' ')}`);
        return new Promise((resolve, reject) => {
            const cypressProcess = (0, child_process_1.spawn)('npx', args, {
                stdio: 'inherit',
                shell: true
            });
            cypressProcess.on('close', (code) => {
                if (code === 0) {
                    console.log('\n✅ Testes executados com sucesso!');
                    resolve();
                }
                else {
                    console.log(`\n❌ Testes falharam com código: ${code}`);
                    reject(new Error(`Testes falharam com código ${code}`));
                }
            });
            cypressProcess.on('error', (error) => {
                reject(error);
            });
        });
    }
}
exports.RunCommand = RunCommand;
//# sourceMappingURL=run.js.map