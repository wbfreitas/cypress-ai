#!/usr/bin/env node

import { Command } from 'commander';
import { PlaygroundCommand } from './commands/playground';
import { VersionCommand } from './commands/version';
import { SetupCommand } from './commands/setup';
import { RunCommand } from './commands/run';

const program = new Command();

program
  .name('cyai')
  .description('Cypress AI CLI - Ferramentas para testes E2E com IA')
  .version('0.2.0');

// Comando setup
program
  .command('setup')
  .description('Configura o projeto Angular para usar Cypress AI')
  .option('-a, --agent <agent>', 'Agente de IA a usar (ollama ou stackspot)', 'ollama')
  .option('-m, --model <model>', 'Modelo do Ollama a usar', 'qwen2.5-coder:latest')
  .option('-u, --base-url <url>', 'URL base da aplicação', 'http://localhost:4200')
  .option('-p, --port <port>', 'Porta da aplicação Angular', '4200')
  .option('--ai-dir <dir>', 'Diretório dos testes AI', 'cypress/e2e-ai')
  .option('--final-dir <dir>', 'Diretório dos testes finais', 'cypress/e2e-final')
  .option('--no-interactive', 'Não usar modo interativo')
  .option('-f, --force', 'Sobrescrever arquivos existentes')
  .action(async (options) => {
    const setup = new SetupCommand();
    await setup.run(options);
  });

// Comando run
program
  .command('run')
  .description('Executa testes Cypress AI')
  .option('-s, --spec <spec>', 'Arquivo de teste específico para executar')
  .option('-p, --port <port>', 'Porta da aplicação Angular', '4200')
  .option('--no-headless', 'Executar em modo interativo (não headless)')
  .option('-b, --browser <browser>', 'Navegador para usar', 'chrome')
  .action(async (options) => {
    const run = new RunCommand();
    await run.run(options);
  });

// Comando playground
program
  .command('playground')
  .description('Inicia o ambiente de desenvolvimento automatizado')
  .option('-p, --port <port>', 'Porta da aplicação Angular', '4200')
  .option('--no-cypress-final', 'Não abrir Cypress Final automaticamente')
  .option('--no-watch', 'Não monitorar arquivos automaticamente')
  .action(async (options) => {
    const playground = new PlaygroundCommand();
    await playground.run(options);
  });

// Comando version
program
  .command('version')
  .description('Mostra informações da versão')
  .action(() => {
    const version = new VersionCommand();
    version.run();
  });

// Comando help personalizado
program
  .command('help')
  .description('Mostra ajuda detalhada')
  .action(() => {
    console.log(`
🚀 Cypress AI CLI - Comandos Disponíveis

📋 Comandos:
  cyai setup          Configura o projeto Angular para usar Cypress AI
  cyai run            Executa testes Cypress AI
  cyai playground     Inicia o ambiente de desenvolvimento automatizado
  cyai version        Mostra informações da versão
  cyai help           Mostra esta ajuda

🎮 Exemplos:
  npx cyai setup                         # Configura o projeto (modo interativo)
  npx cyai setup --agent stackspot       # Configura com StackSpot
  npx cyai setup --agent ollama --model llama2  # Configura com Ollama e modelo específico
  npx cyai run                           # Executa todos os testes
  npx cyai run --spec cypress/e2e-ai/login.cy.js  # Executa teste específico
  npx cyai playground                    # Inicia o playground
  npx cyai version                       # Mostra versão

🔧 Opções do Setup:
  -a, --agent <agent>        Agente de IA (ollama ou stackspot, padrão: ollama)
  -m, --model <model>        Modelo do Ollama (padrão: qwen2.5-coder:latest)
  -u, --base-url <url>       URL base da aplicação (padrão: http://localhost:4200)
  -p, --port <port>          Porta da aplicação Angular (padrão: 4200)
  --ai-dir <dir>             Diretório dos testes AI (padrão: cypress/e2e-ai)
  --final-dir <dir>          Diretório dos testes finais (padrão: cypress/e2e-final)
  --no-interactive           Não usar modo interativo
  -f, --force                Sobrescrever arquivos existentes

🔧 Opções do Run:
  -s, --spec <spec>          Arquivo de teste específico para executar
  -p, --port <port>          Porta da aplicação Angular (padrão: 4200)
  --no-headless              Executar em modo interativo (não headless)
  -b, --browser <browser>    Navegador para usar (padrão: chrome)

🔧 Opções do Playground:
  -p, --port <port>          Porta da aplicação Angular (padrão: 4200)
  --no-cypress-final         Não abrir Cypress Final automaticamente
  --no-watch                 Não monitorar arquivos automaticamente

📚 Documentação: https://github.com/wbfreitas/cypress-ai
    `);
  });

// Se nenhum comando for fornecido, mostra ajuda
if (process.argv.length === 2) {
  program.help();
}

program.parse();

