function registerSupportCommands() {
  Cypress.Commands.add('ai', (instructions, options = {}) => {
    const specName = (Cypress.spec?.name || 'ai-generated.cy.js')
      .replace(/\.cy\.(ts|js)$/i, '.cy.js')
    const finalDir = options.finalDir || 'cypress/e2e-final'
    const specPath = `${finalDir}/${specName}`
    const agent = options.agent || 'ollama'
    const model = options.model || 'qwen2.5-coder:latest'

    return cy.document().then((doc) => {
      const html = doc.documentElement.outerHTML
      return cy.task('cypress-ai:generate', {
        instructions,
        html,
        specPath,
        agent,
        model
      })
    })
  })

  Cypress.Commands.add('prompt', (steps, options = {skip: false}) => {
    if(options.skip) return;

    const text = Array.isArray(steps) ? steps.join('\n') : String(steps)
    return cy.ai(text, options)
  })
}

if (typeof Cypress !== 'undefined') {
  registerSupportCommands()
}

module.exports = { registerSupportCommands }