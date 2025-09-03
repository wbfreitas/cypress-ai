// // cypress.config.ts
// import { defineConfig } from 'cypress'

// export default defineConfig({
//   e2e: {
//     baseUrl: 'http://localhost:4200',
//     supportFile: 'cypress/support/e2e.ts',
//     video: false,
//     specPattern: [
//   'cypress/e2e-ai/**/*.cy.{js,ts}',
//   'cypress/e2e-final/**/*.cy.{js,ts}'
// ]
//   },
// })
import { defineConfig } from 'cypress'
// eslint-disable-next-line @typescript-eslint/no-var-requires
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
      return installCypressAiPlugin(on, config, { model: 'qwen2.5-coder:latest' })
    },
    video: false
  }
})