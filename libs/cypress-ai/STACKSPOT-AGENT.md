# Agente StackSpot - Cypress AI

## 🎯 Objetivo

Implementação de um novo agente de IA para o Cypress AI que se integra com o StackSpot, permitindo usar serviços de IA em nuvem além do Ollama local.

## ✅ O que foi Implementado

### 1. **StackSpotAgent**
- **Autenticação**: OAuth2 com client credentials
- **Chat com Agente**: Integração com API do StackSpot
- **Extração de Resposta**: Processamento da resposta JSON
- **Validação**: Verificação de configurações
- **Disponibilidade**: Método para verificar se o serviço está acessível

### 2. **Integração com AgentFactory**
- **Suporte Múltiplos Agentes**: Ollama e StackSpot
- **Configuração Dinâmica**: Criação baseada em variáveis de ambiente
- **Interface Unificada**: Mesma interface para todos os agentes

### 3. **Setup Interativo**
- **Seleção de Agente**: Escolha entre Ollama e StackSpot
- **Configuração Específica**: Variáveis específicas para cada agente
- **Modo Não-Interativo**: Suporte a parâmetros de linha de comando

### 4. **Variáveis de Ambiente**
- **STACKSPOT_REALM**: Realm do StackSpot
- **STACKSPOT_CLIENT_ID**: Client ID para autenticação
- **STACKSPOT_CLIENT_KEY**: Client Key para autenticação
- **STACKSPOT_AGENT_ID**: ID do agente específico
- **STACKSPOT_BASE_URL**: URL base da API

## 🔧 Implementação Técnica

### StackSpotAgent
```typescript
export class StackSpotAgent {
  private config: StackSpotConfig;

  async generateTest(prompt: string): Promise<string> {
    // 1. Autenticar e obter JWT
    const jwt = await this.authenticate();
    
    // 2. Fazer chat com o agente
    const response = await this.chatWithAgent(prompt, jwt);
    
    // 3. Extrair e retornar a resposta
    return this.extractResponse(response);
  }

  private async authenticate(): Promise<string> {
    // OAuth2 client credentials flow
    const formData = new URLSearchParams();
    formData.append('grant_type', 'client_credentials');
    formData.append('client_id', this.config.clientId);
    formData.append('client_secret', this.config.clientKey);

    const response = await fetch(authUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formData,
    });

    const data = await response.json() as any;
    return data.access_token;
  }

  private async chatWithAgent(prompt: string, jwt: string): Promise<StackSpotResponse> {
    const requestBody = {
      streaming: false,
      user_prompt: prompt,
      stackspot_knowledge: false,
      return_ks_in_response: false
    };

    const response = await fetch(chatUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwt}`,
      },
      body: JSON.stringify(requestBody),
    });

    return await response.json() as StackSpotResponse;
  }
}
```

### AgentFactory Atualizado
```typescript
static createAgent(agentType: 'ollama' | 'stackspot', config: CypressAiConfig): IAgent {
  switch (agentType) {
    case 'ollama':
      return new OllamaAgent(apiBase, model);
    
    case 'stackspot':
      const stackSpotConfig: StackSpotConfig = {
        realm: process.env['STACKSPOT_REALM'] || '',
        clientId: process.env['STACKSPOT_CLIENT_ID'] || '',
        clientKey: process.env['STACKSPOT_CLIENT_KEY'] || '',
        agentId: process.env['STACKSPOT_AGENT_ID'] || '',
        baseUrl: process.env['STACKSPOT_BASE_URL'] || 'https://genai-inference-app.stackspot.com'
      };
      return new StackSpotAgent(stackSpotConfig);
  }
}
```

### Setup Interativo
```typescript
private async selectAgent(): Promise<string> {
  console.log('\n🤖 Selecione o agente de IA:');
  console.log('  1. Ollama (Local) - Modelo local executando no seu computador');
  console.log('  2. StackSpot (Cloud) - Serviço de IA em nuvem');
  
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) => {
    rl.question('\nDigite sua escolha (1 ou 2): ', (answer) => {
      rl.close();
      const choice = answer.trim();
      
      if (choice === '1') {
        resolve('ollama');
      } else if (choice === '2') {
        resolve('stackspot');
      } else {
        resolve('ollama'); // padrão
      }
    });
  });
}
```

## 🚀 Como Usar

### 1. Configuração Interativa
```bash
# Setup interativo - pergunta qual agente usar
cyai setup
```

### 2. Configuração com StackSpot
```bash
# Setup direto com StackSpot
cyai setup --agent stackspot
```

### 3. Configuração Manual
```bash
# Editar .env manualmente
nano .env

# Configurar variáveis do StackSpot
STACKSPOT_REALM=seu-realm
STACKSPOT_CLIENT_ID=seu-client-id
STACKSPOT_CLIENT_KEY=seu-client-key
STACKSPOT_AGENT_ID=seu-agent-id
```

## 📁 Arquivo .env para StackSpot

```env
# Cypress AI Configuration
# Agent Configuration
AI_AGENT=stackspot

# Project Configuration
CYPRESS_AI_BASE_URL=http://localhost:4200
CYPRESS_AI_PORT=4200

# Directory Configuration
CYPRESS_AI_DIR=cypress/e2e-ai
CYPRESS_FINAL_DIR=cypress/e2e-final

# StackSpot Configuration
STACKSPOT_REALM=seu-realm
STACKSPOT_CLIENT_ID=seu-client-id
STACKSPOT_CLIENT_KEY=seu-client-key
STACKSPOT_AGENT_ID=seu-agent-id
STACKSPOT_BASE_URL=https://genai-inference-app.stackspot.com
```

## 🔄 Fluxo de Autenticação

### 1. **OAuth2 Client Credentials**
```bash
# Autenticação
curl -X POST "https://idm.stackspot.com/$REALM/oidc/oauth/token" \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  -d 'grant_type=client_credentials' \
  -d "client_id=$CLIENT_ID" \
  -d "client_secret=$CLIENT_KEY"
```

### 2. **Chat com Agente**
```bash
# Chat
curl 'https://genai-inference-app.stackspot.com/v1/agent/$AGENT_ID/chat' \
  -H 'Content-Type: application/json' \
  -H "Authorization: Bearer $JWT" \
  -d '{
    "streaming": false,
    "user_prompt": "prompt aqui",
    "stackspot_knowledge": false,
    "return_ks_in_response": false
  }'
```

## 🎯 Benefícios

### Para Desenvolvedores
- **Flexibilidade**: Escolha entre IA local (Ollama) ou cloud (StackSpot)
- **Configuração Simples**: Setup interativo guia o usuário
- **Integração Transparente**: Mesma interface para todos os agentes
- **Fallback**: Pode usar Ollama se StackSpot não estiver disponível

### Para Projetos
- **Escalabilidade**: StackSpot oferece mais recursos computacionais
- **Confiabilidade**: Serviço gerenciado em nuvem
- **Atualizações**: Modelos sempre atualizados
- **Colaboração**: Equipes podem usar o mesmo agente

### Para Equipes
- **Padronização**: Mesmo agente para toda a equipe
- **Configuração Centralizada**: Variáveis no .env
- **Flexibilidade**: Cada desenvolvedor pode escolher seu agente
- **CI/CD**: StackSpot funciona melhor em ambientes automatizados

## 🔧 Configuração do StackSpot

### 1. **Obter Credenciais**
- Acesse o StackSpot
- Crie um client OAuth2
- Obtenha REALM, CLIENT_ID, CLIENT_KEY
- Identifique o AGENT_ID

### 2. **Configurar Variáveis**
```bash
export STACKSPOT_REALM="seu-realm"
export STACKSPOT_CLIENT_ID="seu-client-id"
export STACKSPOT_CLIENT_KEY="seu-client-key"
export STACKSPOT_AGENT_ID="seu-agent-id"
```

### 3. **Testar Configuração**
```bash
# Verificar se o agente está disponível
cyai version

# Executar um teste
cyai run
```

## 📊 Status da Implementação

- ✅ **StackSpotAgent**: Implementado e funcional
- ✅ **AgentFactory**: Atualizado para suportar StackSpot
- ✅ **Setup Interativo**: Seleção de agente implementada
- ✅ **Variáveis de Ambiente**: Configuração via .env
- ✅ **CLI**: Opções para seleção de agente
- ✅ **Documentação**: Atualizada com StackSpot
- ✅ **Testes**: Verificados e funcionando

## 🎉 Conclusão

O agente StackSpot expande significativamente as capacidades do Cypress AI, oferecendo uma alternativa robusta ao Ollama local. Com a implementação de autenticação OAuth2, integração com API REST e configuração flexível via variáveis de ambiente, desenvolvedores agora têm acesso a serviços de IA em nuvem de forma transparente e integrada.

A arquitetura modular permite fácil extensão para outros provedores de IA no futuro, mantendo a mesma interface unificada e experiência de usuário consistente.
