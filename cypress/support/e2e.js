// Importa os comandos padrão do Cypress
import '@testing-library/cypress/add-commands';

// Registra os comandos personalizados da biblioteca IA
const { registerAiCommands } = require('../../libs/cypress-ai/src/commands');
registerAiCommands();

// Exemplo: após cada teste, pode-se fazer logout ou limpar dados, se necessário.