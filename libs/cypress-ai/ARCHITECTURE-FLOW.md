# Arquitetura do Fluxo - Cypress AI

## Diagrama do Fluxo Principal

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              CYPRESS AI FLOW                                   │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Cypress Test  │───▶│   cy.prompt()   │───▶│  TestGenerator  │
│                 │    │                 │    │                 │
│ - Instruções    │    │ - Captura HTML  │    │ - Build Prompt  │
│ - Código exist. │    │ - Passa params  │    │ - Chama Agente  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                                         │
                                                         ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   AgentFactory  │◀───│   AI Agent      │◀───│  PromptBuilder  │
│                 │    │                 │    │                 │
│ - Ollama        │    │ - Gera código   │    │ - Combina tudo  │
│ - StackSpot     │    │ - Retorna test  │    │ - Limpa output  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │
         ▼                       ▼
┌─────────────────┐    ┌─────────────────┐
│   FileManager   │    │  CypressRunner  │
│                 │    │                 │
│ - Salva arquivo │    │ - Executa test  │
│ - Lê existente  │    │ - Captura erro  │
└─────────────────┘    └─────────────────┘
                                │
                                ▼
                    ┌─────────────────┐
                    │   Auto-Retry    │
                    │                 │
                    │ - Detecta erro  │
                    │ - Build feedback│
                    │ - Tenta novamente│
                    └─────────────────┘
```

## Fluxo Detalhado

### 1. Inicialização
```
Cypress Test
    │
    ▼
cy.prompt(instructions, options)
    │
    ▼
Captura HTML da página atual
    │
    ▼
Chama TestGenerator.generateTest()
```

### 2. Geração do Teste
```
TestGenerator
    │
    ├── Determina agente (Ollama/StackSpot)
    ├── Lê código existente (se houver)
    ├── BuildPrompt.combine()
    │   ├── Instruções do usuário
    │   ├── Código existente
    │   └── HTML da página
    │
    ▼
AgentFactory.createAgent()
    │
    ├── OllamaAgent (local)
    │   └── http://localhost:11434/api/generate
    │
    └── StackSpotAgent (cloud)
        ├── Autentica: https://idm.stackspot.com
        └── Chat: https://genai-inference-app.stackspot.com
    │
    ▼
AI Agent.generateTest(prompt)
    │
    ▼
Retorna código Cypress gerado
```

### 3. Salvamento e Execução
```
TestGenerator
    │
    ├── PromptBuilder.cleanGeneratedCode()
    ├── FileManager.writeFile()
    │
    ▼
CypressRunner.runTestIfExists()
    │
    ├── Executa: npx cypress run --spec arquivo.cy.js
    ├── Captura stdout/stderr
    │
    ▼
Verifica resultado
    │
    ├── Sucesso (status === 0)
    │   └── ✅ Teste gerado e validado
    │
    └── Erro (status !== 0)
        └── 🔄 Inicia Auto-Retry
```

### 4. Sistema de Auto-Retry
```
Auto-Retry System
    │
    ├── Tentativa 1/3
    │   ├── Gera código
    │   ├── Executa teste
    │   └── ❌ Falha detectada
    │
    ├── Tentativa 2/3
    │   ├── BuildCorrectionPrompt()
    │   │   ├── Instruções originais
    │   │   ├── Código que falhou
    │   │   ├── Mensagem de erro
    │   │   ├── HTML da página
    │   │   └── Código existente
    │   ├── Chama IA novamente
    │   ├── Executa teste
    │   └── ❌ Falha detectada
    │
    └── Tentativa 3/3
        ├── BuildCorrectionPrompt() (com mais contexto)
        ├── Chama IA novamente
        ├── Executa teste
        └── ✅ Sucesso ou ❌ Falha final
```

## Componentes Principais

### TestGenerator
- **Responsabilidade**: Orquestra todo o processo de geração
- **Métodos principais**:
  - `generateTest()`: Fluxo principal
  - `generateTestWithRetry()`: Sistema de retry
  - `testGeneratedCode()`: Executa e valida teste
  - `buildCorrectionPrompt()`: Constrói feedback para IA

### AgentFactory
- **Responsabilidade**: Cria instâncias dos agentes de IA
- **Agentes suportados**:
  - `OllamaAgent`: IA local via HTTP
  - `StackSpotAgent`: IA cloud com OAuth2

### PromptBuilder
- **Responsabilidade**: Constrói prompts inteligentes
- **Funcionalidades**:
  - Combina instruções + código existente + HTML
  - Limpa código gerado pela IA
  - Constrói prompts de correção com contexto de erro

### FileManager
- **Responsabilidade**: Operações de arquivo
- **Funcionalidades**:
  - Lê código existente
  - Salva código gerado
  - Resolve caminhos

### CypressRunner
- **Responsabilidade**: Execução de testes Cypress
- **Funcionalidades**:
  - Executa testes via CLI
  - Captura output e erros
  - Retorna status de execução

## Configuração via .env

```env
# Agente de IA
AI_AGENT=ollama|stackspot

# Ollama (local)
AI_OLLAMA_BASE_URL=http://localhost:11434
AI_OLLAMA_MODEL=qwen2.5-coder:latest

# StackSpot (cloud)
STACKSPOT_REALM=stackspot-freemium
STACKSPOT_CLIENT_ID=seu-client-id
STACKSPOT_CLIENT_KEY=seu-client-key
STACKSPOT_AGENT_ID=seu-agent-id
STACKSPOT_BASE_URL=https://genai-inference-app.stackspot.com

# Sistema de Retry
CYPRESS_AI_AUTO_RETRY=true
CYPRESS_AI_MAX_RETRIES=3
CYPRESS_AI_BASE_URL=http://localhost:4200
```

## Exemplo de Uso

```javascript
// No teste Cypress
describe('Formulário de Login', () => {
  it('deve fazer login com sucesso', () => {
    cy.visit('/login');
    
    // Gera teste automaticamente
    cy.prompt([
      'Preencher email: test@example.com',
      'Preencher senha: password123',
      'Clicar no botão de login',
      'Verificar redirecionamento para dashboard'
    ]);
  });
});
```

## Fluxo de Dados

```
1. Instruções do usuário
   ↓
2. HTML da página atual
   ↓
3. Código existente (se houver)
   ↓
4. Prompt combinado
   ↓
5. Resposta da IA
   ↓
6. Código limpo
   ↓
7. Arquivo salvo
   ↓
8. Teste executado
   ↓
9. Resultado (sucesso/erro)
   ↓
10. Se erro: Feedback para IA + Retry
```

## Vantagens da Arquitetura

- **Modular**: Cada componente tem responsabilidade única
- **Extensível**: Fácil adicionar novos agentes de IA
- **Robusto**: Sistema de retry automático
- **Configurável**: Tudo via variáveis de ambiente
- **Inteligente**: IA aprende com erros e se auto-corrige
- **Flexível**: Suporta IA local (Ollama) e cloud (StackSpot)
