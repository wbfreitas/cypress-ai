// libs/cypress-ai-v2/src/agents/StackSpotAgent.ts
import { StackSpotConfig } from '../types';

export class StackSpotAgent {
  private config: StackSpotConfig;
  private accessToken: string | null = null;
  private tokenExpiry: number = 0;

  constructor(config: StackSpotConfig) {
    this.config = config;
  }

  /**
   * Autentica com o StackSpot
   */
  private async authenticate(): Promise<void> {
    const now = Date.now();
    
    // Verifica se o token ainda é válido (com margem de 5 minutos)
    if (this.accessToken && this.tokenExpiry > now + 300000) {
      return;
    }

    try {
      const response = await fetch(`https://idm.stackspot.com/${this.config.realm}/oidc/oauth/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'client_credentials',
          client_id: this.config.clientId,
          client_secret: this.config.clientKey
        })
      });

      if (!response.ok) {
        throw new Error(`Erro na autenticação: ${response.status} ${response.statusText}`);
      }

      const data = await response.json() as any;
      this.accessToken = data.access_token;
      this.tokenExpiry = now + (data.expires_in * 1000);
      
      console.log('StackSpot: Autenticado com sucesso');
    } catch (error) {
      console.error('StackSpot: Erro na autenticação:', error);
      throw error;
    }
  }

  /**
   * Gera teste usando o StackSpot
   */
  async generateTest(prompt: string): Promise<string> {
    await this.authenticate();

    try {
      const response = await fetch(`https://genai-inference-app.stackspot.com/v1/agent/${this.config.agentId}/chat`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          streaming: false,
          user_prompt: prompt,
          stackspot_knowledge: false,
          return_ks_in_response: true
        })
      });

      if (!response.ok) {
        throw new Error(`Erro na geração: ${response.status} ${response.statusText}`);
      }

      const data = await response.json() as any;
      return data.response || data.message || data.content || '';
    } catch (error) {
      console.error('StackSpot: Erro na geração do teste:', error);
      throw error;
    }
  }

  /**
   * Verifica se o agente está disponível
   */
  async isAvailable(): Promise<boolean> {
    try {
      await this.authenticate();
      return true;
    } catch {
      return false;
    }
  }
}
