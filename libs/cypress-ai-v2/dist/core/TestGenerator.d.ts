import { CypressAiV2Config, TestGenerationOptions, TestGenerationResult } from '../types';
export declare class TestGenerator {
    private agent;
    private config;
    constructor(config: CypressAiV2Config);
    /**
     * Gera teste com retry automático e feedback de erro
     */
    generateTest(options: TestGenerationOptions): Promise<TestGenerationResult>;
    /**
     * Geração recursiva de teste com captura de HTML dinâmico usando JSON
     */
    private generateTestRecursive;
    /**
     * Captura contexto da página atual
     */
    private capturePageContext;
    /**
     * Constrói prompt com formato JSON para resposta estruturada
     */
    private buildPromptWithJsonFormat;
    /**
     * Constrói prompt inicial para geração do teste
     */
    private buildPrompt;
    /**
     * Constrói prompt de feedback de erro
     */
    private buildErrorFeedbackPrompt;
    /**
     * Limpa o código gerado
     */
    private cleanGeneratedCode;
    /**
     * Faz parse da resposta JSON da IA
     */
    private parseAIResponse;
    /**
     * Executa código de sugestão para capturar HTML dinâmico
     */
    private executeSuggestionCode;
    /**
     * Salva o teste no arquivo
     */
    private saveTest;
    /**
     * Testa o código gerado
     */
    private testGeneratedCode;
    /**
     * Tenta capturar HTML dinâmico quando o teste falha
     */
    private tryDynamicHtmlCapture;
    /**
     * Gera código para capturar HTML dinâmico
     */
    private generateHtmlCaptureCode;
    /**
     * Executa o código de captura e retorna o HTML
     */
    private executeHtmlCapture;
    /**
     * Executa teste Cypress e captura HTML
     */
    private runCypressTest;
    /**
     * Constrói prompt com HTML dinâmico capturado
     */
    private buildDynamicHtmlPrompt;
    /**
     * Gera caminho do arquivo de teste com nome inteligente
     */
    private generateSpecPath;
    /**
     * Gera nome de arquivo inteligente baseado nas instruções
     */
    private generateIntelligentFileName;
    /**
     * Limpa e formata o nome do arquivo
     */
    private cleanFileName;
}
//# sourceMappingURL=TestGenerator.d.ts.map