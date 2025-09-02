"use strict";
// libs/cypress-ai/src/core/PromptBuilder.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.PromptBuilder = void 0;
class PromptBuilder {
    /**
     * Constrói o prompt para geração de testes Cypress
     */
    buildPrompt(instructions, existingTest, html) {
        const steps = Array.isArray(instructions) ? instructions.join('\n- ') : String(instructions);
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
        ${existingTest}
      `;
    }
    /**
     * Limpa o código retornado pela IA removendo markdown
     */
    cleanGeneratedCode(code) {
        return code.replace(/^```javascript\n/, '').replace(/\n```$/, '');
    }
}
exports.PromptBuilder = PromptBuilder;
//# sourceMappingURL=PromptBuilder.js.map