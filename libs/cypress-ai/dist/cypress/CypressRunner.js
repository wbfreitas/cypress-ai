"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.CypressRunner = void 0;
// libs/cypress-ai/src/cypress/CypressRunner.ts
const child_process = __importStar(require("child_process"));
class CypressRunner {
    /**
     * Executa um teste Cypress se o arquivo existir
     */
    async runTestIfExists(options) {
        try {
            const { specPath, baseUrl = 'http://localhost:4200' } = options;
            const absPath = require('path').resolve(specPath);
            if (!require('fs').existsSync(absPath)) {
                return { ran: false };
            }
            // Monta o comando para rodar apenas o spec existente
            const args = ['cypress', 'run', '--spec', absPath, '--config', `baseUrl=${baseUrl}`];
            // Usa npx para executar cypress a partir do projeto (garante binário local)
            const cmd = process.platform === 'win32' ? 'npx.cmd' : 'npx';
            // Roda de forma síncrona para simplificar e retornar o resultado
            const result = child_process.spawnSync(cmd, args, { encoding: 'utf8' });
            return {
                ran: true,
                status: result.status || 0,
                stdout: result.stdout || '',
                stderr: result.stderr || ''
            };
        }
        catch (error) {
            return {
                ran: false,
                error: String(error)
            };
        }
    }
    /**
     * Verifica se o Cypress está disponível
     */
    async isCypressAvailable() {
        try {
            const cmd = process.platform === 'win32' ? 'npx.cmd' : 'npx';
            const result = child_process.spawnSync(cmd, ['cypress', '--version'], { encoding: 'utf8' });
            return result.status === 0;
        }
        catch {
            return false;
        }
    }
}
exports.CypressRunner = CypressRunner;
//# sourceMappingURL=CypressRunner.js.map