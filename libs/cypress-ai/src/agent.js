// libs/cypress-ai/src/agent.js
const fs = require('fs')
const path = require('path')

function buildPrompt(instructions, existing) {
  const steps = Array.isArray(instructions) ? instructions.join('\\n- ') : String(instructions)
  return (
    `SELEÇÃO DE ELEMENTOS (em ordem de preferência):
    1. data-cy="nome-do-elemento"
    2. data-test="nome-do-elemento"  
    3. data-testid="nome-do-elemento"
    4. [role="button"], [role="form"], etc.
    5. .classe-css-semantica
    6. Garanta que está usando seletores existes

    PADRÕES OBRIGATÓRIOS:
    - Use cy.intercept() para mockar APIs
    - Inclua cy.wait() após ações assíncronas
    - Adicione múltiplas assertions
    - Use Page Object Pattern quando aplicável

    INSTRUÇÕES DO TESTE:
    ${steps}
    CÓDIGO EXISTENTE PARA ATUALIZAR:
    ${existing || '// Novo teste'}
    Responda APENAS com o código Cypress completo, pronto para execução.`)
}

function installCypressAiPlugin(on, config, defaults = {}) {
  on('task', {
    async 'cypress-ai:generate'({ instructions, specPath, agent = 'ollama', model }) {
      const abs = path.resolve(specPath)
      const dir = path.dirname(abs)
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })

      const existing = fs.existsSync(abs) ? fs.readFileSync(abs, 'utf8') : ''

      if (agent !== 'ollama') {
        throw new Error(`Agente '${agent}' não implementado. Estenda installCypressAiPlugin para suportá-lo.`)
      }

      const resolvedModel = model || defaults.model || 'qwen2.5-coder:latest'
      const base = process.env.AI_OLLAMA_BASE_URL || defaults.apiBase || 'http://127.0.0.1:11434'

      const resp = await fetch(`${base}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: resolvedModel,
          prompt: buildPrompt(instructions, existing),
          stream: false
        })
      })

      if (!resp.ok) {
        const text = await resp.text().catch(() => '')
        throw new Error(`Ollama retornou ${resp.status}: ${text}`)
      }

      const data = await resp.json()
      const code = (data?.response || '').trim()
      if (!code) throw new Error('IA não retornou código de teste.')

      fs.writeFileSync(abs, code, 'utf8')
      return true
    }
  })

  if (!config.specPattern) config.specPattern = 'cypress/e2e-ai/**/*.cy.{js,ts}'
  if (!config.baseUrl) config.baseUrl = 'http://localhost:4200'
  return config
}

module.exports = { installCypressAiPlugin }