import { TestGenerationOptions } from '../types';
export declare class CypressCommands {
    /**
     * Comando único 'cy.ai()' - VERSÃO 2.0 SIMPLIFICADA
     *
     * Uso: cy.ai('Teste o botão de login')
     * Uso: cy.ai(['Teste login', 'Teste logout'])
     * Uso: cy.ai('Teste o modal', { updateFinal: true })
     */
    static ai(instructions: string | string[], options?: Partial<TestGenerationOptions>): any;
    /**
     * Captura contexto completo da página
     */
    private static capturePageContext;
}
//# sourceMappingURL=CypressCommands.d.ts.map