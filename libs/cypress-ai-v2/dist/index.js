"use strict";
// libs/cypress-ai-v2/src/index.ts
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
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CypressAiV2Plugin = exports.StackSpotAgent = exports.TestGenerator = exports.CypressCommands = exports.installCypressAiV2 = void 0;
exports.registerCommands = registerCommands;
// Exportações principais
var installCypressAiV2_1 = require("./plugin/installCypressAiV2");
Object.defineProperty(exports, "installCypressAiV2", { enumerable: true, get: function () { return installCypressAiV2_1.installCypressAiV2; } });
var CypressCommands_1 = require("./commands/CypressCommands");
Object.defineProperty(exports, "CypressCommands", { enumerable: true, get: function () { return CypressCommands_1.CypressCommands; } });
// Exportações para uso avançado
var TestGenerator_1 = require("./core/TestGenerator");
Object.defineProperty(exports, "TestGenerator", { enumerable: true, get: function () { return TestGenerator_1.TestGenerator; } });
var StackSpotAgent_1 = require("./agents/StackSpotAgent");
Object.defineProperty(exports, "StackSpotAgent", { enumerable: true, get: function () { return StackSpotAgent_1.StackSpotAgent; } });
var CypressAiV2Plugin_1 = require("./plugin/CypressAiV2Plugin");
Object.defineProperty(exports, "CypressAiV2Plugin", { enumerable: true, get: function () { return CypressAiV2Plugin_1.CypressAiV2Plugin; } });
// Exportações dos tipos
__exportStar(require("./types"), exports);
// Função de registro automático dos comandos
function registerCommands() {
    // Esta função será chamada pelo arquivo de suporte do Cypress
    // O registro real acontece no arquivo de comandos
}
//# sourceMappingURL=index.js.map