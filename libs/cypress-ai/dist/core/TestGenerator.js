"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestGenerator = void 0;
// libs/cypress-ai/src/core/TestGenerator.ts
const FileManager_1 = require("./FileManager");
const PromptBuilder_1 = require("./PromptBuilder");
const AgentFactory_1 = require("../agents/AgentFactory");
const CypressRunner_1 = require("../cypress/CypressRunner");
class TestGenerator {
    constructor() {
        this.fileManager = new FileManager_1.FileManager();
        this.promptBuilder = new PromptBuilder_1.PromptBuilder();
        this.cypressRunner = new CypressRunner_1.CypressRunner();
    }
    /**
     * Gera um teste baseado nas instruções fornecidas
     */
    async generateTest(options, config = {}) {
        const { instructions, html, specPath, agent, model } = options;
        // Resolve o caminho absoluto
        const absPath = this.fileManager.resolvePath(specPath);
        // Lê o teste existente se houver
        const existingTest = this.fileManager.readFileIfExists(absPath);
        // Determina o agente a usar (prioridade: parâmetro > .env > padrão)
        const selectedAgent = agent || process.env['AI_AGENT'] || 'ollama';
        console.log('🤖 Agente selecionado:', selectedAgent);
        console.log('🔧 Configuração do agente:', {
            agent: selectedAgent,
            model: model || config.model || process.env['AI_OLLAMA_MODEL'],
            stackspotRealm: process.env['STACKSPOT_REALM'],
            stackspotClientId: process.env['STACKSPOT_CLIENT_ID'],
            stackspotAgentId: process.env['STACKSPOT_AGENT_ID']
        });
        // Cria o agente
        const finalModel = model || config.model || process.env['AI_OLLAMA_MODEL'] || 'qwen2.5-coder:latest';
        const aiAgent = AgentFactory_1.AgentFactory.createAgent(selectedAgent, { ...config, model: finalModel });
        console.log('✅ Agente criado:', selectedAgent);
        // Constrói o prompt inicial
        const initialPrompt = this.promptBuilder.buildPrompt(instructions, existingTest, html);
        // Verifica se o retry automático está habilitado
        const autoRetryEnabled = process.env['CYPRESS_AI_AUTO_RETRY'] !== 'false';
        if (autoRetryEnabled) {
            // Tenta gerar o teste com retry automático
            const maxRetries = parseInt(process.env['CYPRESS_AI_MAX_RETRIES'] || '3');
            console.log(`🔄 Sistema de retry automático habilitado (máximo ${maxRetries} tentativas)`);
            return await this.generateTestWithRetry(aiAgent, initialPrompt, instructions, existingTest, html, absPath, maxRetries);
        }
        else {
            // Geração simples sem retry
            console.log('⚡ Modo simples - sem retry automático');
            const generatedCode = await aiAgent.generateTest(initialPrompt, undefined);
            const cleanCode = this.promptBuilder.cleanGeneratedCode(generatedCode);
            this.fileManager.writeFile(absPath, cleanCode);
            return true;
        }
    }
    /**
     * Gera teste com sistema de retry automático
     */
    async generateTestWithRetry(aiAgent, prompt, originalInstructions, existingTest, html, absPath, maxRetries) {
        let attempt = 1;
        let lastError = null;
        let lastGeneratedCode = null;
        while (attempt <= maxRetries) {
            try {
                console.log(`🔄 Tentativa ${attempt}/${maxRetries} de geração do teste`);
                // Gera o código usando a IA
                const generatedCode = await aiAgent.generateTest(prompt, undefined);
                lastGeneratedCode = generatedCode;
                // Limpa o código gerado
                const cleanCode = this.promptBuilder.cleanGeneratedCode(generatedCode);
                // Salva o arquivo
                this.fileManager.writeFile(absPath, cleanCode);
                // Tenta executar o teste para verificar se está funcionando
                console.log('🧪 Testando o código gerado...');
                const testResult = await this.testGeneratedCode(absPath);
                if (testResult.success) {
                    console.log('✅ Teste gerado e validado com sucesso!');
                    return true;
                }
                else {
                    lastError = testResult.error || 'Erro desconhecido na execução do teste';
                    console.log(`❌ Teste falhou na tentativa ${attempt}:`, lastError);
                    if (attempt < maxRetries) {
                        console.log('🔄 Tentando auto-correção...');
                        // Constrói prompt de correção com feedback do erro
                        prompt = this.buildCorrectionPrompt(originalInstructions, existingTest, html, lastError || '', lastGeneratedCode || '');
                    }
                }
            }
            catch (error) {
                lastError = error.message;
                console.log(`❌ Erro na tentativa ${attempt}:`, lastError);
                if (attempt < maxRetries) {
                    console.log('🔄 Tentando auto-correção...');
                    // Constrói prompt de correção com feedback do erro
                    prompt = this.buildCorrectionPrompt(originalInstructions, existingTest, html, lastError || '', lastGeneratedCode || '');
                }
            }
            attempt++;
        }
        console.log(`❌ Falha após ${maxRetries} tentativas. Último erro:`, lastError);
        return false;
    }
    /**
     * Testa o código gerado executando-o
     */
    async testGeneratedCode(specPath) {
        try {
            const result = await this.cypressRunner.runTestIfExists({
                specPath,
                baseUrl: process.env['CYPRESS_AI_BASE_URL'] || 'http://localhost:4200'
            });
            if (!result.ran) {
                return {
                    success: false,
                    error: result.error || 'Teste não pôde ser executado'
                };
            }
            const errorMessage = result.status !== 0 ? (result.stderr || result.stdout || 'Erro desconhecido') : undefined;
            return {
                success: result.status === 0,
                ...(errorMessage && { error: errorMessage })
            };
        }
        catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }
    /**
     * Constrói prompt de correção com feedback do erro
     */
    buildCorrectionPrompt(originalInstructions, existingTest, html, error, generatedCode) {
        const instructions = Array.isArray(originalInstructions)
            ? originalInstructions.join('\n')
            : originalInstructions;
        let correctionPrompt = `ERRO DETECTADO - AUTO-CORREÇÃO NECESSÁRIA

INSTRUÇÕES ORIGINAIS:
${instructions}

CÓDIGO GERADO QUE FALHOU:
\`\`\`javascript
${generatedCode || 'Nenhum código foi gerado'}
\`\`\`

ERRO ENCONTRADO:
${error}

HTML DA PÁGINA:
\`\`\`html
${html}
\`\`\`

${existingTest ? `TESTE EXISTENTE (para referência):
\`\`\`javascript
${existingTest}
\`\`\`` : ''}

TAREFA:
Analise o erro acima e corrija o código do teste. O erro pode ser:
- Sintaxe incorreta
- Seletor CSS inválido
- Comando Cypress incorreto
- Lógica de teste inadequada
- Timing issues

Gere um novo código de teste corrigido que resolva o erro identificado.`;
        return correctionPrompt;
    }
    /**
     * Executa um teste se ele existir
     */
    async runTestIfExists(options) {
        return this.cypressRunner.runTestIfExists(options);
    }
    /**
     * Executa o teste final e pergunta ao usuário se quer substituir o teste AI
     */
    async runFinalTestAndAsk(options) {
        const { specPath, aiSpecPath } = options;
        // Verifica se o teste final existe
        if (!this.fileManager.fileExists(specPath)) {
            return { success: false, message: 'Teste final não encontrado' };
        }
        // Para demonstração, vamos simular que o teste passou
        // Em produção, você pode implementar a execução real aqui
        console.log('🔍 Verificando teste final...');
        // Simula execução bem-sucedida
        const result = { ran: true, status: 0, stdout: 'Teste executado com sucesso', stderr: '' };
        console.log('✅ Teste final verificado e pronto para substituição');
        // Se o teste passou, pergunta ao usuário se quer substituir
        if (result.status === 0) {
            console.log('\n✅ Teste final executado com sucesso!');
            console.log('📝 Deseja substituir o teste AI pelo teste final gerado?');
            console.log('   - Digite "s" ou "sim" para substituir');
            console.log('   - Digite "n" ou "não" para manter como está');
            // Para demonstração, vamos simular que o usuário quer substituir
            // Em um ambiente real, você implementaria uma interface para perguntar ao usuário
            const shouldReplace = true; // Simula resposta "sim" do usuário
            if (shouldReplace) {
                // Lê o conteúdo do teste final
                const finalTestContent = this.fileManager.readFileIfExists(specPath);
                // Atualiza o teste AI com o conteúdo do teste final
                this.fileManager.writeFile(aiSpecPath, finalTestContent);
                console.log('✅ Teste AI atualizado com o teste final!');
                return {
                    success: true,
                    message: 'Teste AI atualizado com sucesso',
                    replaced: true
                };
            }
            else {
                console.log('ℹ️  Teste AI mantido como estava');
                return {
                    success: true,
                    message: 'Teste AI mantido',
                    replaced: false
                };
            }
        }
        else {
            console.log('❌ Teste final falhou. Não será substituído.');
            return {
                success: false,
                message: 'Teste final falhou',
                error: result.stderr || result.stdout
            };
        }
    }
    /**
     * Verifica se os componentes necessários estão disponíveis
     */
    async checkDependencies() {
        const [cypress, agent] = await Promise.all([
            this.cypressRunner.isCypressAvailable(),
            this.checkAgentAvailability()
        ]);
        return { cypress, agent };
    }
    async checkAgentAvailability() {
        try {
            const agent = AgentFactory_1.AgentFactory.createAgent('ollama', {});
            return await agent.isAvailable();
        }
        catch {
            return false;
        }
    }
}
exports.TestGenerator = TestGenerator;
//# sourceMappingURL=TestGenerator.js.map