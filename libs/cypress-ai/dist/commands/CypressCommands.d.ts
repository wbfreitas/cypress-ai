import { AiCommandOptions, PromptOptions } from '../types';
export declare class CypressCommands {
    /**
     * Comando 'ai' para gerar testes usando IA
     */
    static ai(instructions: string | string[], options?: AiCommandOptions): any;
    /**
     * Comando 'prompt' para gerar testes com instruções
     */
    static prompt(steps: string | string[], options?: PromptOptions): any;
    /**
     * Comando 'runFinal' para executar o teste final e perguntar sobre substituição
     */
    static runFinal(options?: {
        baseUrl?: string;
    }): any;
}
//# sourceMappingURL=CypressCommands.d.ts.map