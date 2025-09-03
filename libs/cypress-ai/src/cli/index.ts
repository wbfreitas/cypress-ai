#!/usr/bin/env node

import { Command } from 'commander';
import { PlaygroundCommand } from './commands/playground';
import { VersionCommand } from './commands/version';

const program = new Command();

program
  .name('cyai')
  .description('Cypress AI CLI - Ferramentas para testes E2E com IA')
  .version('0.2.0');

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
  cyai playground     Inicia o ambiente de desenvolvimento automatizado
  cyai version        Mostra informações da versão
  cyai help           Mostra esta ajuda

🎮 Exemplos:
  npx cyai playground                    # Inicia o playground
  npx cyai playground --port 3000       # Inicia na porta 3000
  npx cyai playground --no-cypress-final # Sem abrir Cypress Final
  npx cyai version                       # Mostra versão

🔧 Opções do Playground:
  -p, --port <port>        Porta da aplicação Angular (padrão: 4200)
  --no-cypress-final       Não abrir Cypress Final automaticamente
  --no-watch               Não monitorar arquivos automaticamente

📚 Documentação: https://github.com/seu-usuario/cypress-ai
    `);
  });

// Se nenhum comando for fornecido, mostra ajuda
if (process.argv.length === 2) {
  program.help();
}

program.parse();

