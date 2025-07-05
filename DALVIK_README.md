# Dalvik - Offline AI-Powered VS Code Extension

Dalvik is a powerful, fully offline AI-powered coding agent based on Cline AI, designed to work exclusively with local Ollama models for maximum privacy and speed.

## Features

-   🔒 **Fully Offline**: No cloud dependencies - your code stays private
-   🤖 **Local AI Models**: Uses Ollama with CodeLlama, Llama3, and DeepSeek Coder
-   📁 **Multi-file Reasoning**: Understands and edits across your entire project
-   🔍 **Code Diffs**: Shows changes before applying them
-   💻 **Terminal Integration**: Safely run commands with preview mode
-   🎯 **Task Memory**: Stores task history in local `.dalvik-state.json`

## Prerequisites

### 1. Install Ollama

First, install Ollama on your system:

**Windows:**

```powershell
# Download and install from https://ollama.ai/download
# Or use winget
winget install Ollama.Ollama
```

**macOS:**

```bash
# Download from https://ollama.ai/download
# Or use Homebrew
brew install ollama
```

**Linux:**

```bash
curl -fsSL https://ollama.ai/install.sh | sh
```

### 2. Install Recommended Models

After installing Ollama, pull the recommended models:

```bash
# Primary coding model (default)
ollama pull codellama:latest

# Alternative models for different tasks
ollama pull llama3:latest
ollama pull deepseek-coder:latest

# Smaller models for faster responses
ollama pull codellama:7b
ollama pull deepseek-coder:7b
```

### 3. Start Ollama Service

Make sure Ollama is running:

```bash
ollama serve
```

This will start Ollama on `http://localhost:11434` (default).

## Installation

1. **Download the Extension**

    - Download `dalvik-agent.vsix` from the releases

2. **Install in VS Code**

    ```bash
    code --install-extension dalvik-agent.vsix
    ```

3. **Restart VS Code**

## Configuration

Dalvik comes pre-configured to use Ollama with sensible defaults:

-   **Default Provider**: Ollama
-   **Default Model**: `codellama:latest`
-   **Default URL**: `http://localhost:11434`

### Changing Models

1. Open Dalvik sidebar
2. Click the Settings (⚙️) button
3. Select your preferred model from the dropdown
4. Available models are automatically detected from your Ollama installation

### Recommended Model Usage

-   **CodeLlama**: Best for general coding tasks
-   **DeepSeek Coder**: Excellent for complex algorithms and debugging
-   **Llama3**: Good for explanations and documentation

## Usage

### Basic Usage

1. **Open Dalvik**: Click the Dalvik icon in the activity bar or use `Ctrl+'` (Windows/Linux) or `Cmd+'` (macOS)

2. **Start a Task**: Click the "+" button or type your request

3. **Review Changes**: Dalvik will show diffs before applying any changes

4. **Approve Actions**: Review and approve file changes, terminal commands, etc.

### Example Prompts

```
Create a React component for a user profile card with avatar, name, and email

Refactor this function to use async/await instead of promises

Add error handling to the API calls in this file

Write unit tests for the authentication service

Optimize this SQL query for better performance
```

### Features

-   **File Context**: Dalvik automatically understands your project structure
-   **Safe Mode**: Always shows what it will do before doing it
-   **Terminal Integration**: Can run commands with your approval
-   **Memory**: Remembers context across conversations

## Keyboard Shortcuts

-   `Ctrl+'` / `Cmd+'`: Open Dalvik (when no text selected)
-   `Ctrl+'` / `Cmd+'`: Add selected text to Dalvik (when text selected)

## File Structure

Dalvik creates a `.dalvik-state.json` file in your workspace root to store:

-   Task history
-   Project context
-   Ongoing conversations

This file can be safely deleted to reset Dalvik's memory for a project.

## Troubleshooting

### Ollama Connection Issues

1. **Check Ollama is running**:

    ```bash
    curl http://localhost:11434/api/tags
    ```

2. **Verify models are installed**:

    ```bash
    ollama list
    ```

3. **Check Dalvik settings**:
    - Ensure Base URL is `http://localhost:11434`
    - Verify selected model exists in Ollama

### Performance Tips

-   Use smaller models (7B) for faster responses
-   Increase context window in settings for larger projects
-   Close unused applications to free up RAM for models

### Memory Requirements

-   **7B models**: ~8GB RAM
-   **13B models**: ~16GB RAM
-   **34B models**: ~32GB RAM

## Privacy & Security

Dalvik is designed with privacy in mind:

-   ✅ All processing happens locally
-   ✅ No data sent to external servers
-   ✅ Your code never leaves your machine
-   ✅ No telemetry or tracking
-   ✅ Open source and auditable

## Contributing

Dalvik is based on Cline AI and modified for offline-first operation. Contributions are welcome!

## License

Apache 2.0 License - See LICENSE file for details.

## Support

For issues and questions:

1. Check the troubleshooting section above
2. Verify Ollama is properly installed and running
3. Check VS Code Developer Console for error messages
