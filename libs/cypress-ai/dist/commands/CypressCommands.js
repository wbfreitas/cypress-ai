"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CypressCommands = void 0;
class CypressCommands {
    /**
     * Comando 'ai' para gerar testes usando IA
     */
    static ai(instructions, options = {}) {
        const specName = (Cypress.spec?.name || 'ai-generated.cy.js')
            .replace(/\.cy\.(ts|js)$/i, '.cy.js');
        const finalDir = options.finalDir || 'cypress/e2e-final';
        const specPath = `${finalDir}/${specName}`;
        const agent = options.agent || 'ollama';
        const model = options.model || 'qwen2.5-coder:latest';
        return cy.document().then((doc) => {
            const html = doc.documentElement.outerHTML;
            // Apenas gera o teste, não executa mais automaticamente
            return cy.task('cypress-ai:generate', {
                instructions,
                html,
                specPath,
                agent,
                model
            });
        });
    }
    /**
     * Comando 'prompt' para gerar testes com instruções
     */
    static prompt(steps, options = { skip: false }) {
        if (options.skip) {
            return cy.wrap(null);
        }
        const text = Array.isArray(steps) ? steps.join('\n') : String(steps);
        return CypressCommands.ai(text, options);
    }
    /**
     * Comando 'runFinal' para executar o teste final e perguntar sobre substituição
     */
    static runFinal(options = {}) {
        const specName = (Cypress.spec?.name || 'ai-generated.cy.js')
            .replace(/\.cy\.(ts|js)$/i, '.cy.js');
        const finalDir = 'cypress/e2e-final';
        const aiDir = 'cypress/e2e-ai';
        const finalSpecPath = `${finalDir}/${specName}`;
        const aiSpecPath = `${aiDir}/${specName}`;
        const baseUrl = options.baseUrl || Cypress.config('baseUrl');
        return cy.task('cypress-ai:run-final-and-ask', {
            specPath: finalSpecPath,
            aiSpecPath: aiSpecPath,
            baseUrl: baseUrl
        });
    }
}
exports.CypressCommands = CypressCommands;
//# sourceMappingURL=CypressCommands.js.map