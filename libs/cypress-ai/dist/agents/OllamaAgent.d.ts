export declare class OllamaAgent {
    private readonly apiBase;
    private readonly defaultModel;
    constructor(apiBase?: string, defaultModel?: string);
    /**
     * Gera código de teste usando o Ollama
     */
    generateTest(prompt: string, model?: string): Promise<string>;
    /**
     * Verifica se o agente está disponível
     */
    isAvailable(): Promise<boolean>;
}
//# sourceMappingURL=OllamaAgent.d.ts.map