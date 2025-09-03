# Quick Start - Cypress AI CLI

## 🚀 Início Rápido

### 1. Instalar o CLI
```bash
npm install -g cypress-ai
```

### 2. Configurar Projeto Angular
```bash
# Navegar para seu projeto
cd meu-projeto-angular

# Instalar dependências
npm install cypress cypress-ai

# Configurar Cypress
npx cypress open
```

### 3. Configurar cypress.config.ts
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
        model: 'qwen2.5-coder:latest' 
      })
    }
  }
})
```

### 4. Configurar cypress/support/e2e.ts
```typescript
import '@testing-library/cypress/add-commands'
require('cypress-ai/dist/commands').registerSupportCommands()
export {}
```

### 5. Iniciar o Playground
```bash
cyai playground
```

### 6. Criar Primeiro Teste
```javascript
// cypress/e2e-ai/login.cy.js
describe('Login', () => {
  it('Deve fazer login com sucesso', () => {
    cy.visit('/');
    
    cy.prompt([
      'Preencha o campo email com "user@exemplo.com"',
      'Preencha o campo senha com "123456"',
      'Clique no botão "Entrar"',
      'Verifique se aparece a mensagem "Bem-vindo"'
    ]);
    
    cy.runFinal();
  });
});
```

## 🎯 O que Acontece

1. **Playground Inicia**: Angular + Cypress Final + File Watcher
2. **Você Edita**: Arquivo em `cypress/e2e-ai/`
3. **Execução Automática**: Teste roda automaticamente
4. **Geração de Teste Final**: Salvo em `cypress/e2e-final/`
5. **Pergunta de Substituição**: Se quer substituir o teste AI

## 🔧 Comandos Úteis

```bash
# Ver ajuda
cyai help

# Ver versão
cyai version

# Playground com opções
cyai playground --port 3000 --no-cypress-final

# Executar diretamente (sem playground)
node ../libs/cypress-ai/dist/cli/index.js playground
```

## 🎨 Exemplos Avançados

### Teste de Formulário Complexo
```javascript
describe('Formulário de Cadastro', () => {
  it('Deve cadastrar novo usuário', () => {
    cy.visit('/cadastro');
    
    cy.prompt([
      'Preencha o nome com "João Silva"',
      'Preencha o email com "joao@exemplo.com"',
      'Preencha a senha com "MinhaSenh@123"',
      'Confirme a senha com "MinhaSenh@123"',
      'Selecione o estado "São Paulo"',
      'Marque o checkbox "Aceito os termos"',
      'Clique em "Cadastrar"',
      'Verifique se aparece "Cadastro realizado com sucesso"'
    ]);
    
    cy.runFinal();
  });
});
```

### Teste de Navegação
```javascript
describe('Navegação do Site', () => {
  it('Deve navegar entre páginas', () => {
    cy.visit('/');
    
    cy.prompt([
      'Clique no menu "Produtos"',
      'Verifique se a página de produtos carregou',
      'Clique no primeiro produto',
      'Verifique se a página do produto abriu',
      'Clique em "Adicionar ao Carrinho"',
      'Verifique se aparece "Produto adicionado"',
      'Clique no ícone do carrinho',
      'Verifique se o produto está no carrinho'
    ]);
    
    cy.runFinal();
  });
});
```

## 🚨 Troubleshooting

### Erro: "command not found"
```bash
# Reinstalar
npm uninstall -g cypress-ai
npm install -g cypress-ai

# Ou usar npx
npx cypress-ai playground
```

### Erro: "Cannot find module"
```bash
# Recompilar
cd cypress-ai
npm run build
npm install -g .
```

### Angular não inicia
```bash
# Verificar se está no diretório correto
pwd
ls package.json

# Verificar scripts
npm run start
```

## 🎉 Próximos Passos

1. **Explore os Exemplos**: Veja mais em `examples/`
2. **Leia a Documentação**: [CLI.md](./CLI.md)
3. **Configure Ollama**: [README.md](./README.md#configuração-do-ollama)
4. **Contribua**: [Contribuição](./README.md#contribuição)

## 📞 Suporte

- **Issues**: [GitHub Issues](https://github.com/seu-usuario/cypress-ai/issues)
- **Documentação**: [README.md](./README.md)
- **CLI Guide**: [CLI.md](./CLI.md)