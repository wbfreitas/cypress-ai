# 🎮 Cypress AI Playground

Um ambiente de desenvolvimento automatizado para testes E2E com IA usando Cypress e Ollama.

## 🚀 Início Rápido

```bash
# Instalar dependências
npm install

# Iniciar o playground (recomendado)
npm run playground

# Ou executar comandos individuais
npm start                    # Aplicação Angular
npm run cy:final            # Cypress Final
npm run cy:ai:run           # Testes AI
```

## 🎯 O que é o Playground?

O **Playground** é um comando que automatiza todo o fluxo de desenvolvimento:

1. **🚀 Inicia a aplicação Angular** automaticamente
2. **👀 Monitora arquivos** em `cypress/e2e-ai/`
3. **🔄 Executa testes** automaticamente quando você edita arquivos
4. **📊 Mostra resultados** em tempo real
5. **🎨 Abre Cypress Final** para visualizar testes gerados

## 📁 Estrutura do Projeto

```
my-angular-app/
├── cypress/
│   ├── e2e-ai/           # ✏️  Testes que você edita (monitorados)
│   ├── e2e-final/        # 🤖 Testes gerados pela IA
│   └── support/
├── scripts/
│   └── playground.js     # 🎮 Script do playground
└── src/                  # 📱 Aplicação Angular
```

## 🎮 Como Usar o Playground

### 1. Iniciar o Playground
```bash
npm run playground
```

### 2. Editar Testes
Crie ou edite arquivos em `cypress/e2e-ai/`:

```javascript
// cypress/e2e-ai/meu-teste.cy.js
describe('Meu Teste', () => {
  it('Deve fazer login', () => {
    cy.visit('/');
    
    cy.prompt([
      'Faça login com user@ex.com e senha 123456',
      'Verifique que aparece o dashboard'
    ]);
    
    cy.runFinal(); // Executa e pergunta sobre substituição
  });
});
```

### 3. Ver Resultados
- **Terminal**: Mostra execução automática dos testes
- **Cypress Final**: Interface visual dos testes gerados
- **Aplicação**: Rodando em http://localhost:4200

## 🔧 Comandos Disponíveis

| Comando | Descrição |
|---------|-----------|
| `npm run playground` | 🎮 **Recomendado**: Ambiente completo automatizado |
| `npm start` | 🚀 Inicia apenas a aplicação Angular |
| `npm run cy:final` | 🎨 Abre Cypress Final para visualizar testes |
| `npm run cy:ai:run` | 🤖 Executa testes AI manualmente |
| `npm run build` | 📦 Compila a aplicação |

## 🎯 Fluxo de Trabalho

```mermaid
graph TD
    A[Editar arquivo em e2e-ai/] --> B[Playground detecta mudança]
    B --> C[Executa teste automaticamente]
    C --> D[IA gera teste final]
    D --> E[cy.runFinal() pergunta sobre substituição]
    E --> F[Atualiza teste AI se confirmado]
    F --> G[Mostra resultado no terminal]
```

## 🛠️ Funcionalidades

### ✨ Automação Completa
- **Detecção automática** de mudanças em arquivos
- **Execução automática** de testes
- **Feedback em tempo real** no terminal
- **Cleanup automático** ao sair

### 🤖 IA Integrada
- **Geração de testes** com Ollama
- **Evolução de testes** existentes
- **Substituição inteligente** com confirmação
- **Prompts em português**

### 🎨 Interface Visual
- **Cypress Final** para visualizar testes gerados
- **Aplicação Angular** rodando em tempo real
- **Logs detalhados** de execução

## 🔍 Monitoramento

O playground monitora:
- ✅ **Criação** de novos arquivos `.cy.js` ou `.cy.ts`
- ✅ **Modificação** de arquivos existentes
- ✅ **Execução** automática de testes
- ✅ **Prevenção** de execuções duplicadas

## 🚨 Tratamento de Erros

- **Aplicação já rodando**: Detecta e continua
- **Teste em execução**: Evita execuções duplicadas
- **Erro de teste**: Mostra detalhes do erro
- **Cleanup automático**: Para todos os processos ao sair

## 📝 Logs e Feedback

```
🚀 Iniciando Cypress Playground...
🔄 Iniciando aplicação Angular...
✅ Aplicação Angular iniciada em http://localhost:4200
🔄 Iniciando Cypress Final...
✅ Cypress Final iniciado
👀 Iniciando watcher para arquivos cypress/e2e-ai/...
✅ Playground iniciado com sucesso!

🔄 Arquivo modificado: cypress/e2e-ai/meu-teste.cy.js
🚀 Executando teste: meu-teste.cy.js
✅ Teste executado com sucesso!
```

## 🎮 Controles

- **Ctrl+C**: Para o playground e limpa todos os processos
- **Modificação de arquivo**: Executa teste automaticamente
- **Cypress Final**: Interface visual para testes gerados

## 🔧 Configuração

### Ollama
Certifique-se de que o Ollama está rodando:
```bash
ollama serve
ollama pull qwen2.5-coder:latest
```

### Variáveis de Ambiente (Opcional)
```bash
export AI_OLLAMA_BASE_URL=http://localhost:11434
```

## 🎉 Exemplo Completo

1. **Inicie o playground**:
   ```bash
   npm run playground
   ```

2. **Crie um teste**:
   ```javascript
   // cypress/e2e-ai/login.cy.js
   describe('Login', () => {
     it('Deve fazer login com sucesso', () => {
       cy.visit('/');
       cy.prompt(['Faça login com user@ex.com e senha 123456']);
       cy.runFinal();
     });
   });
   ```

3. **Veja a mágica acontecer**:
   - Teste executa automaticamente
   - IA gera teste final
   - Pergunta se quer substituir
   - Mostra resultado no terminal

## 🚀 Próximos Passos

- Edite arquivos em `cypress/e2e-ai/`
- Veja os testes executarem automaticamente
- Use `cy.prompt()` para instruções em português
- Use `cy.runFinal()` para substituir testes
- Aproveite o desenvolvimento automatizado! 🎉

