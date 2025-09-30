export interface RunOptions {
    spec?: string;
    browser?: string;
    headless?: boolean;
    config?: string;
    env?: string;
    reporter?: string;
    reporterOptions?: string;
}
export declare class RunCommand {
    run(options?: RunOptions): Promise<void>;
    private isCypressInstalled;
    private hasCypressConfig;
    private buildCypressArgs;
}
//# sourceMappingURL=run.d.ts.map