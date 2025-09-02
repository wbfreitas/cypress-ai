// libs/cypress-ai/src/core/FileManager.ts
import * as fs from 'fs';
import * as path from 'path';

export class FileManager {
  /**
   * Garante que o diretório existe, criando-o se necessário
   */
  ensureDirectoryExists(filePath: string): void {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  /**
   * Lê o conteúdo de um arquivo se ele existir
   */
  readFileIfExists(filePath: string): string {
    return fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf8') : '';
  }

  /**
   * Escreve conteúdo em um arquivo
   */
  writeFile(filePath: string, content: string): void {
    this.ensureDirectoryExists(filePath);
    fs.writeFileSync(filePath, content, 'utf8');
  }

  /**
   * Verifica se um arquivo existe
   */
  fileExists(filePath: string): boolean {
    return fs.existsSync(filePath);
  }

  /**
   * Resolve o caminho absoluto de um arquivo
   */
  resolvePath(filePath: string): string {
    return path.resolve(filePath);
  }
}

