# Exemplos de Uso - Contexto Dinâmico

Este documento mostra como usar os novos comandos para resolver o problema de contexto dinâmico em testes Cypress com IA.

## Problema Resolvido

Antes, quando você tinha um modal que só aparecia após clicar em um botão, a IA não conseguia "ver" o conteúdo do modal porque só recebia o HTML inicial da página.

## Soluções Implementadas

### 1. Comando `cy.explore()` - Navegação Automática

Explora automaticamente a página clicando em elementos e capturando diferentes estados.

```javascript
// Explora a página automaticamente
cy.explore({
  selectors: ['button', '[data-cy]', '[data-testid]'], // Elementos para clicar
  maxDepth: 3, // Máximo de 3 cliques
  waitTime: 1000 // Aguarda 1s entre cliques
}).then((states) => {
  console.log('Estados capturados:', states.length);
  // states contém array com HTML de cada estado
});
```

### 2. Comando `cy.promptWithContext()` - Geração com Contexto

Combina exploração + geração de teste em um comando.

```javascript
// Gera teste considerando todos os estados da página
cy.promptWithContext('Teste o modal de confirmação', {
  exploreOptions: {
    selectors: ['button[data-cy="open-modal"]'],
    maxDepth: 2
  }
});
```

### 3. Comando `cy.promptSequential()` - Instruções Sequenciais

Executa instruções passo a passo, acumulando contexto.

```javascript
// Instruções sequenciais com contexto acumulado
cy.promptSequential([
  {
    instructions: 'Crie um teste para abrir o modal',
    description: 'Passo 1: Abrir modal',
    action: {
      type: 'click',
      selector: 'button[data-cy="open-modal"]'
    }
  },
  {
    instructions: 'Agora teste o conteúdo do modal que apareceu',
    description: 'Passo 2: Testar modal aberto'
  },
  {
    instructions: 'Teste fechar o modal',
    description: 'Passo 3: Fechar modal',
    action: {
      type: 'click',
      selector: 'button[data-cy="close-modal"]'
    }
  }
], {
  accumulateContext: true // Acumula HTML de todos os passos
});
```

## Exemplos Práticos

### Exemplo 1: Modal Simples

```javascript
describe('Teste de Modal', () => {
  it('deve abrir e fechar modal corretamente', () => {
    cy.visit('/');
    
    // Usa promptWithContext para capturar estado do modal
    cy.promptWithContext([
      'Teste abrir o modal clicando no botão',
      'Verifique se o modal aparece com o conteúdo correto',
      'Teste fechar o modal'
    ], {
      exploreOptions: {
        selectors: ['button[data-cy="modal-trigger"]', 'button[data-cy="modal-close"]'],
        maxDepth: 2
      }
    });
  });
});
```

### Exemplo 2: Formulário com Validação

```javascript
describe('Teste de Formulário', () => {
  it('deve validar campos e mostrar mensagens de erro', () => {
    cy.visit('/form');
    
    // Usa promptSequential para testar fluxo completo
    cy.promptSequential([
      {
        instructions: 'Teste enviar formulário vazio',
        action: { type: 'click', selector: 'button[type="submit"]' }
      },
      {
        instructions: 'Verifique se apareceram mensagens de erro',
        description: 'Validar mensagens de erro'
      },
      {
        instructions: 'Preencha os campos obrigatórios',
        action: { type: 'type', selector: 'input[name="email"]', value: 'test@example.com' }
      },
      {
        instructions: 'Teste envio com dados válidos',
        action: { type: 'click', selector: 'button[type="submit"]' }
      }
    ]);
  });
});
```

### Exemplo 3: Dropdown com Opções

```javascript
describe('Teste de Dropdown', () => {
  it('deve abrir dropdown e selecionar opção', () => {
    cy.visit('/dashboard');
    
    // Explora dropdown e gera teste
    cy.explore({
      selectors: ['[data-cy="dropdown-trigger"]', '[data-cy="dropdown-option"]'],
      maxDepth: 3
    }).then((states) => {
      // Agora gera teste com todos os estados
      cy.prompt('Teste o dropdown de filtros', {
        html: states.map(s => s.html).join('\n\n<!-- SEPARADOR -->\n\n')
      });
    });
  });
});
```

## Configurações Avançadas

### Opções do `cy.explore()`

```javascript
cy.explore({
  selectors: [
    'button',           // Todos os botões
    '[data-cy]',        // Elementos com data-cy
    '[data-testid]',    // Elementos com data-testid
    'a[href]',          // Links
    'input[type="button"]' // Botões de input
  ],
  maxDepth: 5,          // Máximo de cliques
  includeHidden: false, // Incluir elementos ocultos
  waitTime: 1000        // Tempo de espera entre cliques
});
```

### Opções do `cy.promptSequential()`

```javascript
cy.promptSequential(instructions, {
  accumulateContext: true,  // Acumula HTML de todos os passos
  agent: 'ollama',         // Agente IA
  model: 'qwen2.5-coder',  // Modelo específico
  specPath: 'custom/path'  // Caminho customizado
});
```

## Vantagens

1. **Contexto Completo**: A IA vê todos os estados da página
2. **Testes Mais Precisos**: Elementos dinâmicos são testados corretamente
3. **Flexibilidade**: Múltiplas abordagens para diferentes cenários
4. **Automação**: Navegação automática pela página
5. **Acumulação**: Contexto cresce a cada interação

## Quando Usar Cada Comando

- **`cy.explore()`**: Quando você quer apenas explorar a página
- **`cy.promptWithContext()`**: Quando quer gerar teste com contexto automático
- **`cy.promptSequential()`**: Quando tem um fluxo específico para testar
- **`cy.prompt()`**: Para casos simples sem contexto dinâmico

## Dicas

1. Use `data-cy`, `data-testid` ou `data-test` nos elementos para melhor detecção
2. Ajuste `maxDepth` baseado na complexidade da página
3. Use `waitTime` maior para páginas com carregamento lento
4. Combine comandos para cenários complexos
