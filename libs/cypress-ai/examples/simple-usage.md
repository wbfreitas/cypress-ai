# Uso Simplificado da Biblioteca Cypress AI

## 🚀 Instalação Rápida

### 1. Configuração do Cypress (cypress.config.ts)
```typescript
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
      return installCypressAiPlugin(on, config)
    }
  }
})
```

### 2. Configuração do Suporte (cypress/support/e2e.ts)
```typescript
import '@testing-library/cypress/add-commands'
require('cypress-ai/dist/commands').registerSupportCommands()
export {}
```

## 📝 Comandos Simplificados

### Comando Básico - `cy.ai()`
```javascript
describe('Teste Simples', () => {
  it('deve gerar teste automaticamente', () => {
    cy.visit('/dashboard');
    
    // Gera teste automaticamente
    cy.ai('Teste o botão Abrir Modal');
  });
});
```

### Comando com Exploração - `cy.explore()`
```javascript
describe('Exploração da Página', () => {
  it('deve explorar e capturar estados', () => {
    cy.visit('/dashboard');
    
    // Explora a página automaticamente
    cy.explore().then((states) => {
      console.log('Estados capturados:', states.length);
    });
  });
});
```

### Comando com Contexto - `cy.promptWithContext()`
```javascript
describe('Teste com Contexto', () => {
  it('deve gerar teste com contexto dinâmico', () => {
    cy.visit('/dashboard');
    
    // Explora + gera teste com contexto
    cy.promptWithContext('Teste o modal completo');
  });
});
```

### Comando Sequencial - `cy.promptSequential()`
```javascript
describe('Teste Sequencial', () => {
  it('deve executar instruções sequenciais', () => {
    cy.visit('/dashboard');
    
    cy.promptSequential([
      {
        instructions: 'Teste abrir o modal',
        description: 'Passo 1: Abrir modal'
      },
      {
        instructions: 'Teste fechar o modal',
        description: 'Passo 2: Fechar modal'
      }
    ]);
  });
});
```

## ⚙️ Configurações Opcionais

### Variáveis de Ambiente (.env)
```env
# Configurações opcionais
AI_AGENT=stackspot
AI_OLLAMA_MODEL=qwen2.5-coder:latest
CYPRESS_AI_BASE_URL=http://localhost:4200
```

### Configuração Avançada (opcional)
```typescript
// cypress.config.ts
setupNodeEvents(on, config) {
  return installCypressAiPlugin(on, config, {
    agent: 'stackspot',
    model: 'qwen2.5-coder:latest'
  })
}
```

## 🎯 Exemplos Práticos

### 1. Teste de Modal
```javascript
describe('Modal Test', () => {
  it('deve testar modal com contexto', () => {
    cy.visit('/dashboard');
    cy.promptWithContext('Teste abrir e fechar o modal');
  });
});
```

### 2. Teste de Formulário
```javascript
describe('Form Test', () => {
  it('deve testar formulário', () => {
    cy.visit('/form');
    cy.ai('Teste preencher e enviar o formulário');
  });
});
```

### 3. Teste de Navegação
```javascript
describe('Navigation Test', () => {
  it('deve testar navegação', () => {
    cy.visit('/');
    cy.promptSequential([
      { instructions: 'Teste login' },
      { instructions: 'Teste navegação para dashboard' },
      { instructions: 'Teste logout' }
    ]);
  });
});
```

## 🔧 Solução de Problemas

### Timeout
- Os comandos têm timeout de 2 minutos
- Use comandos individuais em vez de aninhados

### Erro de Módulo
```bash
npx cypress cache clear
npx cypress install
```

### Performance
- Use `cy.explore()` com `maxDepth: 1` para melhor performance
- Evite comandos aninhados complexos

## 📊 Estrutura de Arquivos Gerados

```
cypress/
├── e2e-ai/           # Testes gerados pela IA
│   └── *.cy.js
├── e2e-final/        # Testes finais (se configurado)
│   └── *.cy.js
└── support/
    └── e2e.ts        # Configuração de suporte
```
