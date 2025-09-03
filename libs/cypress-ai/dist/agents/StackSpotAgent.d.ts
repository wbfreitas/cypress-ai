export interface StackSpotConfig {
    realm: string;
    clientId: string;
    clientKey: string;
    agentId: string;
    baseUrl?: string;
}
export interface StackSpotResponse {
    message: string;
    status: string;
    timestamp: string;
    [key: string]: any;
}
export declare class StackSpotAgent {
    private config;
    constructor(config: StackSpotConfig);
    generateTest(prompt: string): Promise<string>;
    private authenticate;
    private chatWithAgent;
    private extractResponse;
    validateConfig(): {
        valid: boolean;
        errors: string[];
    };
    isAvailable(): Promise<boolean>;
}
//# sourceMappingURL=StackSpotAgent.d.ts.map