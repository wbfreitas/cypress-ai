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
        const runExisting = options.runExisting !== false; // default true
        const stopOnExistingFailure = options.stopOnExistingFailure === true;
        return cy.document().then((doc) => {
            const html = doc.documentElement.outerHTML;
            // Se habilitado, tenta rodar o spec final existente antes de gerar
            if (runExisting) {
                return cy.task('cypress-ai:run-if-exists', {
                    specPath,
                    baseUrl: Cypress.config('baseUrl')
                }).then((res) => {
                    if (res && res.ran && typeof res.status !== 'undefined' && res.status !== 0) {
                        // Falha ao executar o spec existente
                        if (stopOnExistingFailure) {
                            throw new Error(`Spec existente falhou (status=${res.status}). Aborting as requested.`);
                        }
                        // Senão, apenas logamos e continuamos para gerar
                        // eslint-disable-next-line no-console
                        console.warn('Spec existente falhou, mas continuando para geração:', res.stderr || res.stdout);
                    }
                    // Prossegue com a geração
                    return cy.task('cypress-ai:generate', {
                        instructions,
                        html,
                        specPath,
                        agent,
                        model
                    });
                });
            }
            // Se não rodar existente, apenas gera
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
}
exports.CypressCommands = CypressCommands;
//# sourceMappingURL=CypressCommands.js.map