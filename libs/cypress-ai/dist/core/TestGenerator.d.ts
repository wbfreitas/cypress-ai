import { GenerateTestOptions, RunTestOptions, RunTestResult, CypressAiConfig } from '../types';
export declare class TestGenerator {
    private fileManager;
    private promptBuilder;
    private cypressRunner;
    constructor();
    /**
     * Gera um teste baseado nas instruções fornecidas
     */
    generateTest(options: GenerateTestOptions, config?: CypressAiConfig): Promise<boolean>;
    /**
     * Gera teste com sistema de retry automático
     */
    private generateTestWithRetry;
    /**
     * Testa o código gerado executando-o
     */
    private testGeneratedCode;
    /**
     * Constrói prompt de correção com feedback do erro
     */
    private buildCorrectionPrompt;
    /**
     * Executa um teste se ele existir
     */
    runTestIfExists(options: RunTestOptions): Promise<RunTestResult>;
    /**
     * Executa o teste final e pergunta ao usuário se quer substituir o teste AI
     */
    runFinalTestAndAsk(options: {
        specPath: string;
        aiSpecPath: string;
        baseUrl?: string;
    }): Promise<any>;
    /**
     * Verifica se os componentes necessários estão disponíveis
     */
    checkDependencies(): Promise<{
        cypress: boolean;
        agent: boolean;
    }>;
    private checkAgentAvailability;
}
//# sourceMappingURL=TestGenerator.d.ts.map