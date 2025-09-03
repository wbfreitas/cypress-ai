# Cypress Playground

O comando `playground` automatiza todo o fluxo de desenvolvimento com Cypress AI.

## 🚀 Como Usar

```bash
npm run playground
```

## 🔧 O que o Playground Faz

1. **Inicia a aplicação Angular** em `http://localhost:4200`
2. **Abre o Cypress Final** para visualizar os testes gerados
3. **Monitora arquivos** na pasta `cypress/e2e-ai/`
4. **Executa automaticamente** os testes quando arquivos são modificados

## 📁 Estrutura de Arquivos

```
cypress/
├── e2e-ai/           # Testes que usam IA (monitorados)
│   └── form.cy.js
├── e2e-final/        # Testes finais gerados
│   └── form.cy.js
└── support/
    └── e2e.ts
```

## 🎯 Fluxo de Trabalho

1. **Edite** um arquivo em `cypress/e2e-ai/`
2. **Playground detecta** a mudança automaticamente
3. **Executa** o teste usando `npm run cy:ai:run`
4. **Visualiza** o resultado no terminal
5. **Cypress Final** mostra os testes gerados

## 🛠️ Comandos Disponíveis

- `npm run playground` - Inicia o ambiente completo
- `npm run cy:ai:run` - Executa testes AI manualmente
- `npm run cy:final` - Abre Cypress Final manualmente
- `npm start` - Inicia apenas a aplicação Angular

## 🔍 Monitoramento

O playground monitora:
- ✅ Criação de novos arquivos `.cy.js` ou `.cy.ts`
- ✅ Modificação de arquivos existentes
- ✅ Execução automática de testes
- ✅ Feedback em tempo real

## 🚨 Tratamento de Erros

- **Aplicação já rodando**: Detecta e continua
- **Teste em execução**: Evita execuções duplicadas
- **Erro de teste**: Mostra detalhes do erro
- **Cleanup automático**: Para todos os processos ao sair

## 📝 Logs

O playground mostra:
- 🔄 Status de inicialização
- ✅ Confirmação de serviços
- 🚀 Execução de testes
- ❌ Erros e falhas
- 📊 Resultados dos testes

## 🎮 Controles

- **Ctrl+C**: Para o playground e limpa todos os processos
- **Modificação de arquivo**: Executa teste automaticamente
- **Cypress Final**: Interface visual para testes gerados

