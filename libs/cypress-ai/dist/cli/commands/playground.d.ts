export interface PlaygroundOptions {
    port?: string;
    cypressFinal?: boolean;
    watch?: boolean;
}
export declare class PlaygroundCommand {
    private angularProcess;
    private cypressFinalProcess;
    private isAngularRunning;
    private isCypressFinalRunning;
    private watcher;
    private runningTests;
    private options;
    constructor();
    run(options?: PlaygroundOptions): Promise<void>;
    private startAngularApp;
    private checkIfAngularIsRunning;
    private waitForAngularApp;
    private startCypressFinal;
    private startFileWatcher;
    private handleFileChange;
    private runCypressTest;
    private cleanup;
}
//# sourceMappingURL=playground.d.ts.map