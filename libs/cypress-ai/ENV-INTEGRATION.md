# Integração com Arquivo .env - Cypress AI

## 🎯 Objetivo

A lib Cypress AI agora carrega automaticamente o arquivo `.env` e usa as variáveis de ambiente para configuração, eliminando a necessidade de passar configurações manualmente.

## - O que foi Implementado

### 1. **Carregamento Automático do .env**
- **dotenv**: Adicionado como dependência
- **Carregamento**: Automático em todos os módulos
- **Fallback**: Ignora erro se arquivo não existir
- **Integração**: Todos os comandos usam as variáveis

### 2. **Módulos Atualizados**
- **agent.ts**: Carrega .env e usa variáveis no plugin
- **plugin/CypressAiPlugin.ts**: Carrega .env e usa variáveis
- **cli/commands/playground.ts**: Usa variáveis para porta
- **cli/commands/run.ts**: Usa variáveis para porta
- **cli/commands/setup.ts**: Instala dotenv automaticamente

### 3. **Variáveis de Ambiente Suportadas**
- `AI_OLLAMA_MODEL`: Modelo do Ollama
- `AI_OLLAMA_BASE_URL`: URL base do Ollama
- `CYPRESS_AI_BASE_URL`: URL da aplicação
- `CYPRESS_AI_PORT`: Porta da aplicação
- `CYPRESS_AI_DIR`: Diretório dos testes AI
- `CYPRESS_FINAL_DIR`: Diretório dos testes finais

## - Implementação Técnica

### Carregamento do .env
```typescript
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

### Uso no Plugin
```typescript
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

### Uso nos Comandos CLI
```typescript
async run(options: PlaygroundOptions = {}) {
  this.options = {
    port: process.env['CYPRESS_AI_PORT'] || '4200',
    cypressFinal: true,
    watch: true,
    ...options
  };
}
```

## 📁 Arquivo .env Gerado

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

# Optional: Custom prompts
# CYPRESS_AI_SYSTEM_PROMPT=Você é um especialista em testes E2E com Cypress.
```

## - Como Usar

### 1. Configuração Automática
```bash
# O comando setup cria o .env automaticamente
cyai setup
```

### 2. Personalização
```bash
# Editar o arquivo .env para personalizar
nano .env

# Ou usar parâmetros para sobrescrever
cyai playground --port 3000
```

### 3. Verificação
```bash
# Verificar se as variáveis estão carregadas
node -e "require('dotenv').config(); console.log(process.env.AI_OLLAMA_MODEL);"
```

## - Fluxo de Configuração

### Antes (Manual)
1. Instalar dependências
2. Configurar cypress.config.ts
3. Passar configurações no setup
4. Gerenciar configurações manualmente

### Depois (Automático)
1. `cyai setup` - Cria .env automaticamente
2. A lib carrega .env automaticamente
3. Configurações aplicadas automaticamente
4. Personalização via .env ou parâmetros

## 🎯 Benefícios

### Para Desenvolvedores
- **Zero configuração manual**: .env carregado automaticamente
- **Flexibilidade**: Pode personalizar via .env ou parâmetros
- **Consistência**: Mesmas configurações em todos os ambientes
- **Produtividade**: Foco no desenvolvimento, não na configuração

### Para Projetos
- **Configuração centralizada**: Tudo no arquivo .env
- **Versionamento**: .env pode ser versionado (sem secrets)
- **Ambientes múltiplos**: Diferentes .env para diferentes ambientes
- **Manutenibilidade**: Configuração em um local

### Para Equipes
- **Padronização**: Mesma estrutura de configuração
- **Onboarding**: Novos desenvolvedores entendem rapidamente
- **Colaboração**: Configurações compartilhadas via .env
- **CI/CD**: Configuração consistente em pipelines

## - Dependências

### Adicionadas Automaticamente
- **dotenv**: Para carregamento do arquivo .env
- **@types/node**: Para tipagem do Node.js

### Instalação
```bash
# Instalado automaticamente pelo setup
npm install --save-dev dotenv

# Ou manualmente
npm install --save-dev dotenv @types/node
```

## 📊 Status da Implementação

- - **Carregamento automático**: dotenv configurado
- - **Plugin atualizado**: Usa variáveis de ambiente
- - **Comandos CLI**: Integrados com .env
- - **Setup automático**: Instala dotenv
- - **Documentação**: Atualizada com informações
- - **Testes**: Verificados e funcionando

## 🎉 Conclusão

A integração com o arquivo `.env` transforma a experiência de configuração do Cypress AI, tornando-a mais flexível, consistente e fácil de usar. Com o carregamento automático, desenvolvedores podem personalizar configurações sem modificar código, e equipes podem compartilhar configurações de forma padronizada.

Esta implementação elimina a necessidade de configuração manual e oferece a flexibilidade necessária para diferentes ambientes e necessidades de projeto.
