# Cypress AI - Biblioteca TypeScript

Uma biblioteca TypeScript para gerar testes E2E do Cypress usando IA (Ollama ou StackSpot) com arquitetura orientada a objetos.

## 🚀 Funcionalidades

- **Geração de Testes com IA**: Gera testes Cypress automaticamente baseado em instruções em português
- **Arquitetura Orientada a Objetos**: Código bem estruturado e fácil de manter
- **Execução de Testes Finais**: Executa testes gerados e permite substituição do teste AI
- **Múltiplos Agentes de IA**: Suporte ao Ollama (local) e StackSpot (cloud)
- **TypeScript**: Tipagem completa e IntelliSense
- **CLI Global**: Comando `cyai` para uso em qualquer projeto
- **Playground Automatizado**: Ambiente de desenvolvimento completo

## 📦 Instalação

### Instalação Global (CLI) - Recomendado
```bash
# Instalar globalmente
npm install -g cypress-ai

# Configurar projeto Angular
cd meu-projeto-angular
cyai setup

# Iniciar desenvolvimento
cyai playground
```

### Uso com npx (sem instalação)
```bash
# Configurar projeto
npx cypress-ai setup

# Iniciar playground
npx cypress-ai playground
```

### Instalação Local (Biblioteca)
```bash
npm install cypress-ai
```

### Instalação Manual (Desenvolvimento)
```bash
git clone <seu-repositorio>
cd cypress-ai
npm install
npm run build
npm install -g .
```

## ⚙️ Configuração Automática

### Comando `cyai setup`

O comando setup automatiza toda a configuração:

```bash
# Configuração básica (modo interativo)
cyai setup

# Configuração com StackSpot
cyai setup --agent stackspot

# Configuração com Ollama e modelo específico
cyai setup --agent ollama --model llama2 --port 3000
```

**O que o setup faz:**
- ✅ Cria arquivo `.env` com configurações LLM
- ✅ Configura `cypress.config.ts` automaticamente
- ✅ Cria `cypress/support/e2e.ts` se não existir
- ✅ Cria diretórios `cypress/e2e-ai/` e `cypress/e2e-final/`
- ✅ Atualiza `package.json` com scripts necessários
- ✅ Instala dependências automaticamente (incluindo `dotenv`)

**Integração com .env:**
A lib carrega automaticamente o arquivo `.env` e usa as variáveis para configuração:
- `AI_OLLAMA_MODEL`: Modelo do Ollama
- `AI_OLLAMA_BASE_URL`: URL base do Ollama
- `CYPRESS_AI_PORT`: Porta da aplicação Angular
- `CYPRESS_AI_DIR`: Diretório dos testes AI
- `CYPRESS_FINAL_DIR`: Diretório dos testes finais

### Configuração Manual (se necessário)

```typescript
// cypress.config.ts
import { defineConfig } from 'cypress'
const { installCypressAiPlugin } = require('cypress-ai/dist/agent')

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:4200',
    supportFile: 'cypress/support/e2e.ts',
    specPattern: [
      'cypress/e2e-ai/**/*.cy.{js,ts}',
      'cypress/e2e-final/**/*.cy.{js,ts}'
    ],
    setupNodeEvents(on, config) {
      // A lib carrega automaticamente o arquivo .env
      return installCypressAiPlugin(on, config, { 
        model: process.env.AI_OLLAMA_MODEL || 'qwen2.5-coder:latest',
        baseUrl: process.env.AI_OLLAMA_BASE_URL || 'http://localhost:11434'
      })
    },
    video: false
  }
})
```

```typescript
// cypress/support/e2e.ts
import '@testing-library/cypress/add-commands'
require('cypress-ai/dist/commands').registerSupportCommands()
export {}
```

## 🔧 Arquivo .env

A lib carrega automaticamente o arquivo `.env` para configuração. Você pode personalizar as configurações editando este arquivo:

```env
# Cypress AI Configuration
# Agent Configuration
AI_AGENT=ollama

# Project Configuration
CYPRESS_AI_BASE_URL=http://localhost:4200
CYPRESS_AI_PORT=4200

# Directory Configuration
CYPRESS_AI_DIR=cypress/e2e-ai
CYPRESS_FINAL_DIR=cypress/e2e-final

# Ollama Configuration (se AI_AGENT=ollama)
AI_OLLAMA_BASE_URL=http://localhost:11434
AI_OLLAMA_MODEL=qwen2.5-coder:latest

# StackSpot Configuration (se AI_AGENT=stackspot)
STACKSPOT_REALM=seu-realm
STACKSPOT_CLIENT_ID=seu-client-id
STACKSPOT_CLIENT_KEY=seu-client-key
STACKSPOT_AGENT_ID=seu-agent-id
STACKSPOT_BASE_URL=https://genai-inference-app.stackspot.com

# Optional: Custom prompts
# CYPRESS_AI_SYSTEM_PROMPT=Você é um especialista em testes E2E com Cypress.
```

### Variáveis Disponíveis

#### Configuração Geral
| Variável | Descrição | Padrão |
|----------|-----------|--------|
| `AI_AGENT` | Agente de IA a usar (ollama ou stackspot) | `ollama` |
| `CYPRESS_AI_BASE_URL` | URL base da aplicação | `http://localhost:4200` |
| `CYPRESS_AI_PORT` | Porta da aplicação Angular | `4200` |
| `CYPRESS_AI_DIR` | Diretório dos testes AI | `cypress/e2e-ai` |
| `CYPRESS_FINAL_DIR` | Diretório dos testes finais | `cypress/e2e-final` |

#### Ollama (se AI_AGENT=ollama)
| Variável | Descrição | Padrão |
|----------|-----------|--------|
| `AI_OLLAMA_MODEL` | Modelo do Ollama a usar | `qwen2.5-coder:latest` |
| `AI_OLLAMA_BASE_URL` | URL base do Ollama | `http://localhost:11434` |

#### StackSpot (se AI_AGENT=stackspot)
| Variável | Descrição | Padrão |
|----------|-----------|--------|
| `STACKSPOT_REALM` | Realm do StackSpot | - |
| `STACKSPOT_CLIENT_ID` | Client ID do StackSpot | - |
| `STACKSPOT_CLIENT_KEY` | Client Key do StackSpot | - |
| `STACKSPOT_AGENT_ID` | Agent ID do StackSpot | - |
| `STACKSPOT_BASE_URL` | URL base do StackSpot | `https://genai-inference-app.stackspot.com` |

## 🎮 CLI Global

### Comando `cyai`

O Cypress AI inclui um CLI global que pode ser usado em qualquer projeto:

```bash
# Configurar projeto
cyai setup

# Executar testes
cyai run

# Iniciar o playground
cyai playground

# Com opções
cyai playground --port 3000 --no-cypress-final

# Ver ajuda
cyai help

# Ver versão
cyai version
```

### Opções dos Comandos

#### Setup
| Opção | Descrição | Padrão |
|-------|-----------|--------|
| `-m, --model <model>` | Modelo do Ollama | `qwen2.5-coder:latest` |
| `-u, --base-url <url>` | URL base da aplicação | `http://localhost:4200` |
| `-p, --port <port>` | Porta da aplicação Angular | `4200` |
| `--ai-dir <dir>` | Diretório dos testes AI | `cypress/e2e-ai` |
| `--final-dir <dir>` | Diretório dos testes finais | `cypress/e2e-final` |
| `-f, --force` | Sobrescrever arquivos existentes | `false` |

#### Run
| Opção | Descrição | Padrão |
|-------|-----------|--------|
| `-s, --spec <spec>` | Arquivo de teste específico | Todos |
| `-p, --port <port>` | Porta da aplicação Angular | `4200` |
| `--no-headless` | Executar em modo interativo | `false` |
| `-b, --browser <browser>` | Navegador para usar | `chrome` |

#### Playground
| Opção | Descrição | Padrão |
|-------|-----------|--------|
| `-p, --port <port>` | Porta da aplicação Angular | `4200` |
| `--no-cypress-final` | Não abrir Cypress Final automaticamente | `false` |
| `--no-watch` | Não monitorar arquivos automaticamente | `false` |

## 🎯 Comandos Disponíveis

### `cy.ai(instructions, options?)`

Gera um teste usando IA baseado nas instruções fornecidas.

```javascript
describe('Teste de Login', () => {
  it('Deve fazer login com sucesso', () => {
    cy.visit('/');
    
    cy.ai([
      'Preencha o email com "user@ex.com"',
      'Preencha a senha com "123456"',
      'Clique no botão "Entrar"',
      'Verifique se aparece "Bem-vindo"'
    ]);
  });
});
```

**Opções:**
- `finalDir`: Diretório para salvar o teste final (padrão: `cypress/e2e-final`)
- `agent`: Agente de IA a usar (padrão: `ollama`)
- `model`: Modelo a usar (padrão: `qwen2.5-coder:latest`)

### `cy.prompt(steps, options?)`

Alias para `cy.ai()` com sintaxe mais simples.

```javascript
cy.prompt([
  'Preencha o formulário de login',
  'Clique em "Entrar"',
  'Verifique o dashboard'
]);
```

**Opções:**
- `skip`: Se `true`, pula a execução

### `cy.runFinal(options?)`

Executa o teste final gerado e pergunta se deseja substituir o teste AI.

```javascript
describe('Fluxo Completo', () => {
  it('Deve gerar e executar teste final', () => {
    cy.visit('/');
    
    // Gera o teste
    cy.prompt(['Faça login com user@ex.com e senha 123456']);
    
    // Executa o teste final e pergunta sobre substituição
    cy.runFinal();
  });
});
```

## 🏗️ Arquitetura

A biblioteca foi refatorada seguindo princípios de orientação a objetos:

### Core
- **`TestGenerator`**: Orquestra todo o processo de geração e execução
- **`FileManager`**: Gerencia operações de arquivo
- **`PromptBuilder`**: Constrói prompts para a IA

### Agents
- **`OllamaAgent`**: Comunica com o Ollama
- **`AgentFactory`**: Factory para criar agentes

### Commands
- **`CypressCommands`**: Implementa os comandos do Cypress
- **`CommandRegistry`**: Registra os comandos

### Plugin
- **`CypressAiPlugin`**: Plugin principal do Cypress

## 🔧 Configuração do Ollama

1. Instale o Ollama: https://ollama.ai/
2. Execute o modelo desejado:
   ```bash
   ollama pull qwen2.5-coder:latest
   ```
3. Configure a URL base (opcional):
   ```bash
   export AI_OLLAMA_BASE_URL=http://localhost:11434
   ```

## 📁 Estrutura de Arquivos

```
cypress/
├── e2e-ai/           # Testes que usam IA
│   └── form.cy.js
├── e2e-final/        # Testes finais gerados
│   └── form.cy.js
└── support/
    └── e2e.ts
```

## 🎨 Exemplo Completo

```javascript
describe('Fluxo de Login', () => {
  it('Deve autenticar e abrir o dashboard', () => {
    cy.visit('/');
    
    // Gera teste usando IA
    cy.prompt([
      'Na tela de login, digite o email "user@ex.com" e a senha "123456"',
      'Clique no botão "Entrar"',
      'Verifique que aparece "Bem-vindo" no dashboard'
    ]);
    
    // Executa o teste final e pergunta sobre substituição
    cy.runFinal();
  });
});
```

## 🔄 Fluxo de Trabalho

1. **Geração**: `cy.ai()` ou `cy.prompt()` gera o teste na pasta `e2e-final`
2. **Execução**: `cy.runFinal()` executa o teste final
3. **Substituição**: Se o teste passar, pergunta se quer substituir o teste AI
4. **Atualização**: Se confirmado, atualiza o teste AI com o teste final

## 🛠️ Desenvolvimento

```bash
# Instalar dependências
npm install

# Compilar TypeScript
npm run build

# Modo desenvolvimento (watch)
npm run dev

# Limpar build
npm run clean
```

## 📝 Changelog

### v0.2.0
- ✅ Refatoração completa para TypeScript
- ✅ Arquitetura orientada a objetos
- ✅ Novo comando `cy.runFinal()`
- ✅ Separação de responsabilidades
- ✅ Tipagem completa

### v0.1.0
- ✅ Versão inicial em JavaScript
- ✅ Integração com Ollama
- ✅ Comandos básicos `cy.ai()` e `cy.prompt()`

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

MIT