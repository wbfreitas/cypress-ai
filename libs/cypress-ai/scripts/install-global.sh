#!/bin/bash

# Script para instalar o Cypress AI CLI globalmente
echo "- Instalando Cypress AI CLI globalmente..."

# Navega para o diretório da lib
cd "$(dirname "$0")/.."

# Compila a lib
echo "- Compilando a biblioteca..."
npm run build

# Instala globalmente
echo "🌍 Instalando globalmente..."
npm install -g .

echo "- Instalação concluída!"
echo ""
echo "- Agora você pode usar:"
echo "  cyai playground     # Inicia o playground"
echo "  cyai version        # Mostra a versão"
echo "  cyai help           # Mostra ajuda"
echo ""
echo "📚 Para usar em qualquer projeto Angular:"
echo "  1. cd seu-projeto-angular"
echo "  2. cyai playground"