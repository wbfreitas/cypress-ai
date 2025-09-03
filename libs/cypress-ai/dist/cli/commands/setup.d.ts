export interface SetupOptions {
    model?: string;
    baseUrl?: string;
    aiDir?: string;
    finalDir?: string;
    port?: string;
    force?: boolean;
    agent?: string;
    interactive?: boolean;
    ollamaBaseUrl?: string;
    stackspotRealm?: string;
    stackspotClientId?: string;
    stackspotClientKey?: string;
    stackspotAgentId?: string;
    stackspotBaseUrl?: string;
}
export declare class SetupCommand {
    private options;
    constructor();
    run(options?: SetupOptions): Promise<void>;
    private checkAngularProject;
    private selectAgent;
    private configureAgentVariables;
    private askQuestion;
    private createEnvFile;
    private configureCypressConfig;
    private createSupportFile;
    private createDirectories;
    private updatePackageJson;
    private installDependencies;
}
//# sourceMappingURL=setup.d.ts.map