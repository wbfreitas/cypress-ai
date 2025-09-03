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
        agent: process.env.AI_AGENT || 'stackspot',
        model: process.env.AI_OLLAMA_MODEL || 'qwen2.5-coder:latest',
        baseUrl: process.env.AI_OLLAMA_BASE_URL || 'http://localhost:11434'
      })
    },
    video: false,
    screenshotOnRunFailure: false
  }
})
