// libs/cypress-ai/src/types/cypress.d.ts
declare global {
  namespace Cypress {
    interface Chainable {
      ai(instructions: string | string[], options?: import('./index').AiCommandOptions): Chainable<any>;
      prompt(steps: string | string[], options?: import('./index').PromptOptions): Chainable<any>;
    }

    interface PluginEvents {
      (action: 'task', taskHandler: (taskName: string, options?: any) => any): void;
    }

    interface PluginConfigOptions {
      specPattern?: string | string[];
      baseUrl?: string;
    }
  }
}

export {};

