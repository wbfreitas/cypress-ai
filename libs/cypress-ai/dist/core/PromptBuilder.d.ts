export declare class PromptBuilder {
    /**
     * Constrói o prompt para geração de testes Cypress
     */
    buildPrompt(instructions: string | string[], existingTest: string, html: string): string;
    /**
     * Limpa o código retornado pela IA removendo markdown
     */
    cleanGeneratedCode(code: string): string;
}
//# sourceMappingURL=PromptBuilder.d.ts.map