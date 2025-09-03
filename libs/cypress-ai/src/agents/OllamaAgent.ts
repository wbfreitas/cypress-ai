// libs/cypress-ai/src/agents/OllamaAgent.ts
import { default as fetch } from 'node-fetch';
import { OllamaRequest, OllamaResponse } from '../types';

export class OllamaAgent {
  private readonly apiBase: string;
  private readonly defaultModel: string;

  constructor(apiBase: string = 'http://127.0.0.1:11434', defaultModel: string = 'qwen2.5-coder:latest') {
    this.apiBase = apiBase;
    this.defaultModel = defaultModel;
  }

  /**
   * Gera código de teste usando o Ollama
   */
  async generateTest(prompt: string, model?: string): Promise<string> {
    console.log('- OllamaAgent: Iniciando geração de teste');
    console.log('- Configuração Ollama:', {
      apiBase: this.apiBase,
      model: model || this.defaultModel
    });
    
    const resolvedModel = model || this.defaultModel;
    const request: OllamaRequest = {
      model: resolvedModel,
      prompt,
      stream: false
    };

    try {
      console.log('- OllamaAgent: Enviando requisição para:', `${this.apiBase}/api/generate`);
      const response = await fetch(`${this.apiBase}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request)
      });

      if (!response.ok) {
        const errorText = await response.text().catch(() => '');
        throw new Error(`Ollama retornou ${response.status}: ${errorText}`);
      }

      const data = await response.json() as OllamaResponse;
      const code = (data?.response || '').trim();
      
      if (!code) {
        throw new Error('IA não retornou código de teste.');
      }

      console.log('- OllamaAgent: Teste gerado com sucesso');
      return code;
    } catch (error) {
      console.error('- OllamaAgent: Erro:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(`Erro ao comunicar com Ollama: ${String(error)}`);
    }
  }

  /**
   * Verifica se o agente está disponível
   */
  async isAvailable(): Promise<boolean> {
    try {
      const response = await fetch(`${this.apiBase}/api/tags`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      return response.ok;
    } catch {
      return false;
    }
  }
}
