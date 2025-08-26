// libs/cypress-ai/src/commands.js
function registerSupportCommands() {
  Cypress.Commands.add('ai', (instructions, options = {}) => {
    const specName = (Cypress.spec?.name || 'ai-generated.cy.js')
      .replace(/\\.cy\\.(ts|js)$/i, '.cy.js')
    const finalDir = options.finalDir || 'cypress/e2e-final'
    const specPath = `${finalDir}/${specName}`

    return cy.task('cypress-ai:generate', { 
      instructions,
      specPath,
      agent: options.agent || 'ollama',
      model: options.model || 'qwen2.5-coder:latest'
    })
  })

  Cypress.Commands.add('prompt', (steps) => {
    const arr = Array.isArray(steps) ? steps : [steps]
    arr.forEach((s) => cy.log(`IA step: ${s}`))
  })
}

if (typeof Cypress !== 'undefined') {
  registerSupportCommands()
}

module.exports = { registerSupportCommands }