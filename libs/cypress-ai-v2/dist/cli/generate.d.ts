export interface GenerateOptions {
    spec?: string;
    browser?: string;
    headless?: boolean;
    config?: string;
    env?: string;
    reporter?: string;
    reporterOptions?: string;
}
export declare class GenerateCommand {
    run(options?: GenerateOptions): Promise<void>;
    private isCypressInstalled;
    private hasCypressConfig;
    private buildCypressArgs;
}
//# sourceMappingURL=generate.d.ts.map