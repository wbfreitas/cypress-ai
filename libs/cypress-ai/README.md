# Cypress AI - Biblioteca TypeScript

Uma biblioteca TypeScript para gerar testes E2E do Cypress usando IA (Ollama) com arquitetura orientada a objetos.

## 🚀 Funcionalidades

- **Geração de Testes com IA**: Gera testes Cypress automaticamente baseado em instruções em português
- **Arquitetura Orientada a Objetos**: Código bem estruturado e fácil de manter
- **Execução de Testes Finais**: Executa testes gerados e permite substituição do teste AI
- **Suporte ao Ollama**: Integração com modelos de IA locais
- **TypeScript**: Tipagem completa e IntelliSense

## 📦 Instalação

```bash
npm install cypress-ai
```

## ⚙️ Configuração

### 1. Configurar o Cypress

```typescript
// cypress.config.ts
import { defineConfig } from 'cypress'
const { installCypressAiPlugin } = require('cypress-ai/dist/agent')

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:4200',
    supportFile: 'cypress/support/e2e.ts',
    specPattern: 'cypress/e2e-ai/**/*.cy.{js,ts}',
    setupNodeEvents(on, config) {
      return installCypressAiPlugin(on, config, { 
        model: 'qwen2.5-coder:latest' 
      })
    },
    video: false
  }
})
```

### 2. Registrar Comandos

```typescript
// cypress/support/e2e.ts
import '@testing-library/cypress/add-commands'
require('cypress-ai/dist/commands').registerSupportCommands()
export {}
```

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