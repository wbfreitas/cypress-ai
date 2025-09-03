# Diagrama de Classes - Cypress AI

## Arquitetura Orientada a Objetos

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              CYPRESS AI CLASSES                               │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────┐
│                                CYPRESS LAYER                                  │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────┐
│ CypressCommands │
│                 │
│ + ai()          │
│ + prompt()      │
│ + runFinal()    │
└─────────────────┘

┌─────────────────┐
│ CypressAiPlugin │
│                 │
│ + setupNodeEvents│
│ + registerTasks │
└─────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────┐
│                                CORE LAYER                                     │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────┐
│ TestGenerator   │
│                 │
│ - fileManager   │
│ - promptBuilder │
│ - cypressRunner │
│                 │
│ + generateTest()│
│ + generateTestWithRetry()│
│ + testGeneratedCode()│
│ + buildCorrectionPrompt()│
└─────────────────┘

┌─────────────────┐
│ PromptBuilder   │
│                 │
│ + buildPrompt() │
│ + cleanGeneratedCode()│
└─────────────────┘

┌─────────────────┐
│ FileManager     │
│                 │
│ + readFileIfExists()│
│ + writeFile()   │
│ + resolvePath() │
└─────────────────┘

┌─────────────────┐
│ CypressRunner   │
│                 │
│ + runTestIfExists()│
│ + runTest()     │
└─────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────┐
│                               AGENT LAYER                                     │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────┐
│ AgentFactory    │
│                 │
│ + createAgent() │
│ + getAvailableAgents()│
└─────────────────┘

┌─────────────────┐
│ IAgent          │
│ (interface)     │
│                 │
│ + generateTest()│
│ + isAvailable() │
└─────────────────┘

┌─────────────────┐
│ OllamaAgent     │
│                 │
│ - apiBase       │
│ - defaultModel  │
│                 │
│ + generateTest()│
│ + isAvailable() │
└─────────────────┘

┌─────────────────┐
│ StackSpotAgent  │
│                 │
│ - config        │
│                 │
│ + generateTest()│
│ + authenticate()│
│ + chatWithAgent()│
│ + extractResponse()│
│ + isAvailable() │
└─────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────┐
│                                CLI LAYER                                      │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────┐
│ SetupCommand    │
│                 │
│ + run()         │
│ + selectAgent() │
│ + configureAgentVariables()│
│ + createEnvFile()│
│ + configureCypressConfig()│
└─────────────────┘

┌─────────────────┐
│ PlaygroundCommand│
│                 │
│ + run()         │
│ + startAngularApp()│
│ + startCypressFinal()│
│ + startWatcher()│
│ + handleFileChange()│
└─────────────────┘

┌─────────────────┐
│ RunCommand      │
│                 │
│ + run()         │
│ + verifyProject()│
│ + loadEnvConfig()│
│ + executeTests()│
└─────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────┐
│                              FLOW SEQUENCE                                    │
└─────────────────────────────────────────────────────────────────────────────────┘

1. CypressCommands.ai()
   │
   ├── Captura HTML da página
   ├── Chama TestGenerator.generateTest()
   │
   └── TestGenerator
       │
       ├── Determina agente via AgentFactory
       ├── Lê código existente via FileManager
       ├── Constrói prompt via PromptBuilder
       ├── Chama agente (Ollama/StackSpot)
       ├── Salva código via FileManager
       ├── Executa teste via CypressRunner
       │
       └── Se erro: Auto-Retry
           │
           ├── BuildCorrectionPrompt()
           ├── Chama agente novamente
           ├── Executa teste corrigido
           └── Repete até sucesso ou limite

2. AgentFactory.createAgent()
   │
   ├── Se 'ollama': new OllamaAgent()
   └── Se 'stackspot': new StackSpotAgent()

3. OllamaAgent.generateTest()
   │
   ├── POST /api/generate
   ├── Processa resposta
   └── Retorna código limpo

4. StackSpotAgent.generateTest()
   │
   ├── authenticate() → JWT
   ├── chatWithAgent() → Resposta
   ├── extractResponse() → Código
   └── Retorna código limpo

5. Auto-Retry System
   │
   ├── Detecta erro na execução
   ├── buildCorrectionPrompt()
   │   ├── Instruções originais
   │   ├── Código que falhou
   │   ├── Mensagem de erro
   │   ├── HTML da página
   │   └── Código existente
   ├── Chama agente com feedback
   ├── Executa teste corrigido
   └── Repete até sucesso ou max tentativas

┌─────────────────────────────────────────────────────────────────────────────────┐
│                              CONFIGURATION                                    │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────┐
│ .env File       │
│                 │
│ AI_AGENT        │
│ AI_OLLAMA_MODEL │
│ AI_OLLAMA_BASE_URL│
│ STACKSPOT_REALM │
│ STACKSPOT_CLIENT_ID│
│ STACKSPOT_CLIENT_KEY│
│ STACKSPOT_AGENT_ID│
│ CYPRESS_AI_AUTO_RETRY│
│ CYPRESS_AI_MAX_RETRIES│
└─────────────────┘

┌─────────────────┐
│ cypress.config.ts│
│                 │
│ setupNodeEvents │
│ installCypressAiPlugin│
└─────────────────┘

┌─────────────────┐
│ package.json    │
│                 │
│ Scripts:        │
│ - cy:ai:run     │
│ - cy:final      │
└─────────────────┘
