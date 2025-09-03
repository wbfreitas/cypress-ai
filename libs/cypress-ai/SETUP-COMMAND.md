# Comando Setup - Cypress AI CLI

## 🎯 Objetivo

O comando `cyai setup` automatiza completamente a configuração inicial de um projeto Angular para usar o Cypress AI, eliminando a necessidade de configuração manual.

## ✅ O que foi Implementado

### 1. **Comando Setup Completo**
- **Verificação de Projeto**: Detecta se é um projeto Angular válido
- **Geração de .env**: Cria arquivo com todas as configurações LLM
- **Configuração Cypress**: Gera `cypress.config.ts` automaticamente
- **Support File**: Cria `cypress/support/e2e.ts` se não existir
- **Diretórios**: Cria pastas `e2e-ai` e `e2e-final`
- **Package.json**: Adiciona scripts necessários
- **Dependências**: Instala automaticamente

### 2. **Comando Run**
- **Execução de Testes**: Roda testes Cypress AI
- **Opções Flexíveis**: Spec específico, porta, browser, headless
- **Integração**: Usa configurações do .env

### 3. **Variáveis de Ambiente**
- **AI_OLLAMA_MODEL**: Modelo do Ollama
- **AI_OLLAMA_BASE_URL**: URL base do Ollama
- **CYPRESS_AI_BASE_URL**: URL da aplicação
- **CYPRESS_AI_PORT**: Porta da aplicação
- **CYPRESS_AI_DIR**: Diretório dos testes AI
- **CYPRESS_FINAL_DIR**: Diretório dos testes finais

### 4. **Carregamento Automático do .env**
- **dotenv**: Instalado automaticamente como dependência
- **Carregamento**: A lib carrega o .env automaticamente
- **Integração**: Todos os comandos usam as variáveis do .env
- **Flexibilidade**: Pode sobrescrever via parâmetros de linha de comando

## 🚀 Como Usar

### Instalação e Configuração
```bash
# 1. Instalar CLI globalmente
npm install -g cypress-ai

# 2. Navegar para projeto Angular
cd meu-projeto-angular

# 3. Configurar automaticamente
cyai setup

# 4. Iniciar desenvolvimento
cyai playground
```

### Opções do Setup
```bash
# Configuração básica
cyai setup

# Configuração personalizada
cyai setup --model llama2 --port 3000 --ai-dir tests/ai --final-dir tests/final

# Forçar sobrescrita
cyai setup --force
```

### Comandos Disponíveis
```bash
cyai setup          # Configura o projeto
cyai run            # Executa testes
cyai playground     # Inicia ambiente de desenvolvimento
cyai version        # Mostra versão
cyai help           # Mostra ajuda
```

## 📁 Arquivos Gerados

### 1. **.env**
```env
# Cypress AI Configuration
# LLM Configuration
AI_OLLAMA_BASE_URL=http://localhost:11434
AI_OLLAMA_MODEL=qwen2.5-coder:latest

# Project Configuration
CYPRESS_AI_BASE_URL=http://localhost:4200
CYPRESS_AI_PORT=4200

# Directory Configuration
CYPRESS_AI_DIR=cypress/e2e-ai
CYPRESS_FINAL_DIR=cypress/e2e-final
```

### 2. **cypress.config.ts**
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
      return installCypressAiPlugin(on, config, { 
        model: process.env.AI_OLLAMA_MODEL || 'qwen2.5-coder:latest',
        baseUrl: process.env.AI_OLLAMA_BASE_URL || 'http://localhost:11434'
      })
    },
    video: false,
    screenshotOnRunFailure: false
  }
})
```

### 3. **cypress/support/e2e.ts**
```typescript
import '@testing-library/cypress/add-commands'
require('cypress-ai/dist/commands').registerSupportCommands()
export {}
```

### 4. **package.json** (scripts adicionados)
```json
{
  "scripts": {
    "start": "ng serve --port 4200",
    "cy:ai:run": "cypress run --e2e --config baseUrl=http://localhost:4200",
    "cy:final": "cypress open --e2e --config specPattern='cypress/e2e-final/**/*.cy.{js,ts}',baseUrl=http://localhost:4200",
    "cy:ai:setup": "cyai setup"
  }
}
```

## 🔧 Integração com Variáveis de Ambiente

### Carregamento Automático do .env
A lib carrega automaticamente o arquivo `.env` em todos os módulos:

```typescript
// libs/cypress-ai/src/agent.ts
import * as dotenv from 'dotenv';
import * as path from 'path';

// Carregar arquivo .env se existir
const envPath = path.join(process.cwd(), '.env');
try {
  dotenv.config({ path: envPath });
} catch (error) {
  // Ignorar erro se arquivo .env não existir
}
```

### Plugin Atualizado
O plugin agora usa automaticamente as variáveis de ambiente:

```typescript
// libs/cypress-ai/src/agent.ts
export function installCypressAiPlugin(
  on: any, 
  config: any, 
  defaults: CypressAiConfig = {}
): any {
  const envConfig: CypressAiConfig = {
    model: process.env['AI_OLLAMA_MODEL'] || defaults.model || 'qwen2.5-coder:latest',
    baseUrl: process.env['AI_OLLAMA_BASE_URL'] || defaults.baseUrl || 'http://localhost:11434',
    ...defaults
  };
  
  const plugin = new CypressAiPlugin(envConfig);
  return plugin.installPlugin(on, config);
}
```

### Comandos CLI Atualizados
Todos os comandos CLI agora carregam e usam as variáveis de ambiente:

```typescript
// libs/cypress-ai/src/cli/commands/playground.ts
async run(options: PlaygroundOptions = {}) {
  this.options = {
    port: process.env['CYPRESS_AI_PORT'] || '4200',
    cypressFinal: true,
    watch: true,
    ...options
  };
}
```

### Configuração Automática
- **Carregamento automático**: dotenv carrega o .env automaticamente
- **Sem setup manual**: Não precisa mais passar configurações no setup
- **Flexibilidade**: Pode sobrescrever via .env ou parâmetros
- **Padrões sensatos**: Valores padrão funcionam out-of-the-box

## 🎮 Fluxo de Trabalho Simplificado

### Antes (Manual)
1. Instalar dependências
2. Configurar cypress.config.ts
3. Criar support file
4. Configurar diretórios
5. Adicionar scripts ao package.json
6. Configurar variáveis de ambiente

### Depois (Automático)
1. `cyai setup` - Tudo configurado automaticamente
2. `cyai playground` - Iniciar desenvolvimento

## 🚀 Benefícios

### Para Desenvolvedores
- **Zero Configuração**: Setup em um comando
- **Consistência**: Mesma configuração em todos os projetos
- **Produtividade**: Foco no desenvolvimento, não na configuração
- **Flexibilidade**: Opções para personalizar quando necessário

### Para Projetos
- **Padronização**: Estrutura consistente
- **Manutenibilidade**: Configuração centralizada no .env
- **Escalabilidade**: Fácil de replicar em novos projetos
- **Documentação**: Configuração auto-documentada

### Para Equipes
- **Onboarding Rápido**: Novos desenvolvedores em minutos
- **Redução de Erros**: Configuração automática elimina erros manuais
- **Versionamento**: .env pode ser versionado (sem secrets)
- **CI/CD**: Configuração consistente em ambientes

## 🔄 Próximos Passos

### Melhorias Futuras
1. **Templates**: Diferentes templates de configuração
2. **Validação**: Verificar se Ollama está rodando
3. **Configuração Avançada**: Mais opções de personalização
4. **Integração CI/CD**: Configuração automática em pipelines
5. **Backup**: Backup de configurações existentes

### Funcionalidades Adicionais
1. **Reset**: Comando para resetar configuração
2. **Status**: Verificar status da configuração
3. **Update**: Atualizar configuração existente
4. **Export/Import**: Compartilhar configurações
5. **Profiles**: Múltiplos perfis de configuração

## 📊 Status da Implementação

- ✅ **Setup Command**: Completo e funcional
- ✅ **Env Generator**: Gera .env com todas as configurações
- ✅ **Cypress Config**: Configuração automática
- ✅ **Support File**: Criação automática
- ✅ **Directories**: Criação de diretórios
- ✅ **Package Scripts**: Atualização automática
- ✅ **Dependencies**: Instalação automática
- ✅ **Run Command**: Execução de testes
- ✅ **Environment Variables**: Integração completa
- ✅ **Documentation**: Documentação atualizada

## 🎉 Conclusão

O comando `cyai setup` transforma a experiência de configuração do Cypress AI de um processo manual e propenso a erros em uma experiência automatizada e consistente. Com um único comando, desenvolvedores podem ter um projeto Angular completamente configurado e pronto para usar o Cypress AI.

Esta implementação elimina barreiras de entrada e acelera significativamente o processo de adoção da ferramenta, tornando-a acessível para desenvolvedores de todos os níveis de experiência.
