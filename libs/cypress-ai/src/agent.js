module.exports = { installCypressAiPlugin }

// libs/cypress-ai/src/agent.js
const fs = require('fs');
const path = require('path');
const { default: fetch } = require('node-fetch');
const child_process = require('child_process');

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
      8. Caso exista um teste final, ele foi executado antes de gerar o html que você está recebendo
      9. Complete o teste existente, se houver caso for necessario, Não remova teste existente, atualize-o quando for necessario ou crie cenarios novos quando você entender que faz sentido e não pertence ao contexto existe.

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

        **TESTE EXISTENTE (se houver):**
        ${existing}
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

      const textoLimpo = code.replace(/^```javascript\n/, '').replace(/\n```$/, '');

      // grava/atualiza o teste final
       fs.writeFileSync(abs, textoLimpo, 'utf8');
      return true;
    }
    ,
    // verifica se o spec final existe e, se existir, executa-o via cypress run
    async 'cypress-ai:run-if-exists'({ specPath, baseUrl = 'http://localhost:4200' }) {
      try {
        const abs = path.resolve(specPath);
        if (!fs.existsSync(abs)) return { ran: false };

        // monta o comando para rodar apenas o spec existente
        const specArg = abs;
        const args = ['cypress', 'run', '--spec', specArg, '--config', `baseUrl=${baseUrl}`];

        // usa npx para executar cypress a partir do projeto (garante binário local)
        const cmd = process.platform === 'win32' ? 'npx.cmd' : 'npx';

        // roda de forma síncrona para simplificar e retornar o resultado
        const result = child_process.spawnSync(cmd, args, { encoding: 'utf8' });

        return {
          ran: true,
          status: result.status,
          stdout: result.stdout || '',
          stderr: result.stderr || ''
        };
      } catch (err) {
        return { ran: false, error: String(err) };
      }
    }
  });

  // aplica valores padrão de specPattern e baseUrl se não definidos
  if (!config.specPattern) config.specPattern = 'cypress/e2e-ai/**/*.cy.{js,ts}';
  if (!config.baseUrl) config.baseUrl = 'http://localhost:4200';
  return config;
}

module.exports = { installCypressAiPlugin };