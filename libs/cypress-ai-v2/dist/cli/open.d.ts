export interface OpenOptions {
    spec?: string;
    browser?: string;
    config?: string;
    env?: string;
    global?: boolean;
}
export declare class OpenCommand {
    run(options?: OpenOptions): Promise<void>;
    private isCypressInstalled;
    private hasCypressConfig;
    private buildCypressArgs;
}
//# sourceMappingURL=open.d.ts.map