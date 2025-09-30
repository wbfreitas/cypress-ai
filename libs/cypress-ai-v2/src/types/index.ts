// libs/cypress-ai-v2/src/types/index.ts

export interface CypressAiV2Config {
  agent: 'stackspot';
  model: string;
  baseUrl: string;
  stackspotRealm: string;
  stackspotClientId: string;
  stackspotAgentId: string;
  stackspotClientKey: string;
  maxRetries: number;
  timeout: number;
}

export interface TestGenerationOptions {
  instructions: string | string[];
  specPath?: string;
  context?: string;
}

export interface TestGenerationResult {
  success: boolean;
  testPath: string;
  error?: string;
  retryCount?: number;
}

export interface StackSpotConfig {
  realm: string;
  clientId: string;
  agentId: string;
  clientKey: string;
  baseUrl: string;
}

export interface PageContext {
  html: string;
  url: string;
  timestamp: number;
  description?: string;
}

export interface ErrorFeedback {
  originalInstructions: string | string[];
  generatedTest: string;
  error: string;
  retryCount: number;
}

export interface SetupOptions {
  realm?: string;
  clientId?: string;
  agentId?: string;
  clientKey?: string;
  baseUrl?: string;
  model?: string;
  maxRetries?: number;
  timeout?: number;
}
