// import { defineConfig } from 'cypress'
// // usa o plugin da lib (lado Node)
// // eslint-disable-next-line @typescript-eslint/no-var-requires
// const { installCypressAiPlugin } = require('./libs/cypress-ai/src/agent')

// export default defineConfig({
//   e2e: {
//     baseUrl: 'http://localhost:4200',
//     supportFile: 'cypress/support/e2e.ts',
//     // procure SOMENTE specs IA aqui (os finais rodam via script cy:final)
//     specPattern: 'cypress/e2e-ai/**/*.cy.{js,ts}',
//     video: false,
//     setupNodeEvents(on, config) {
//       return installCypressAiPlugin(on, config, { model: 'qwen2.5-coder:latest' })
//     }
//   }
// })