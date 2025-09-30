// libs/cypress-ai-v2/src/cli/index.ts
import { Command } from 'commander';
import { SetupCommand } from './setup';
import { RunCommand } from './run';
import { OpenCommand } from './open';
import { GenerateCommand } from './generate';

const program = new Command();

program
  .name('cyai-v2')
  .description('Cypress AI v2.0 - Biblioteca simplificada para geração automática de testes')
  .version('2.0.0');

// Comando setup
program
  .command('setup')
  .description('Configura o Cypress AI v2.0')
  .option('-r, --realm <realm>', 'StackSpot Realm', 'stackspot-freemium')
  .option('-c, --client-id <clientId>', 'StackSpot Client ID')
  .option('-a, --agent-id <agentId>', 'StackSpot Agent ID')
  .option('-k, --client-key <clientKey>', 'StackSpot Client Key')
  .option('-b, --base-url <baseUrl>', 'Base URL da aplicação', 'http://localhost:4200')
  .option('-m, --model <model>', 'Modelo de IA', 'qwen2.5-coder:latest')
  .action(async (options) => {
    const setupCommand = new SetupCommand();
    await setupCommand.run();
  });

// Comando run
program
  .command('run')
  .description('Executa os testes Cypress (padrão: pasta e2e-final)')
  .option('-s, --spec <spec>', 'Arquivo de teste específico (padrão: cypress/e2e-final/**/*.cy.{js,ts})')
  .option('-b, --browser <browser>', 'Navegador para executar (chrome, firefox, edge, electron)')
  .option('--headed', 'Executa com interface gráfica (não headless)')
  .option('-c, --config <config>', 'Arquivo de configuração do Cypress')
  .option('-e, --env <env>', 'Variáveis de ambiente')
  .option('--reporter <reporter>', 'Reporter para os resultados')
  .option('--reporter-options <options>', 'Opções do reporter')
  .action(async (options) => {
    const runCommand = new RunCommand();
    await runCommand.run({
      spec: options.spec,
      browser: options.browser,
      headless: !options.headed,
      config: options.config,
      env: options.env,
      reporter: options.reporter,
      reporterOptions: options.reporterOptions
    });
  });

// Comando open
program
  .command('open')
  .description('Abre o Cypress no modo interativo (padrão: pasta e2e-final)')
  .option('-s, --spec <spec>', 'Arquivo de teste específico (padrão: cypress/e2e-final/**/*.cy.{js,ts})')
  .option('-b, --browser <browser>', 'Navegador para abrir (chrome, firefox, edge)')
  .option('-c, --config <config>', 'Arquivo de configuração do Cypress')
  .option('-e, --env <env>', 'Variáveis de ambiente')
  .option('--global', 'Usa instalação global do Cypress')
  .action(async (options) => {
    const openCommand = new OpenCommand();
    await openCommand.run({
      spec: options.spec,
      browser: options.browser,
      config: options.config,
      env: options.env,
      global: options.global
    });
  });

// Comando generate
program
  .command('generate')
  .description('Executa os testes de geração (pasta e2e-ai)')
  .option('-s, --spec <spec>', 'Arquivo de teste específico (padrão: cypress/e2e-ai/**/*.cy.{js,ts})')
  .option('-b, --browser <browser>', 'Navegador para executar (chrome, firefox, edge, electron)')
  .option('--headed', 'Executa com interface gráfica (não headless)')
  .option('-c, --config <config>', 'Arquivo de configuração do Cypress')
  .option('-e, --env <env>', 'Variáveis de ambiente')
  .option('--reporter <reporter>', 'Reporter para os resultados')
  .option('--reporter-options <options>', 'Opções do reporter')
  .action(async (options) => {
    const generateCommand = new GenerateCommand();
    await generateCommand.run({
      spec: options.spec,
      browser: options.browser,
      headless: !options.headed,
      config: options.config,
      env: options.env,
      reporter: options.reporter,
      reporterOptions: options.reporterOptions
    });
  });

// Comando help
program
  .command('help')
  .description('Mostra ajuda detalhada')
  .action(() => {
    console.log(`
🤖 Cypress AI v2.0 - Biblioteca Simplificada

📋 COMANDOS DISPONÍVEIS:

1. Setup (Configuração inicial):
   cyai-v2 setup --client-id <id> --agent-id <id> --client-key <key>
   
   Opções:
   --realm <realm>        StackSpot Realm (padrão: stackspot-freemium)
   --client-id <id>       StackSpot Client ID (obrigatório)
   --agent-id <id>        StackSpot Agent ID (obrigatório)
   --client-key <key>     StackSpot Client Key (obrigatório)
   --base-url <url>       Base URL da aplicação (padrão: http://localhost:4200)
   --model <model>        Modelo de IA (padrão: qwen2.5-coder:latest)

2. Executar testes:
   cyai-v2 run                    # Executa todos os testes da pasta e2e-final
   cyai-v2 run --spec <arquivo>   # Executa teste específico
   cyai-v2 run --browser chrome   # Executa no Chrome
   cyai-v2 run --headed           # Executa com interface gráfica

3. Executar testes de geração:
   cyai-v2 generate               # Executa todos os testes da pasta e2e-ai
   cyai-v2 generate --spec <arquivo> # Executa teste específico
   cyai-v2 generate --browser chrome # Executa no Chrome
   cyai-v2 generate --headed      # Executa com interface gráfica

4. Abrir Cypress:
   cyai-v2 open                   # Abre Cypress interativo (pasta e2e-final)
   cyai-v2 open --spec <arquivo>  # Abre teste específico
   cyai-v2 open --browser chrome  # Abre no Chrome

5. Uso nos testes:
   cy.ai('Teste o botão de login')
   cy.ai(['Teste login', 'Teste logout'])
   cy.ai('Teste o modal', { specPath: 'cypress/e2e-final/modal.cy.js' })

📁 ESTRUTURA CRIADA:
   cypress/
   ├── e2e-ai/           # Testes gerados pela IA
   ├── e2e-final/        # Testes finais (atualizados automaticamente)
   └── support/
       └── e2e.ts        # Configuração de suporte

🔧 CONFIGURAÇÃO:
   .env                  # Variáveis de ambiente
   cypress.config.ts     # Configuração do Cypress

📖 EXEMPLO COMPLETO:
   1. cyai-v2 setup --client-id abc123 --agent-id def456 --client-key ghi789
   2. npm start
   3. cyai-v2 open
   4. cy.ai('Teste o formulário de login')
   5. cyai-v2 generate --spec cypress/e2e-ai/teste-login.cy.js
   6. cyai-v2 run --spec cypress/e2e-final/teste-login.cy.js

✨ CARACTERÍSTICAS:
   - Comando único: cy.ai()
   - Captura contexto automático
   - Retry automático com feedback de erro
   - Atualização automática de testes finais
   - Configuração simplificada
   - Focado no StackSpot
    `);
  });

// Executa o CLI
program.parse();
