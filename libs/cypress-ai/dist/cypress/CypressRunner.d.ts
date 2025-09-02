import { RunTestOptions, RunTestResult } from '../types';
export declare class CypressRunner {
    /**
     * Executa um teste Cypress se o arquivo existir
     */
    runTestIfExists(options: RunTestOptions): Promise<RunTestResult>;
    /**
     * Verifica se o Cypress está disponível
     */
    isCypressAvailable(): Promise<boolean>;
}
//# sourceMappingURL=CypressRunner.d.ts.map