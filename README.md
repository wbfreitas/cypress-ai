# Biblioteca de Testes E2E com IA para Angular e Cypress

Este repositório contém um exemplo de **biblioteca** e projeto **Angular** para demonstrar como integrar IA generativa na criação de testes end‑to‑end (E2E) com o Cypress. O objetivo é agilizar a escrita de testes funcionais em aplicações Angular sem perder a possibilidade de manutenção e evolução manual.

O conteúdo está organizado em duas partes principais:

1. **my-angular-app/** – Um projeto Angular de exemplo com páginas, modais, barra lateral, formulários e cards para links externos. É a base para aplicar a biblioteca de IA e validar o fluxo de navegação e interações comuns.
2. **libs/cypress-ai/** – Uma biblioteca Node que adiciona comandos personalizados ao Cypress e encapsula a chamada para um agente de IA generativa (por exemplo, [Ollama](https://github.com/ollama/ollama)). Essa biblioteca permite escrever testes em linguagem natural através de `cy.prompt()` ou `cy.ai()` e gera/atualiza arquivos de teste prontos para pipeline.

## Estrutura de Pastas

```
teste/
├── my-angular-app/            # Aplicação Angular de exemplo
│   ├── src/
│   │   ├── app/               # Componentes e módulos Angular
│   │   ├── index.html         # Página inicial do Angular
│   │   ├── main.ts            # Bootstrap da aplicação
│   │   └── …
│   ├── angular.json           # Configuração do Angular (simplificada)
│   ├── package.json           # Dependências do projeto
│   └── proxy.conf.json        # Proxy para evitar CORS ao chamar o agente de IA
├── libs/
│   └── cypress-ai/            # Biblioteca de IA para Cypress
│       ├── src/
│       │   ├── commands.js    # Comandos Cypress customizados (cy.ai, cy.prompt)
│       │   └── agent.js       # Lógica para comunicar com o agente de IA
│       ├── package.json       # Configurações da biblioteca
│       └── README.md          # Documentação da biblioteca (português)
├── cypress/
│   ├── e2e-ai/                # Testes escritos em linguagem natural
│   ├── e2e-final/             # Testes finais (gerados e editáveis)
│   └── cypress.config.js      # Configuração do Cypress
└── README.md                  # Este arquivo
```

## Funcionamento Geral

1. **Gerar testes com IA:** os arquivos em `cypress/e2e-ai` utilizam o comando `cy.ai()` ou `cy.prompt()` da nossa biblioteca. Estes comandos mandam as instruções em linguagem natural para o agente de IA (por padrão o [Ollama](https://github.com/ollama/ollama)) e gravam/atualizam o arquivo correspondente em `cypress/e2e-final` com o código Cypress real.
2. **Executar testes com IA:** ao rodar `npm run cy:ai`, os testes em `e2e-ai` são processados pela IA. Esse modo é mais lento (depende do modelo) e serve para criação ou atualização dos scripts finais.
3. **Executar testes finais:** rodar `npm run cy:run` executa apenas os testes prontos em `e2e-final` — ideal para pipeline CI/CD, pois dispensa chamadas à IA.

## Como usar

1. Navegue até o diretório `libs/cypress-ai` e instale as dependências usando `npm install`.
2. Altere `agent.js` caso deseje usar outro serviço de IA (por exemplo, OpenAI). Basta implementar a função `callAgent()` retornando a resposta da IA.
3. No projeto Angular (`my-angular-app`), configure o proxy conforme `proxy.conf.json` e rode a aplicação (`ng serve --proxy-config proxy.conf.json`).
4. Para gerar os testes a partir de instruções em linguagem natural, execute `npm run cy:ai` no diretório raiz. Para rodar os testes finais, use `npm run cy:run`.

## Aviso

Este projeto é um **exemplo educacional**. Ajustes adicionais podem ser necessários para uso em ambientes corporativos, como controle de versões dos testes gerados, monitoramento de token das IAs, autenticação do agente e integração com pipelines existentes.