#!/bin/bash

# Dalvik Installation Script
# This script installs Ollama and sets up recommended models for Dalvik

set -e

echo "🤖 Dalvik Setup Script"
echo "====================="
echo ""

# Check if running on supported platform
if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    PLATFORM="linux"
elif [[ "$OSTYPE" == "darwin"* ]]; then
    PLATFORM="macos"
else
    echo "❌ This script supports Linux and macOS only."
    echo "For Windows, please install Ollama manually from https://ollama.ai/download"
    exit 1
fi

echo "📋 Detected platform: $PLATFORM"
echo ""

# Install Ollama if not present
if ! command -v ollama &> /dev/null; then
    echo "📦 Installing Ollama..."
    if [[ "$PLATFORM" == "linux" ]]; then
        curl -fsSL https://ollama.ai/install.sh | sh
    elif [[ "$PLATFORM" == "macos" ]]; then
        if command -v brew &> /dev/null; then
            brew install ollama
        else
            echo "❌ Homebrew not found. Please install Ollama manually from https://ollama.ai/download"
            exit 1
        fi
    fi
    echo "✅ Ollama installed successfully"
else
    echo "✅ Ollama is already installed"
fi

echo ""

# Start Ollama service
echo "🚀 Starting Ollama service..."
if [[ "$PLATFORM" == "macos" ]]; then
    # On macOS, start the service in background
    brew services start ollama || ollama serve &
else
    # On Linux, start in background
    ollama serve &
fi

# Wait for Ollama to start
echo "⏳ Waiting for Ollama to start..."
sleep 5

# Test connection
if ! curl -s http://localhost:11434/api/tags > /dev/null; then
    echo "❌ Failed to connect to Ollama. Please start it manually with 'ollama serve'"
    exit 1
fi

echo "✅ Ollama is running"
echo ""

# Install recommended models
echo "📥 Installing recommended AI models..."
echo "This may take a while depending on your internet connection..."
echo ""

models=("codellama:latest" "llama3:latest" "deepseek-coder:latest")

for model in "${models[@]}"; do
    echo "📦 Pulling $model..."
    if ollama pull "$model"; then
        echo "✅ $model installed successfully"
    else
        echo "⚠️  Failed to install $model (you can install it later)"
    fi
    echo ""
done

echo "🎉 Setup Complete!"
echo ""
echo "Next steps:"
echo "1. Install the Dalvik VS Code extension: code --install-extension dalvik-agent.vsix"
echo "2. Restart VS Code"
echo "3. Click the Dalvik icon in the sidebar to start coding!"
echo ""
echo "Available models:"
ollama list
echo ""
echo "💡 Tips:"
echo "- Use 'codellama:latest' for general coding (default)"
echo "- Use 'deepseek-coder:latest' for complex algorithms"
echo "- Use 'llama3:latest' for explanations and documentation"
echo ""
echo "🔧 To change models: Open Dalvik → Settings → Select model"
echo ""
echo "Happy coding with Dalvik! 🚀"
