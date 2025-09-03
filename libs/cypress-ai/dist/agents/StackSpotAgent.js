"use strict";
// StackSpot Agent implementation
Object.defineProperty(exports, "__esModule", { value: true });
exports.StackSpotAgent = void 0;
class StackSpotAgent {
    constructor(config) {
        this.config = {
            baseUrl: 'https://genai-inference-app.stackspot.com',
            ...config
        };
    }
    async generateTest(prompt) {
        console.log('- StackSpotAgent: Iniciando geração de teste');
        console.log('- Configuração StackSpot:', {
            realm: this.config.realm,
            clientId: this.config.clientId,
            agentId: this.config.agentId,
            baseUrl: this.config.baseUrl
        });
        try {
            // 1. Autenticar e obter JWT
            console.log('- StackSpotAgent: Autenticando...');
            const jwt = await this.authenticate();
            console.log('- StackSpotAgent: Autenticação bem-sucedida');
            // 2. Fazer chat com o agente
            console.log('- StackSpotAgent: Enviando prompt para o agente...');
            const response = await this.chatWithAgent(prompt, jwt);
            console.log('- StackSpotAgent: Resposta recebida');
            // 3. Extrair e retornar a resposta
            const result = this.extractResponse(response);
            console.log('- StackSpotAgent: Teste gerado com sucesso');
            return result;
        }
        catch (error) {
            console.error('- StackSpotAgent: Erro:', error.message);
            throw new Error(`Erro no StackSpot Agent: ${error.message}`);
        }
    }
    async authenticate() {
        const authUrl = `https://idm.stackspot.com/${this.config.realm}/oidc/oauth/token`;
        console.log('- StackSpotAgent: URL de autenticação:', authUrl);
        console.log('- StackSpotAgent: Realm:', this.config.realm);
        console.log('- StackSpotAgent: Client ID:', this.config.clientId);
        console.log('- StackSpotAgent: Client Key:', this.config.clientKey ? '***' + this.config.clientKey.slice(-4) : 'NÃO CONFIGURADO');
        const formData = new URLSearchParams();
        formData.append('grant_type', 'client_credentials');
        formData.append('client_id', this.config.clientId);
        formData.append('client_secret', this.config.clientKey);
        const response = await fetch(authUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: formData,
        });
        if (!response.ok) {
            const errorText = await response.text().catch(() => '');
            console.error('- StackSpotAgent: Erro de autenticação:', response.status, response.statusText);
            console.error('- StackSpotAgent: Resposta do erro:', errorText);
            throw new Error(`Falha na autenticação: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        if (!data.access_token) {
            console.error('- StackSpotAgent: Resposta da autenticação:', data);
            throw new Error('Token de acesso não encontrado na resposta');
        }
        console.log('- StackSpotAgent: Token obtido com sucesso');
        return data.access_token;
    }
    async chatWithAgent(prompt, jwt) {
        const chatUrl = `${this.config.baseUrl}/v1/agent/${this.config.agentId}/chat`;
        const requestBody = {
            streaming: false,
            user_prompt: prompt,
            stackspot_knowledge: false,
            return_ks_in_response: false
        };
        const response = await fetch(chatUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwt}`,
            },
            body: JSON.stringify(requestBody),
        });
        if (!response.ok) {
            throw new Error(`Falha no chat: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        return data;
    }
    extractResponse(response) {
        console.log('response', response);
        // Extrair a mensagem da resposta
        if (response.message) {
            return response.message;
        }
        // Se não houver campo message, tentar outros campos comuns
        if (response['content']) {
            return response['content'];
        }
        if (response['text']) {
            return response['text'];
        }
        if (response['response']) {
            return response['response'];
        }
        // Se não encontrar campo específico, retornar JSON stringificado
        return JSON.stringify(response, null, 2);
    }
    // Método para verificar se as configurações estão válidas
    validateConfig() {
        const errors = [];
        if (!this.config.realm) {
            errors.push('REALM é obrigatório');
        }
        if (!this.config.clientId) {
            errors.push('CLIENT_ID é obrigatório');
        }
        if (!this.config.clientKey) {
            errors.push('CLIENT_KEY é obrigatório');
        }
        if (!this.config.agentId) {
            errors.push('AGENT_ID é obrigatório');
        }
        return {
            valid: errors.length === 0,
            errors
        };
    }
    // Implementa o método isAvailable da interface IAgent
    async isAvailable() {
        try {
            // Verifica se as configurações estão válidas
            const validation = this.validateConfig();
            if (!validation.valid) {
                return false;
            }
            // Tenta fazer uma autenticação para verificar se o serviço está disponível
            await this.authenticate();
            return true;
        }
        catch (error) {
            return false;
        }
    }
}
exports.StackSpotAgent = StackSpotAgent;
//# sourceMappingURL=StackSpotAgent.js.map