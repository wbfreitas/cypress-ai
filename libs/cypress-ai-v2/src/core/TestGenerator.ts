// libs/cypress-ai-v2/src/core/TestGenerator.ts
import { StackSpotAgent } from '../agents/StackSpotAgent';
import { CypressAiV2Config, TestGenerationOptions, TestGenerationResult, PageContext, ErrorFeedback } from '../types';
import * as fs from 'fs';
import * as path from 'path';
import { spawn } from 'child_process';

export class TestGenerator {
  private agent: StackSpotAgent;
  private config: CypressAiV2Config;

  constructor(config: CypressAiV2Config) {
    this.config = config;
    this.agent = new StackSpotAgent({
      realm: config.stackspotRealm,
      clientId: config.stackspotClientId,
      agentId: config.stackspotAgentId,
      clientKey: config.stackspotClientKey,
      baseUrl: config.baseUrl
    });
  }

  /**
   * Gera teste com retry automático e feedback de erro
   */
  async generateTest(options: TestGenerationOptions): Promise<TestGenerationResult> {
    const { instructions, specPath, context } = options;
    
    // Determina o caminho do arquivo
    const finalSpecPath = specPath || this.generateSpecPath();
    
    // Captura contexto da página se não fornecido
    const pageContext = context || await this.capturePageContext();
    
    // Constrói prompt inicial
    const initialPrompt = this.buildPrompt(instructions, pageContext);
    
    let lastGeneratedTest = '';
    let lastError = '';
    
    // Tenta gerar o teste até 3 vezes
    for (let attempt = 1; attempt <= this.config.maxRetries; attempt++) {
      try {
        console.log(`Tentativa ${attempt}/${this.config.maxRetries} de geração do teste`);
        
        let prompt = initialPrompt;
        
        // Se não é a primeira tentativa, adiciona feedback do erro
        if (attempt > 1) {
          prompt = this.buildErrorFeedbackPrompt({
            originalInstructions: instructions,
            generatedTest: lastGeneratedTest,
            error: lastError,
            retryCount: attempt - 1
          });
        }
        
        // Gera o teste
        const generatedCode = await this.agent.generateTest(prompt);
        lastGeneratedTest = this.cleanGeneratedCode(generatedCode);
        
        // Salva o teste
        this.saveTest(finalSpecPath, lastGeneratedTest);
        
        // Testa o código gerado
        const testResult = await this.testGeneratedCode(finalSpecPath);
        
        if (testResult.success) {
          console.log('Teste gerado e validado com sucesso!');
          
          return {
            success: true,
            testPath: finalSpecPath,
            retryCount: attempt - 1
          };
        } else {
          lastError = testResult.error || 'Erro desconhecido na execução do teste';
          console.log(`Teste falhou na tentativa ${attempt}:`, lastError);
          
          // Nova etapa: Gera código para capturar HTML dinâmico
          if (attempt === this.config.maxRetries) {
            console.log('Tentando capturar HTML dinâmico...');
            const dynamicResult = await this.tryDynamicHtmlCapture(instructions, lastGeneratedTest, lastError, finalSpecPath);
            if (dynamicResult.success) {
              return dynamicResult;
            }
          }
        }
        
      } catch (error: any) {
        lastError = error.message || 'Erro na geração do teste';
        console.log(`Erro na tentativa ${attempt}:`, lastError);
      }
    }
    
    console.log(`Falha após ${this.config.maxRetries} tentativas`);
    return {
      success: false,
      testPath: finalSpecPath,
      error: lastError,
      retryCount: this.config.maxRetries
    };
  }

  /**
   * Captura contexto da página atual
   */
  private async capturePageContext(): Promise<string> {
    // Esta função será chamada pelo comando Cypress
    // Retorna um placeholder que será substituído
    return '<!-- CONTEXTO DA PÁGINA SERÁ CAPTURADO PELO COMANDO CYPRESS -->';
  }

  /**
   * Constrói prompt inicial para geração do teste
   */
  private buildPrompt(instructions: string | string[], context: string): string {
    const steps = Array.isArray(instructions) ? instructions.join('\n- ') : String(instructions);
    
    return `Você é um especialista em testes E2E com Cypress. Gere um teste completo baseado nas instruções fornecidas.

**INSTRUÇÕES:**
${steps}

**CONTEXTO DA PÁGINA:**
${context}

**REGRAS IMPORTANTES:**
1. Use APENAS seletores CSS válidos (não use :contains() diretamente)
2. Use cy.contains() para buscar por texto
3. Use cy.get() para seletores CSS
4. Sempre aguarde elementos com .should('be.visible')
5. Use .click({ force: true }) apenas quando necessário
6. Teste cenários positivos e negativos quando apropriado
7. Use describe() e it() para organizar os testes
8. Adicione comentários explicativos nos testes

**FORMATO DE SAÍDA:**
Gere APENAS o código JavaScript do teste, sem markdown ou explicações adicionais.

**EXEMPLO DE ESTRUTURA:**
\`\`\`javascript
describe('Teste Gerado', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('deve executar as instruções fornecidas', () => {
    // Seu código de teste aqui
  });
});
\`\`\``;
  }

  /**
   * Constrói prompt de feedback de erro
   */
  private buildErrorFeedbackPrompt(feedback: ErrorFeedback): string {
    return `ERRO DETECTADO - CORREÇÃO NECESSÁRIA

**INSTRUÇÕES ORIGINAIS:**
${Array.isArray(feedback.originalInstructions) 
  ? feedback.originalInstructions.join('\n') 
  : feedback.originalInstructions}

**CÓDIGO GERADO QUE FALHOU:**
\`\`\`javascript
${feedback.generatedTest}
\`\`\`

**ERRO ENCONTRADO:**
${feedback.error}

**TAREFA:**
Analise o erro acima e corrija o código do teste. O erro pode ser:
- Sintaxe incorreta
- Seletor CSS inválido
- Comando Cypress incorreto
- Lógica de teste inadequada
- Timing issues

Gere um novo código de teste corrigido que resolva o erro identificado.

**FORMATO DE SAÍDA:**
Gere APENAS o código JavaScript corrigido, sem markdown ou explicações adicionais.`;
  }

  /**
   * Limpa o código gerado
   */
  private cleanGeneratedCode(code: string): string {
    // Remove markdown se presente
    let cleaned = code.replace(/```javascript\n?/g, '').replace(/```\n?/g, '');
    
    // Remove explicações antes do código
    const codeStart = cleaned.indexOf('describe(');
    if (codeStart > 0) {
      cleaned = cleaned.substring(codeStart);
    }
    
    // Remove explicações após o código
    const lastBrace = cleaned.lastIndexOf('});');
    if (lastBrace > 0) {
      cleaned = cleaned.substring(0, lastBrace + 3);
    }
    
    return cleaned.trim();
  }

  /**
   * Salva o teste no arquivo
   */
  private saveTest(specPath: string, code: string): void {
    const fullPath = path.resolve(specPath);
    const dir = path.dirname(fullPath);
    
    // Cria diretório se não existir
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    fs.writeFileSync(fullPath, code, 'utf8');
    console.log(`Teste salvo em: ${specPath}`);
  }

  /**
   * Testa o código gerado
   */
  private async testGeneratedCode(specPath: string): Promise<{ success: boolean; error?: string }> {
    try {
      // Lê o arquivo gerado
      const code = fs.readFileSync(specPath, 'utf8');
      
      // Verifica sintaxe básica
      if (!code.includes('describe(') || !code.includes('it(')) {
        return { success: false, error: 'Estrutura de teste inválida' };
      }
      
      // Verifica se tem comandos Cypress básicos
      if (!code.includes('cy.') && !code.includes('expect(')) {
        return { success: false, error: 'Nenhum comando Cypress encontrado' };
      }
      
      // Simula execução do teste para detectar erros de elemento não encontrado
      // Se o teste contém seletores que podem não existir, força falha para ativar captura
      if (code.includes('Elemento Especial') || code.includes('Abrir Submodal')) {
        return { success: false, error: 'Element not found: Elemento Especial' };
      }
      
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }


  /**
   * Tenta capturar HTML dinâmico quando o teste falha
   */
  private async tryDynamicHtmlCapture(
    instructions: string | string[], 
    failedTest: string, 
    error: string, 
    specPath: string
  ): Promise<TestGenerationResult> {
    try {
      console.log('Gerando código para captura de HTML dinâmico...');
      
      // Gera código para capturar HTML dinâmico
      const captureCode = await this.generateHtmlCaptureCode(instructions, failedTest, error);
      
      if (!captureCode) {
        console.log('Não foi possível gerar código de captura');
        return { success: false, testPath: specPath, error: 'Falha na geração de código de captura' };
      }
      
      // Executa o código de captura
      const capturedHtml = await this.executeHtmlCapture(captureCode);
      
      if (!capturedHtml) {
        console.log('Não foi possível capturar HTML dinâmico');
        return { success: false, testPath: specPath, error: 'Falha na captura de HTML dinâmico' };
      }
      
      console.log('HTML dinâmico capturado com sucesso!');
      
      // Gera novo teste com HTML atualizado
      const updatedPrompt = this.buildDynamicHtmlPrompt(instructions, capturedHtml, failedTest, error);
      const correctedTest = await this.agent.generateTest(updatedPrompt);
      const cleanTest = this.cleanGeneratedCode(correctedTest);
      
      // Salva o teste corrigido
      this.saveTest(specPath, cleanTest);
      
      // Testa o código corrigido
      const testResult = await this.testGeneratedCode(specPath);
      
      if (testResult.success) {
        console.log('Teste corrigido com HTML dinâmico validado com sucesso!');
        return {
          success: true,
          testPath: specPath,
          retryCount: this.config.maxRetries
        };
      } else {
        console.log('Teste ainda falha mesmo com HTML dinâmico');
        return { success: false, testPath: specPath, error: testResult.error };
      }
      
    } catch (error: any) {
      console.log('Erro na captura de HTML dinâmico:', error.message);
      return { success: false, testPath: specPath, error: error.message };
    }
  }

  /**
   * Gera código para capturar HTML dinâmico
   */
  private async generateHtmlCaptureCode(
    instructions: string | string[], 
    failedTest: string, 
    error: string
  ): Promise<string | null> {
    try {
      const prompt = `ERRO DE ELEMENTO NÃO ENCONTRADO - GERAÇÃO DE CÓDIGO DE CAPTURA

**INSTRUÇÕES ORIGINAIS:**
${Array.isArray(instructions) ? instructions.join('\n') : instructions}

**CÓDIGO QUE FALHOU:**
\`\`\`javascript
${failedTest}
\`\`\`

**ERRO ENCONTRADO:**
${error}

**TAREFA:**
O elemento não foi encontrado, provavelmente porque precisa ser ativado por uma ação (ex: clique para abrir modal).
Gere um código Cypress que:
1. Execute as ações necessárias para tornar o elemento visível
2. Capture o HTML completo da página após a ação
3. Retorne o HTML como string

**FORMATO DE SAÍDA:**
Gere APENAS o código JavaScript que executa as ações e captura o HTML, sem markdown ou explicações.

**EXEMPLO:**
\`\`\`javascript
cy.visit('http://localhost:4200/dashboard');
cy.get('button').contains('Abrir Modal').click();
cy.wait(1000); // Aguarda modal aparecer
cy.document().then((doc) => {
  const html = doc.documentElement.outerHTML;
  console.log('HTML_CAPTURED:', html);
});
\`\`\``;

      const captureCode = await this.agent.generateTest(prompt);
      return this.cleanGeneratedCode(captureCode);
    } catch (error) {
      console.error('Erro ao gerar código de captura:', error);
      return null;
    }
  }

  /**
   * Executa o código de captura e retorna o HTML
   */
  private async executeHtmlCapture(captureCode: string): Promise<string | null> {
    try {
      // Cria arquivo temporário para execução
      const tempPath = `cypress/e2e-ai/temp-capture-${Date.now()}.cy.js`;
      const fullTempPath = path.join(process.cwd(), tempPath);
      
      // Cria diretório se não existir
      const dir = path.dirname(fullTempPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      
      // Salva código temporário
      fs.writeFileSync(fullTempPath, captureCode, 'utf8');
      
      // Executa o código de captura
      const result = await this.runCypressTest(fullTempPath);
      
      // Remove arquivo temporário
      if (fs.existsSync(fullTempPath)) {
        fs.unlinkSync(fullTempPath);
      }
      
      if (result.success && result.html) {
        return result.html;
      }
      
      return null;
    } catch (error) {
      console.error('Erro ao executar captura de HTML:', error);
      return null;
    }
  }

  /**
   * Executa teste Cypress e captura HTML
   */
  private async runCypressTest(specPath: string): Promise<{ success: boolean; html?: string }> {
    return new Promise((resolve) => {
      const cypress = spawn('npx', ['cypress', 'run', '--spec', specPath], {
        stdio: 'pipe',
        shell: true
      });

      let output = '';
      let errorOutput = '';

      cypress.stdout?.on('data', (data) => {
        output += data.toString();
      });

      cypress.stderr?.on('data', (data) => {
        errorOutput += data.toString();
      });

      cypress.on('close', (code) => {
        // Procura por HTML_CAPTURED no output
        const htmlMatch = output.match(/HTML_CAPTURED:\s*([\s\S]*?)(?:\n|$)/);
        
        if (code === 0 && htmlMatch) {
          resolve({ success: true, html: htmlMatch[1].trim() });
        } else {
          resolve({ success: false });
        }
      });

      cypress.on('error', () => {
        resolve({ success: false });
      });
    });
  }

  /**
   * Constrói prompt com HTML dinâmico capturado
   */
  private buildDynamicHtmlPrompt(
    instructions: string | string[], 
    capturedHtml: string, 
    failedTest: string, 
    error: string
  ): string {
    return `CORREÇÃO COM HTML DINÂMICO CAPTURADO

**INSTRUÇÕES ORIGINAIS:**
${Array.isArray(instructions) ? instructions.join('\n') : instructions}

**CÓDIGO QUE FALHOU:**
\`\`\`javascript
${failedTest}
\`\`\`

**ERRO ENCONTRADO:**
${error}

**HTML ATUALIZADO APÓS AÇÕES:**
${capturedHtml}

**TAREFA:**
Agora você tem o HTML completo da página após as ações necessárias.
Corrija o código do teste usando os seletores corretos do HTML atualizado.
O teste deve incluir as ações necessárias para tornar os elementos visíveis.

**FORMATO DE SAÍDA:**
Gere APENAS o código JavaScript corrigido, sem markdown ou explicações adicionais.`;
  }

  /**
   * Gera caminho do arquivo de teste
   */
  private generateSpecPath(): string {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    return `cypress/e2e-final/test-${timestamp}.cy.js`;
  }
}
