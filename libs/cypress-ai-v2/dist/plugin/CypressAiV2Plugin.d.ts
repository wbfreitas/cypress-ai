export declare class CypressAiV2Plugin {
    private testGenerator;
    private config;
    constructor();
    /**
     * Carrega configuração do plugin
     */
    private loadConfig;
    /**
     * Instala o plugin no Cypress
     */
    installPlugin(on: any, config: any): any;
    /**
     * Verifica se as dependências estão disponíveis
     */
    checkDependencies(): Promise<{
        stackspot: boolean;
    }>;
}
//# sourceMappingURL=CypressAiV2Plugin.d.ts.map