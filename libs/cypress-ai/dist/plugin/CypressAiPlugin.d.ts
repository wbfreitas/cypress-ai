import { CypressAiConfig } from '../types';
export declare class CypressAiPlugin {
    private testGenerator;
    private config;
    constructor(config?: CypressAiConfig);
    /**
     * Instala o plugin no Cypress
     */
    installPlugin(on: any, config: any): any;
    /**
     * Verifica se as dependências estão disponíveis
     */
    checkDependencies(): Promise<{
        cypress: boolean;
        agent: boolean;
    }>;
    /**
     * Atualiza a configuração do plugin
     */
    updateConfig(newConfig: Partial<CypressAiConfig>): void;
}
//# sourceMappingURL=CypressAiPlugin.d.ts.map