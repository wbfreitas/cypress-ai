# Guia de Debug - Cypress AI v2

## Como debugar o comando `generate` no VS Code

### 1. Configuração do VS Code

O arquivo `.vscode/launch.json` já está configurado com duas opções de debug:

- **Debug Cypress AI Generate**: Executa o Cypress com o teste de debug
- **Debug TestGenerator**: Executa diretamente o TestGenerator

### 2. Pontos de Breakpoint Recomendados

Coloque breakpoints nos seguintes arquivos:

#### `libs/cypress-ai-v2/src/core/TestGenerator.ts`
- Linha 26: `async generateTest(options: TestGenerationOptions)`
- Linha 42: `const initialPrompt = this.buildPrompt(instructions, pageContext)`
- Linha 59: `const generatedCode = await this.agent.generateTest(prompt)`
- Linha 124: `private buildPrompt(instructions: string | string[], context: string)`

#### `libs/cypress-ai-v2/src/commands/CypressCommands.ts`
- Linha 16: `static ai(instructions: string | string[], options: Partial<TestGenerationOptions> = {})`
- Linha 21: `const context = CypressCommands.capturePageContext(doc)`
- Linha 31: `return cy.task('cypress-ai-v2:generate', testOptions, { timeout: 120000 })`

#### `libs/cypress-ai-v2/src/plugin/CypressAiV2Plugin.ts`
- Linha 55: `const result = await this.testGenerator.generateTest(options)`

### 3. Como executar o debug

1. **Abra o VS Code** na pasta raiz do projeto
2. **Vá para a aba "Run and Debug"** (Ctrl+Shift+D)
3. **Selecione "Debug Cypress AI Generate"** no dropdown
4. **Coloque breakpoints** nos pontos mencionados acima
5. **Pressione F5** para iniciar o debug

### 4. Verificando o contexto HTML

O contexto HTML é capturado no método `capturePageContext` e enviado para a IA no `buildPrompt`. 

**Logs de debug adicionados:**
- `🔍 DEBUG: Iniciando geração de teste`
- `🔍 DEBUG: Instructions: [suas instruções]`
- `🔍 DEBUG: Context length: [tamanho do contexto]`
- `🔍 DEBUG: Page context length: [tamanho do contexto da página]`
- `🔍 DEBUG: Prompt length: [tamanho do prompt final]`
- `🔍 DEBUG: Context preview: [primeiros 500 caracteres do contexto]`

### 5. Teste de debug

Use o arquivo `my-angular-app/cypress/e2e-ai/debug-test.cy.js` que contém um teste simples para debug.

### 6. Verificando se o HTML está sendo enviado

No breakpoint do `buildPrompt`, verifique:
1. Se `context` contém HTML válido
2. Se o HTML contém os elementos esperados da página
3. Se o prompt final inclui o contexto completo

### 7. Comandos úteis para debug

```bash
# Compilar a biblioteca
cd libs/cypress-ai-v2 && npm run build

# Executar teste de debug manualmente
cd my-angular-app && npx cyai-v2 generate --spec cypress/e2e-ai/debug-test.cy.js

# Ver logs detalhados
cd my-angular-app && DEBUG=* npx cyai-v2 generate --spec cypress/e2e-ai/debug-test.cy.js
```
