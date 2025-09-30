// libs/cypress-ai-v2/src/core/PromptTemplates.ts

/**
 * Templates de prompts para geração de testes com IA
 */
export class PromptTemplates {
  
  /**
   * Constrói prompt com formato JSON para resposta estruturada
   */
  static buildJsonFormatPrompt(instructions: string | string[], context: string, attempt: number): string {
    const steps = Array.isArray(instructions) ? instructions.join('\n- ') : String(instructions);
    
    return `Você é um especialista em testes E2E com Cypress. Gere um teste baseado EXATAMENTE nas instruções fornecidas e APENAS nos elementos presentes no contexto HTML.

**INSTRUÇÕES:**
${steps}

**CONTEXTO DA PÁGINA:**
${context}

**FORMATO DE RESPOSTA OBRIGATÓRIO:**
Responda APENAS com um JSON válido no seguinte formato:
{
  "success": true/false,
  "script": "código do teste Cypress completo",
  "error": "descrição do erro se houver",
  "suggestion": "código Cypress para executar antes do teste (ex: abrir modal, fazer login, etc.)"
}

**REGRAS OBRIGATÓRIAS:**
1. Use APENAS elementos que existem no HTML fornecido no contexto
2. NÃO invente elementos, classes ou IDs que não estão no HTML
3. Use seletores ESPECÍFICOS baseados no HTML real (.modal, .button, etc.)
4. Use cy.contains() para buscar por texto EXATO que existe no HTML
5. Sempre aguarde elementos com .should('be.visible')
6. Use .click({ force: true }) apenas quando necessário
7. NÃO faça login se não foi solicitado nas instruções
8. NÃO teste cenários de erro se não foi solicitado
9. Use describe() e it() para organizar os testes
10. Adicione comentários explicativos nos testes

**REGRAS ESPECIAIS PARA MODAL E FORMULÁRIO:**
- SEMPRE faça login primeiro e navegue para /dashboard
- Para modais: use cy.contains('button', 'Abrir Modal').click() antes de testar
- Para formulários: navegue para /form antes de testar

**EXEMPLO DE RESPOSTA:**
{
  "success": true,
  "script": "describe('Teste de Modal', () => { beforeEach(() => { cy.visit('/dashboard'); }); it('deve abrir modal', () => { cy.contains('button', 'Abrir Modal').click(); cy.contains('Título do Modal').should('be.visible'); }); });",
  "error": null,
  "suggestion": "cy.visit('/dashboard'); cy.contains('button', 'Abrir Modal').click();"
}

**IMPORTANTE:**
- Se elementos não existem no HTML, defina success: false e explique no error
- SEMPRE forneça uma sugestão no campo "suggestion" com código para executar antes do teste
- O script deve ser um teste Cypress completo e executável
- A sugestão deve conter ações como: cy.visit('/dashboard'), cy.contains('button', 'Abrir Modal').click(), etc.
- Responda APENAS com o JSON, sem texto adicional`;
  }

  /**
   * Constrói prompt inicial para geração do teste (formato antigo)
   */
  static buildInitialPrompt(instructions: string | string[], context: string): string {
    const steps = Array.isArray(instructions) ? instructions.join('\n- ') : String(instructions);
    
    return `Você é um especialista em testes E2E com Cypress. Gere um teste baseado EXATAMENTE nas instruções fornecidas e APENAS nos elementos presentes no contexto HTML.

**INSTRUÇÕES:**
${steps}

**CONTEXTO DA PÁGINA:**
${context}

**REGRAS OBRIGATÓRIAS:**
1. Use APENAS elementos que existem no HTML fornecido no contexto
2. NÃO invente elementos, classes ou IDs que não estão no HTML
3. Use seletores ESPECÍFICOS baseados no HTML real (.modal, .button, etc.)
4. Use cy.contains() para buscar por texto EXATO que existe no HTML
5. Sempre aguarde elementos com .should('be.visible')
6. Use .click({ force: true }) apenas quando necessário
7. NÃO faça login se não foi solicitado nas instruções
8. NÃO teste cenários de erro se não foi solicitado
9. Use describe() e it() para organizar os testes
10. Adicione comentários explicativos nos testes

**REGRAS ESPECIAIS PARA MODAL E FORMULÁRIO:**
- SEMPRE faça login primeiro e navegue para /dashboard
- Para modais: use cy.contains('button', 'Abrir Modal').click() antes de testar
- Para formulários: navegue para /form antes de testar

**FORMATO DE SAÍDA:**
Gere APENAS o código JavaScript do teste Cypress, sem markdown ou explicações adicionais.`;
  }

  /**
   * Constrói prompt de feedback de erro para retry
   */
  static buildErrorFeedbackPrompt(options: {
    originalInstructions: string | string[];
    generatedTest: string;
    error: string;
    retryCount: number;
  }): string {
    const steps = Array.isArray(options.originalInstructions) 
      ? options.originalInstructions.join('\n- ') 
      : String(options.originalInstructions);
    
    return `Você é um especialista em testes E2E com Cypress. O teste anterior falhou e precisa ser corrigido.

**INSTRUÇÕES ORIGINAIS:**
${steps}

**TESTE GERADO QUE FALHOU:**
\`\`\`javascript
${options.generatedTest}
\`\`\`

**ERRO ENCONTRADO:**
${options.error}

**TENTATIVA:**
${options.retryCount + 1}

**INSTRUÇÕES PARA CORREÇÃO:**
1. Analise o erro e identifique o problema
2. Corrija o teste mantendo as instruções originais
3. Use APENAS elementos que existem no HTML fornecido
4. Verifique se os seletores estão corretos
5. Adicione aguardas (.should()) quando necessário
6. Use .click({ force: true }) apenas quando necessário

**FORMATO DE SAÍDA:**
Gere APENAS o código JavaScript corrigido, sem markdown ou explicações adicionais.`;
  }

  /**
   * Constrói prompt para geração de código de captura HTML dinâmico
   */
  static buildHtmlCapturePrompt(instructions: string | string[], failedTest: string, error: string): string {
    const steps = Array.isArray(instructions) ? instructions.join('\n- ') : String(instructions);
    
    return `Você é um especialista em testes E2E com Cypress. O teste falhou porque elementos não foram encontrados. Gere código para executar ações e capturar o HTML dinâmico.

**INSTRUÇÕES ORIGINAIS:**
${steps}

**TESTE QUE FALHOU:**
\`\`\`javascript
${failedTest}
\`\`\`

**ERRO:**
${error}

**TAREFA:**
Gere código Cypress que:
1. Faça login primeiro (se necessário)
2. Navegue para /dashboard
3. Execute as ações necessárias (ex: clicar em "Abrir Modal")
4. Capture o HTML da página após as ações
5. Use cy.log('HTML_CAPTURED:' + document.body.innerHTML) para capturar

**EXEMPLO DE CÓDIGO:**
\`\`\`javascript
describe('Captura HTML Dinâmico', () => {
  it('executa ações e captura HTML', () => {
    cy.visit('http://localhost:4200/login');
    cy.get('input[type="email"]').type('test@example.com');
    cy.get('input[type="password"]').type('password123');
    cy.get('button[type="submit"]').click();
    
    cy.visit('http://localhost:4200/dashboard');
    cy.contains('button', 'Abrir Modal').click();
    
    cy.get('body').then(($body) => {
      const html = $body.html();
      cy.log('HTML_CAPTURED:' + html);
    });
  });
});
\`\`\`

**FORMATO DE SAÍDA:**
Gere APENAS o código JavaScript, sem markdown ou explicações adicionais.`;
  }

  /**
   * Constrói prompt para geração de nome inteligente de arquivo
   */
  static buildIntelligentFileNamePrompt(instructions: string | string[]): string {
    const steps = Array.isArray(instructions) ? instructions.join(', ') : String(instructions);
    
    return `Você é um especialista em nomenclatura de arquivos. Gere um nome descritivo e limpo para um arquivo de teste Cypress.

**INSTRUÇÕES DO TESTE:**
${steps}

**REGRAS:**
1. Use português brasileiro
2. Seja descritivo mas conciso
3. Use hífens para separar palavras
4. NÃO use a palavra "teste"
5. NÃO inclua data ou timestamp
6. Foque na funcionalidade principal
7. Use kebab-case (minúsculas com hífens)

**EXEMPLOS:**
- "login-usuario-valido" (para teste de login)
- "abrir-fechar-modal" (para teste de modal)
- "preencher-formulario-contato" (para teste de formulário)
- "navegacao-dashboard" (para teste de navegação)

**RESPOSTA:**
Gere APENAS o nome do arquivo, sem extensão, sem explicações.`;
  }

  /**
   * Constrói prompt com HTML dinâmico capturado
   */
  static buildDynamicHtmlPrompt(
    instructions: string | string[], 
    originalHtml: string, 
    dynamicHtml: string, 
    error: string
  ): string {
    const steps = Array.isArray(instructions) ? instructions.join('\n- ') : String(instructions);
    
    return `Você é um especialista em testes E2E com Cypress. Agora você tem acesso ao HTML dinâmico capturado após as ações necessárias.

**INSTRUÇÕES:**
${steps}

**HTML ORIGINAL (antes das ações):**
${originalHtml}

**HTML DINÂMICO (após as ações):**
${dynamicHtml}

**ERRO ANTERIOR:**
${error}

**TAREFA:**
Gere um teste Cypress completo que:
1. Use o HTML dinâmico para encontrar os elementos corretos
2. Execute as instruções fornecidas
3. Inclua as ações necessárias (ex: abrir modal) no teste
4. Seja robusto e confiável

**REGRAS:**
1. Use APENAS elementos que existem no HTML dinâmico
2. Inclua as ações necessárias no teste (ex: cy.contains('button', 'Abrir Modal').click())
3. Use seletores específicos baseados no HTML real
4. Adicione aguardas apropriadas
5. Use describe() e it() para organizar

**FORMATO DE SAÍDA:**
Gere APENAS o código JavaScript do teste, sem markdown ou explicações adicionais.`;
  }
}
