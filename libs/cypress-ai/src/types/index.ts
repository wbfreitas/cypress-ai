// libs/cypress-ai/src/types/index.ts

export interface CypressAiConfig {
  model?: string;
  apiBase?: string;
  agent?: 'ollama';
}

export interface GenerateTestOptions {
  instructions: string | string[];
  html: string;
  specPath: string;
  agent?: 'ollama';
  model?: string;
}

export interface RunTestOptions {
  specPath: string;
  baseUrl?: string;
}

export interface RunTestResult {
  ran: boolean;
  status?: number;
  stdout?: string;
  stderr?: string;
  error?: string;
}

export interface AiCommandOptions {
  finalDir?: string;
  agent?: 'ollama';
  model?: string;
  runExisting?: boolean;
  stopOnExistingFailure?: boolean;
}

export interface PromptOptions {
  skip?: boolean;
}

export interface OllamaResponse {
  response?: string;
  done?: boolean;
  error?: string;
}

export interface OllamaRequest {
  model: string;
  prompt: string;
  stream?: boolean;
}

