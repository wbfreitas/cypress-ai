export declare class FileManager {
    /**
     * Garante que o diretório existe, criando-o se necessário
     */
    ensureDirectoryExists(filePath: string): void;
    /**
     * Lê o conteúdo de um arquivo se ele existir
     */
    readFileIfExists(filePath: string): string;
    /**
     * Escreve conteúdo em um arquivo
     */
    writeFile(filePath: string, content: string): void;
    /**
     * Verifica se um arquivo existe
     */
    fileExists(filePath: string): boolean;
    /**
     * Resolve o caminho absoluto de um arquivo
     */
    resolvePath(filePath: string): string;
}
//# sourceMappingURL=FileManager.d.ts.map