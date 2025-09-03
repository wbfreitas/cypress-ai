"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VersionCommand = void 0;
class VersionCommand {
    run() {
        console.log(`
- Cypress AI CLI v0.2.0

- Informações:
  • Versão: 0.2.0
  • Node.js: ${process.version}
  • Plataforma: ${process.platform} ${process.arch}

- Dependências:
  • Cypress: ^12.0.0
  • Ollama: Local
  • TypeScript: ^5.0.0

📚 Documentação: https://github.com/seu-usuario/cypress-ai
🐛 Issues: https://github.com/seu-usuario/cypress-ai/issues
    `);
    }
}
exports.VersionCommand = VersionCommand;
//# sourceMappingURL=version.js.map