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
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CypressRunner = exports.OllamaAgent = exports.AgentFactory = exports.CypressCommands = exports.CommandRegistry = exports.CypressAiPlugin = exports.PromptBuilder = exports.FileManager = exports.TestGenerator = exports.installCypressAiPlugin = exports.autoRegisterCommands = exports.registerSupportCommands = void 0;
// libs/cypress-ai/src/index.ts
var commands_1 = require("./commands");
Object.defineProperty(exports, "registerSupportCommands", { enumerable: true, get: function () { return commands_1.registerSupportCommands; } });
Object.defineProperty(exports, "autoRegisterCommands", { enumerable: true, get: function () { return commands_1.autoRegisterCommands; } });
var agent_1 = require("./agent");
Object.defineProperty(exports, "installCypressAiPlugin", { enumerable: true, get: function () { return agent_1.installCypressAiPlugin; } });
// Exportações das classes principais para uso avançado
var TestGenerator_1 = require("./core/TestGenerator");
Object.defineProperty(exports, "TestGenerator", { enumerable: true, get: function () { return TestGenerator_1.TestGenerator; } });
var FileManager_1 = require("./core/FileManager");
Object.defineProperty(exports, "FileManager", { enumerable: true, get: function () { return FileManager_1.FileManager; } });
var PromptBuilder_1 = require("./core/PromptBuilder");
Object.defineProperty(exports, "PromptBuilder", { enumerable: true, get: function () { return PromptBuilder_1.PromptBuilder; } });
var CypressAiPlugin_1 = require("./plugin/CypressAiPlugin");
Object.defineProperty(exports, "CypressAiPlugin", { enumerable: true, get: function () { return CypressAiPlugin_1.CypressAiPlugin; } });
var CommandRegistry_1 = require("./commands/CommandRegistry");
Object.defineProperty(exports, "CommandRegistry", { enumerable: true, get: function () { return CommandRegistry_1.CommandRegistry; } });
var CypressCommands_1 = require("./commands/CypressCommands");
Object.defineProperty(exports, "CypressCommands", { enumerable: true, get: function () { return CypressCommands_1.CypressCommands; } });
var AgentFactory_1 = require("./agents/AgentFactory");
Object.defineProperty(exports, "AgentFactory", { enumerable: true, get: function () { return AgentFactory_1.AgentFactory; } });
var OllamaAgent_1 = require("./agents/OllamaAgent");
Object.defineProperty(exports, "OllamaAgent", { enumerable: true, get: function () { return OllamaAgent_1.OllamaAgent; } });
var CypressRunner_1 = require("./cypress/CypressRunner");
Object.defineProperty(exports, "CypressRunner", { enumerable: true, get: function () { return CypressRunner_1.CypressRunner; } });
// Exportações dos tipos
__exportStar(require("./types"), exports);
//# sourceMappingURL=index.js.map