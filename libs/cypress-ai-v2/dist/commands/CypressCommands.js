"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CypressCommands = void 0;
class CypressCommands {
    /**
     * Comando único 'cy.ai()' - VERSÃO 2.0 SIMPLIFICADA
     *
     * Uso: cy.ai('Teste o botão de login')
     * Uso: cy.ai(['Teste login', 'Teste logout'])
     * Uso: cy.ai('Teste o modal', { updateFinal: true })
     */
    static ai(instructions, options = {}) {
        console.log('Cypress AI v2.0 - Gerando teste...');
        return cy.document().then((doc) => {
            // Captura contexto completo da página
            const context = CypressCommands.capturePageContext(doc);
            // Prepara opções
            const testOptions = {
                instructions,
                context,
                specPath: options.specPath
            };
            // Chama o plugin para gerar o teste
            return cy.task('cypress-ai-v2:generate', testOptions, { timeout: 120000 })
                .then((result) => {
                if (result.success) {
                    console.log('Teste gerado com sucesso!');
                    console.log(`Arquivo: ${result.testPath}`);
                    if (result.retryCount > 0) {
                        console.log(`Tentativas: ${result.retryCount}`);
                    }
                }
                else {
                    console.error('Falha na geração do teste:', result.error);
                }
                return result;
            });
        });
    }
    /**
     * Captura contexto completo da página
     */
    static capturePageContext(doc) {
        const html = doc.documentElement.outerHTML;
        const url = doc.URL;
        const title = doc.title;
        const timestamp = new Date().toISOString();
        // Captura informações importantes da página
        const buttons = Array.from(doc.querySelectorAll('button')).map((btn) => ({
            text: btn.textContent?.trim(),
            id: btn.id,
            className: btn.className,
            visible: btn.offsetParent !== null
        }));
        const inputs = Array.from(doc.querySelectorAll('input')).map((input) => ({
            type: input.type,
            id: input.id,
            placeholder: input.placeholder,
            visible: input.offsetParent !== null
        }));
        const links = Array.from(doc.querySelectorAll('a')).map((link) => ({
            text: link.textContent?.trim(),
            href: link.href,
            visible: link.offsetParent !== null
        }));
        // Constrói contexto estruturado
        const context = `<!-- CONTEXTO DA PÁGINA CAPTURADO EM ${timestamp} -->
<!-- URL: ${url} -->
<!-- TÍTULO: ${title} -->

<!-- BOTÕES ENCONTRADOS: -->
${buttons.map(btn => `<!-- Botão: "${btn.text}" (id: ${btn.id}, classe: ${btn.className}, visível: ${btn.visible}) -->`).join('\n')}

<!-- INPUTS ENCONTRADOS: -->
${inputs.map(input => `<!-- Input: tipo="${input.type}" (id: ${input.id}, placeholder: ${input.placeholder}, visível: ${input.visible}) -->`).join('\n')}

<!-- LINKS ENCONTRADOS: -->
${links.map(link => `<!-- Link: "${link.text}" (href: ${link.href}, visível: ${link.visible}) -->`).join('\n')}

<!-- HTML COMPLETO: -->
${html}`;
        return context;
    }
}
exports.CypressCommands = CypressCommands;
// Registra o comando no Cypress
if (typeof Cypress !== 'undefined') {
    Cypress.Commands.add('ai', CypressCommands.ai);
}
//# sourceMappingURL=CypressCommands.js.map