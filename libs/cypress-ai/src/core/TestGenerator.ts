// libs/cypress-ai/src/core/TestGenerator.ts
import { FileManager } from './FileManager';
import { PromptBuilder } from './PromptBuilder';
import { AgentFactory, IAgent } from '../agents/AgentFactory';
import { CypressRunner } from '../cypress/CypressRunner';
import { GenerateTestOptions, RunTestOptions, RunTestResult, CypressAiConfig } from '../types';

export class TestGenerator {
  private fileManager: FileManager;
  private promptBuilder: PromptBuilder;
  private cypressRunner: CypressRunner;

  constructor() {
    this.fileManager = new FileManager();
    this.promptBuilder = new PromptBuilder();
    this.cypressRunner = new CypressRunner();
  }

  /**
   * Gera um teste baseado nas instruções fornecidas
   */
  async generateTest(options: GenerateTestOptions, config: CypressAiConfig = {}): Promise<boolean> {
    const { instructions, html, specPath, agent = 'ollama', model } = options;
    
    // Resolve o caminho absoluto
    const absPath = this.fileManager.resolvePath(specPath);
    
    // Lê o teste existente se houver
    const existingTest = this.fileManager.readFileIfExists(absPath);
    
    // Cria o agente
    const finalModel = model || config.model || 'qwen2.5-coder:latest';
    const aiAgent: IAgent = AgentFactory.createAgent(agent, { ...config, model: finalModel });
    
    // Constrói o prompt
    const prompt = this.promptBuilder.buildPrompt(instructions, existingTest, html);
    
    // Gera o código usando a IA
    const generatedCode = await aiAgent.generateTest(prompt, model);
    
    // Limpa o código gerado
    const cleanCode = this.promptBuilder.cleanGeneratedCode(generatedCode);
    
    // Salva o arquivo
    this.fileManager.writeFile(absPath, cleanCode);
    
    return true;
  }

  /**
   * Executa um teste se ele existir
   */
  async runTestIfExists(options: RunTestOptions): Promise<RunTestResult> {
    return this.cypressRunner.runTestIfExists(options);
  }

  /**
   * Verifica se os componentes necessários estão disponíveis
   */
  async checkDependencies(): Promise<{ cypress: boolean; agent: boolean }> {
    const [cypress, agent] = await Promise.all([
      this.cypressRunner.isCypressAvailable(),
      this.checkAgentAvailability()
    ]);
    
    return { cypress, agent };
  }

  private async checkAgentAvailability(): Promise<boolean> {
    try {
      const agent = AgentFactory.createAgent('ollama', {});
      return await agent.isAvailable();
    } catch {
      return false;
    }
  }
}
