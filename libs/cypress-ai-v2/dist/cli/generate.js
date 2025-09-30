"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenerateCommand = void 0;
// libs/cypress-ai-v2/src/cli/generate.ts
const child_process_1 = require("child_process");
const fs_1 = require("fs");
const path_1 = require("path");
class GenerateCommand {
    async run(options = {}) {
        console.log('Cypress AI v2.0 - Executando testes de geração (e2e-ai)...');
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
        const cypress = (0, child_process_1.spawn)('npx', ['cypress', 'run', ...cypressArgs], {
            stdio: 'inherit',
            shell: true
        });
        cypress.on('close', (code) => {
            if (code === 0) {
                console.log('Testes de geração executados com sucesso!');
            }
            else {
                console.error(`Testes de geração falharam com código: ${code}`);
                process.exit(code || 1);
            }
        });
        cypress.on('error', (error) => {
            console.error('Erro ao executar Cypress:', error);
            process.exit(1);
        });
    }
    isCypressInstalled() {
        try {
            const packageJsonPath = (0, path_1.join)(process.cwd(), 'package.json');
            if (!(0, fs_1.existsSync)(packageJsonPath)) {
                return false;
            }
            const packageJson = require(packageJsonPath);
            return !!(packageJson.dependencies?.cypress || packageJson.devDependencies?.cypress);
        }
        catch {
            return false;
        }
    }
    hasCypressConfig() {
        const configFiles = [
            'cypress.config.ts',
            'cypress.config.js',
            'cypress.json'
        ];
        return configFiles.some(file => (0, fs_1.existsSync)((0, path_1.join)(process.cwd(), file)));
    }
    buildCypressArgs(options) {
        const args = [];
        // Se não especificou um arquivo específico, usa a pasta e2e-ai por padrão
        if (options.spec) {
            args.push('--spec', options.spec);
        }
        else {
            // Usa a pasta e2e-ai por padrão
            args.push('--spec', '"cypress/e2e-ai/**/*.cy.{js,ts}"');
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
exports.GenerateCommand = GenerateCommand;
//# sourceMappingURL=generate.js.map