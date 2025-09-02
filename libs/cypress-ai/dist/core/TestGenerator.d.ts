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
     * Executa um teste se ele existir
     */
    runTestIfExists(options: RunTestOptions): Promise<RunTestResult>;
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