import { StackSpotConfig } from '../types';
export declare class StackSpotAgent {
    private config;
    private accessToken;
    private tokenExpiry;
    constructor(config: StackSpotConfig);
    /**
     * Autentica com o StackSpot
     */
    private authenticate;
    /**
     * Gera teste usando o StackSpot
     */
    generateTest(prompt: string): Promise<string>;
    /**
     * Verifica se o agente está disponível
     */
    isAvailable(): Promise<boolean>;
}
//# sourceMappingURL=StackSpotAgent.d.ts.map