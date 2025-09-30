// Configuração da biblioteca cypress-ai
module.exports = {
  // Configurações de IA
  agent: 'stackspot',
  model: 'qwen2.5-coder:latest',
  baseUrl: 'http://localhost:11434',
  
  // StackSpot Configuration
  stackspotRealm: 'stackspot-freemium',
  stackspotClientId: 'a3dd953f-8a32-43dc-b4e5-243bc3183cae',
  stackspotAgentId: '01K46JSS5FPJ30V15DT8QN95WP',
  stackspotClientKey: 'UlWF',
  
  // Configurações de performance
  autoRetry: false,
  maxRetries: 1,
  timeout: 120000, // 2 minutos
  
  // Configurações do Cypress
  cypressBaseUrl: 'http://localhost:4200',
  cypressPort: 4200
};
