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
        // Se não há teste existente, gera um novo
        if (!existingTest.trim()) {
            return `Você é um especialista em testes E2E com Cypress. Gere um teste completo baseado no HTML fornecido e na instrução do usuário.

      **REGRAS ESTRITAS:**
      1. Use APENAS elementos que existam no HTML fornecido
      2. Não invente elementos, classes ou IDs que não estejam presentes
      3. Priorize seletores por data-cy, data-testid ou data-test quando disponíveis
      4. Na ausência de atributos de teste, use classes CSS ou hierarquia de elementos
      5. Sempre inclua assertions para validar o comportamento esperado
      6. Escreva o teste em JavaScript para Cypress

      **HTML Para os testes:**
       ${html}

       **INSTRUÇÃO DO TESTE:**
       ${steps}

        **FORMATO DE SAÍDA:**
        Retorne APENAS o código JavaScript do teste Cypress, sem explicações adicionais:

          describe('Teste E2E', () => {
            it('deve executar a ação solicitada', () => {
              cy.visit('/');
              // código do teste aqui
            });
          });
      `;
        }
        // Se há teste existente, COMPLETA/EVOLUI o teste
        return `Você é um especialista em testes E2E com Cypress. COMPLETE e EVOLUA o teste existente baseado no HTML fornecido e na instrução do usuário.

      **REGRAS ESTRITAS:**
      1. Use APENAS elementos que existam no HTML fornecido
      2. Não invente elementos, classes ou IDs que não estejam presentes
      3. Priorize seletores por data-cy, data-testid ou data-test quando disponíveis
      4. Na ausência de atributos de teste, use classes CSS ou hierarquia de elementos
      5. Sempre inclua assertions para validar o comportamento esperado
      6. Escreva o teste em JavaScript para Cypress
      7. **IMPORTANTE**: NÃO substitua o teste existente completamente
      8. **IMPORTANTE**: COMPLETE o teste existente adicionando novos cenários ou melhorando o existente
      9. **IMPORTANTE**: Mantenha a estrutura e lógica do teste existente
      10. Adicione novos cenários (novos 'it') quando fizer sentido
      11. Melhore o teste existente se necessário, mas não o remova

      **HTML Para os testes:**
       ${html}

       **INSTRUÇÃO DO TESTE:**
       ${steps}

        **FORMATO DE SAÍDA:**
        Retorne APENAS o código JavaScript do teste Cypress, sem explicações adicionais.
        **COMPLETE o teste existente, NÃO o substitua completamente.**

        **TESTE EXISTENTE (para completar/evoluir):**
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