import { defineConfig } from 'cypress'
import { installCypressAiV2 } from 'cypress-ai-v2'

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:4200',
    supportFile: 'cypress/support/e2e.ts',
    specPattern: [
      'cypress/e2e-ai/**/*.cy.{js,ts}',
      'cypress/e2e-final/**/*.cy.{js,ts}'
    ],
    setupNodeEvents(on, config) {
      return installCypressAiV2(on, config)
    },
    video: false,
    screenshotOnRunFailure: false,
    viewportWidth: 1280,
    viewportHeight: 720,
    defaultCommandTimeout: 10000,
    requestTimeout: 10000,
    responseTimeout: 10000
  }
})
