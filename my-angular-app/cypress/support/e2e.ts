// // cypress/support/e2e.ts
// import '@testing-library/cypress/add-commands'
// import { registerAiCommands } from 'cypress-ai'

// // registre com opções padrão (Ollama via proxy /api)
// registerAiCommands({
//   agent: 'ollama',          // ou 'openai', 'bedrock' etc. quando você estender
//   model: 'qwen2.5-coder:latest',
//   apiBase: '/api',          // bate no proxy do Angular (proxy.conf.json)
//   finalDir: 'cypress/e2e-final', // onde os testes prontos ficam
//   aiDir: 'cypress/e2e-ai'        // onde os specs “IA” vivem
// })
import '@testing-library/cypress/add-commands'
require('cypress-ai/src/commands')
export {}