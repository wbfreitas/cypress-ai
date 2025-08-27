module.exports = { installCypressAiPlugin }

// libs/cypress-ai/src/agent.js
const fs = require('fs');
const path = require('path');
const { default: fetch } = require('node-fetch');

// constrói o prompt, como você já tinha definido:
function buildPrompt(instructions, existing, html) {
  const steps = Array.isArray(instructions) ? instructions.join('\n- ') : String(instructions)
  return `Você é um especialista em testes E2E com Cypress. Gere um teste completo baseado no HTML fornecido e na instrução do usuário.

      **REGRAS ESTRITAS:**
      1. Use APENAS elementos que existam no HTML fornecido
      2. Não invente elementos, classes ou IDs que não estejam presentes
      3. Priorize seletores por data-cy, data-testid ou data-test quando disponíveis
      4. Na ausência de atributos de teste, use classes CSS ou hierarquia de elementos
      5. Sempre inclua assertions para validar o comportamento esperado
      6. Escreva o teste em JavaScript para Cypress
      7. Siga as instruções do teste para gerar os arquivos

      **HTML Para os testes:**
       ${html}

       **INSTRUÇÃO DO TESTE:**
       ${steps}

        **FORMATO DE SAÍDA:**
        Retorne APENAS o código JavaScript do teste Cypress, sem explicações adicionais. Use a seguinte

          describe('Teste E2E', () => {
            it('deve executar a ação solicitada', () => {
              cy.visit('/');
              // código do teste aqui
            });
          });
      `
}

function installCypressAiPlugin(on, config, defaults = {}) {
  on('task', {
    async 'cypress-ai:generate'({ instructions, html, specPath, agent = 'ollama', model }) {
      const abs = path.resolve(specPath);
      const dir = path.dirname(abs);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

      // lê o arquivo final, se existir, para evolução do teste
      const existing = fs.existsSync(abs) ? fs.readFileSync(abs, 'utf8') : '';

      // suporta apenas o agente 'ollama' por enquanto
      if (agent !== 'ollama') {
        throw new Error(`Agente '${agent}' não implementado. Estenda installCypressAiPlugin para suportá-lo.`);
      }

      const resolvedModel = model || defaults.model || 'qwen2.5-coder:latest';
      const base = process.env.AI_OLLAMA_BASE_URL || defaults.apiBase || 'http://127.0.0.1:11434';
      const prompt = buildPrompt(instructions, existing, html);

      const response = await fetch(`${base}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: resolvedModel, prompt, stream: false })
      });

      if (!response.ok) {
        const text = await response.text().catch(() => '');
        throw new Error(`Ollama retornou ${response.status}: ${text}`);
      }

      const data = await response.json();
      const code = (data?.response || '').trim();
      if (!code) throw new Error('IA não retornou código de teste.');

      // grava/atualiza o teste final
       fs.writeFileSync(abs, code, 'utf8');
      return true;
    }
  });

  // aplica valores padrão de specPattern e baseUrl se não definidos
  if (!config.specPattern) config.specPattern = 'cypress/e2e-ai/**/*.cy.{js,ts}';
  if (!config.baseUrl) config.baseUrl = 'http://localhost:4200';
  return config;
}

module.exports = { installCypressAiPlugin };