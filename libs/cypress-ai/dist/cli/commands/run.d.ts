export interface RunOptions {
    spec?: string;
    port?: string;
    headless?: boolean;
    browser?: string;
}
export declare class RunCommand {
    private options;
    constructor();
    run(options?: RunOptions): Promise<void>;
    private checkProject;
    private checkEnvFile;
    private runTests;
}
//# sourceMappingURL=run.d.ts.map