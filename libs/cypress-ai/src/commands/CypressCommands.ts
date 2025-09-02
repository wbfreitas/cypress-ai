// libs/cypress-ai/src/commands/CypressCommands.ts
import { AiCommandOptions, PromptOptions } from '../types';

// Declaração global para o Cypress
declare const Cypress: any;
declare const cy: any;

export class CypressCommands {
  /**
   * Comando 'ai' para gerar testes usando IA
   */
  static ai(instructions: string | string[], options: AiCommandOptions = {}): any {
    const specName = (Cypress.spec?.name || 'ai-generated.cy.js')
      .replace(/\.cy\.(ts|js)$/i, '.cy.js');
    const finalDir = options.finalDir || 'cypress/e2e-final';
    const specPath = `${finalDir}/${specName}`;
    const agent = options.agent || 'ollama';
    const model = options.model || 'qwen2.5-coder:latest';

    return cy.document().then((doc: any) => {
      const html = doc.documentElement.outerHTML;

      // Apenas gera o teste, não executa mais automaticamente
      return cy.task('cypress-ai:generate', {
        instructions,
        html,
        specPath,
        agent,
        model
      });
    });
  }

  /**
   * Comando 'prompt' para gerar testes com instruções
   */
  static prompt(steps: string | string[], options: PromptOptions = { skip: false }): any {
    if (options.skip) {
      return cy.wrap(null);
    }

    const text = Array.isArray(steps) ? steps.join('\n') : String(steps);
    return CypressCommands.ai(text, options as AiCommandOptions);
  }

  /**
   * Comando 'runFinal' para executar o teste final e perguntar sobre substituição
   */
  static runFinal(options: { baseUrl?: string } = {}): any {
    const specName = (Cypress.spec?.name || 'ai-generated.cy.js')
      .replace(/\.cy\.(ts|js)$/i, '.cy.js');
    const finalDir = 'cypress/e2e-final';
    const aiDir = 'cypress/e2e-ai';
    const finalSpecPath = `${finalDir}/${specName}`;
    const aiSpecPath = `${aiDir}/${specName}`;
    const baseUrl = options.baseUrl || Cypress.config('baseUrl');

    return cy.task('cypress-ai:run-final-and-ask', {
      specPath: finalSpecPath,
      aiSpecPath: aiSpecPath,
      baseUrl: baseUrl
    });
  }
}
