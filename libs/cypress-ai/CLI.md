# Cypress AI CLI - Guia Completo

## 🚀 Instalação

### Opção 1: Instalação Global
```bash
npm install -g cypress-ai
```

### Opção 2: Uso com npx (sem instalação)
```bash
npx cypress-ai playground
```

### Opção 3: Instalação Manual (Desenvolvimento)
```bash
git clone <seu-repositorio>
cd cypress-ai
npm install
npm run build
npm install -g .
```

## 🎮 Comandos Disponíveis

### `cyai playground`
Inicia o ambiente de desenvolvimento automatizado.

**Sintaxe:**
```bash
cyai playground [opções]
```

**Opções:**
- `-p, --port <port>`: Porta da aplicação Angular (padrão: 4200)
- `--no-cypress-final`: Não abrir Cypress Final automaticamente
- `--no-watch`: Não monitorar arquivos automaticamente
- `-h, --help`: Mostra ajuda

**Exemplos:**
```bash
# Iniciar playground padrão
cyai playground

# Iniciar na porta 3000
cyai playground --port 3000

# Iniciar sem Cypress Final
cyai playground --no-cypress-final

# Iniciar sem monitoramento de arquivos
cyai playground --no-watch
```

### `cyai version`
Mostra informações da versão e dependências.

**Sintaxe:**
```bash
cyai version
```

### `cyai help`
Mostra ajuda detalhada com todos os comandos.

**Sintaxe:**
```bash
cyai help
```

## 🎯 O que o Playground Faz

O comando `cyai playground` automatiza todo o fluxo de desenvolvimento:

### 1. **Inicia a Aplicação Angular**
- Verifica se já está rodando na porta especificada
- Se não estiver, inicia com `npm start`
- Aguarda a aplicação estar respondendo

### 2. **Inicia o Cypress Final** (opcional)
- Abre o Cypress para visualizar testes gerados
- Permite executar testes manualmente
- Facilita a visualização dos resultados

### 3. **Monitora Arquivos AI** (opcional)
- Observa mudanças em `cypress/e2e-ai/**/*.cy.{js,ts}`
- Executa automaticamente quando arquivos são modificados
- Evita execuções duplicadas

### 4. **Execução Automática**
- Roda `npx cypress run --spec <arquivo> --headless`
- Mostra resultados no console
- Continua monitorando para próximas mudanças

## 🔧 Configuração do Projeto

Para usar o CLI, seu projeto Angular precisa ter:

### 1. **package.json** com scripts:
```json
{
  "scripts": {
    "start": "ng serve --port 4200",
    "cy:final": "npx cypress open --config specPattern=cypress/e2e-final/**/*.cy.{js,ts}"
  }
}
```

### 2. **Estrutura de Pastas:**
```
projeto/
├── cypress/
│   ├── e2e-ai/          # Testes que usam IA
│   ├── e2e-final/       # Testes finais gerados
│   └── support/
│       └── e2e.ts
├── src/
└── package.json
```

### 3. **Cypress Configurado:**
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
      return installCypressAiPlugin(on, config, { 
        model: 'qwen2.5-coder:latest' 
      })
    }
  }
})
```

## 🎨 Fluxo de Trabalho

### 1. **Iniciar o Playground**
```bash
cd meu-projeto-angular
cyai playground
```

### 2. **Criar/Editar Teste AI**
```javascript
// cypress/e2e-ai/login.cy.js
describe('Login', () => {
  it('Deve fazer login', () => {
    cy.visit('/');
    
    cy.prompt([
      'Preencha email com "user@ex.com"',
      'Preencha senha com "123456"',
      'Clique em "Entrar"',
      'Verifique se aparece "Bem-vindo"'
    ]);
    
    cy.runFinal();
  });
});
```

### 3. **Execução Automática**
- O playground detecta a mudança
- Executa o teste automaticamente
- Mostra resultados no console

### 4. **Visualização no Cypress Final**
- Teste final é salvo em `cypress/e2e-final/`
- Pode ser visualizado no Cypress Final
- Permite execução manual e debug

## 🛠️ Troubleshooting

### Erro: "command not found: cyai"
```bash
# Reinstalar globalmente
npm uninstall -g cypress-ai
npm install -g cypress-ai

# Ou usar com npx
npx cypress-ai playground
```

### Erro: "Cannot find module"
```bash
# Recompilar a lib
cd cypress-ai
npm run build
npm install -g .
```

### Aplicação Angular não inicia
```bash
# Verificar se está no diretório correto
cd meu-projeto-angular

# Verificar se tem o script start
npm run start
```

### Cypress não encontra specs
```bash
# Verificar cypress.config.ts
# Garantir que specPattern inclui ambas as pastas
specPattern: [
  'cypress/e2e-ai/**/*.cy.{js,ts}',
  'cypress/e2e-final/**/*.cy.{js,ts}'
]
```

## 📚 Exemplos Práticos

### Exemplo 1: Teste de Formulário
```bash
# 1. Iniciar playground
cyai playground

# 2. Criar arquivo cypress/e2e-ai/form.cy.js
# 3. O playground executa automaticamente
# 4. Visualizar resultado no Cypress Final
```

### Exemplo 2: Múltiplos Testes
```bash
# 1. Iniciar playground
cyai playground --port 3000

# 2. Criar vários arquivos em e2e-ai/
# 3. Editar um por vez
# 4. Cada edição executa automaticamente
```

### Exemplo 3: Sem Cypress Final
```bash
# Para projetos que não precisam da interface visual
cyai playground --no-cypress-final
```

## 🔄 Integração com CI/CD

O CLI pode ser usado em pipelines:

```yaml
# .github/workflows/test.yml
- name: Run Cypress AI Tests
  run: |
    npm start &
    sleep 30
    npx cypress-ai playground --no-cypress-final --no-watch
```

## 📞 Suporte

- **Documentação**: [README.md](./README.md)
- **Issues**: [GitHub Issues](https://github.com/seu-usuario/cypress-ai/issues)
- **Exemplos**: [examples/](./examples/)

## 🎉 Próximos Passos

1. **Instale o CLI**: `npm install -g cypress-ai`
2. **Configure seu projeto**: Siga a configuração acima
3. **Inicie o playground**: `cyai playground`
4. **Crie seus testes**: Use `cy.prompt()` e `cy.runFinal()`
5. **Automatize seu fluxo**: O playground cuida do resto!