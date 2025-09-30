# Cypress AI v2.0 🚀

**Biblioteca simplificada para geração automática de testes Cypress usando StackSpot**

## ✨ Características Principais

- **Comando único**: `cy.ai()` - simples e direto
- **Captura automática de contexto**: Analisa a página automaticamente
- **Retry inteligente**: Até 3 tentativas com feedback de erro
- **Atualização automática**: Testes finais são atualizados automaticamente
- **Configuração simplificada**: Setup em um comando
- **Focado no StackSpot**: Otimizado para o agente StackSpot

## 🚀 Instalação Rápida

### 1. Instalar a biblioteca
```bash
npm install cypress-ai-v2
```

### 2. Configurar (uma vez só)
```bash
npx cyai-v2 setup --client-id <seu-client-id> --agent-id <seu-agent-id> --client-key <sua-client-key>
```

### 3. Usar nos testes
```javascript
describe('Meus Testes', () => {
  it('deve testar automaticamente', () => {
    cy.visit('/');
    cy.ai('Teste o botão de login');
  });
});
```

## 📋 Comandos Disponíveis

### Setup
```bash
cyai-v2 setup [opções]

Opções:
  -r, --realm <realm>        StackSpot Realm (padrão: stackspot-freemium)
  -c, --client-id <id>       StackSpot Client ID (obrigatório)
  -a, --agent-id <id>        StackSpot Agent ID (obrigatório)
  -k, --client-key <key>     StackSpot Client Key (obrigatório)
  -b, --base-url <url>       Base URL da aplicação (padrão: http://localhost:4200)
  -m, --model <model>        Modelo de IA (padrão: qwen2.5-coder:latest)
```

### Ajuda
```bash
cyai-v2 help
```

## 🎯 Uso nos Testes

### Comando Básico
```javascript
cy.ai('Teste o botão de login');
```

### Instruções Múltiplas
```javascript
cy.ai([
  'Teste fazer login',
  'Verifique se foi redirecionado',
  'Teste fazer logout'
]);
```

### Com Opções
```javascript
cy.ai('Teste o modal', { 
  updateFinal: true,  // Atualiza teste final (padrão: true)
  specPath: 'cypress/e2e-ai/meu-teste.cy.js'
});
```

## 🔧 Configuração

### Arquivo .env (criado automaticamente)
```env
CYPRESS_AI_MODEL=qwen2.5-coder:latest
CYPRESS_AI_BASE_URL=https://genai-inference-app.stackspot.com
STACKSPOT_REALM=stackspot-freemium
STACKSPOT_CLIENT_ID=seu-client-id
STACKSPOT_AGENT_ID=seu-agent-id
STACKSPOT_CLIENT_KEY=sua-client-key
CYPRESS_AI_MAX_RETRIES=3
CYPRESS_AI_TIMEOUT=120000
```

### cypress.config.ts (criado automaticamente)
```typescript
import { defineConfig } from 'cypress'
import { installCypressAiV2 } from 'cypress-ai-v2'

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:4200',
    supportFile: 'cypress/support/e2e.ts',
    specPattern: [
      'cypress/e2e-ai/**/*.cy.{js,ts}',
      'cypress/e2e-final/**/*.cy.{js,ts}'
    ],
    setupNodeEvents(on, config) {
      return installCypressAiV2(on, config)
    }
  }
})
```

### cypress/support/e2e.ts (criado automaticamente)
```typescript
import '@testing-library/cypress/add-commands'
import 'cypress-ai-v2/dist/commands'

declare global {
  namespace Cypress {
    interface Chainable {
      ai(instructions: string | string[], options?: any): Chainable<any>
    }
  }
}
```

## 📁 Estrutura de Arquivos

```
projeto/
├── .env                    # Configurações (criado automaticamente)
├── cypress.config.ts       # Configuração Cypress (criado automaticamente)
├── cypress/
│   ├── e2e-ai/            # Testes gerados pela IA
│   │   └── *.cy.js
│   ├── e2e-final/         # Testes finais (atualizados automaticamente)
│   │   └── *.cy.js
│   └── support/
│       └── e2e.ts         # Configuração de suporte
└── package.json
```

## 🧠 Como Funciona

1. **Captura de Contexto**: O comando `cy.ai()` analisa automaticamente a página atual
2. **Geração**: Envia contexto + instruções para o StackSpot
3. **Validação**: Testa o código gerado
4. **Retry**: Se falhar, envia feedback de erro e tenta novamente (até 3x)
5. **Atualização**: Atualiza teste final se solicitado

## 🔄 Sistema de Retry

A biblioteca tenta gerar o teste até 3 vezes:

1. **Tentativa 1**: Gera teste com contexto da página
2. **Tentativa 2**: Se falhar, envia erro + código gerado para correção
3. **Tentativa 3**: Se falhar novamente, envia erro detalhado para correção final

## 🎯 Exemplos Práticos

### Teste de Login
```javascript
describe('Login', () => {
  it('deve fazer login com sucesso', () => {
    cy.visit('/login');
    cy.ai('Teste fazer login com credenciais válidas');
  });
});
```

### Teste de Modal
```javascript
describe('Modal', () => {
  it('deve abrir e fechar modal', () => {
    cy.visit('/dashboard');
    cy.ai('Teste abrir o modal, verificar conteúdo e fechar');
  });
});
```

### Teste de Formulário
```javascript
describe('Formulário', () => {
  it('deve preencher e enviar formulário', () => {
    cy.visit('/form');
    cy.ai([
      'Preencha todos os campos obrigatórios',
      'Teste validação de campos vazios',
      'Teste envio do formulário'
    ]);
  });
});
```

## 🚨 Solução de Problemas

### Erro de Autenticação
```bash
# Verifique suas credenciais no .env
cat .env
```

### Timeout
```bash
# Aumente o timeout no .env
CYPRESS_AI_TIMEOUT=180000
```

### Teste não gerado
```bash
# Verifique os logs no console do Cypress
# O comando mostra detalhes do processo
```

## 🔄 Migração da v1

Se você está usando a v1, a migração é simples:

1. **Instale a v2**: `npm install cypress-ai-v2`
2. **Configure**: `npx cyai-v2 setup --client-id <id> --agent-id <id> --client-key <key>`
3. **Atualize imports**: Troque `cypress-ai` por `cypress-ai-v2`
4. **Simplifique comandos**: Use apenas `cy.ai()` em vez de múltiplos comandos

## 📊 Comparação v1 vs v2

| Característica | v1 | v2 |
|---|---|---|
| Comandos | 6 comandos | 1 comando |
| Configuração | Complexa | Simples |
| Retry | Manual | Automático |
| Contexto | Manual | Automático |
| Atualização | Manual | Automática |
| Foco | Múltiplos agentes | StackSpot |

## 🤝 Contribuição

Contribuições são bem-vindas! A v2 foi projetada para ser mais simples e robusta.

## 📄 Licença

MIT
