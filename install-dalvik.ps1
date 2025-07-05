# Dalvik Installation Script for Windows
# Run this in PowerShell as Administrator

Write-Host "🤖 Dalvik Setup Script for Windows" -ForegroundColor Green
Write-Host "===================================" -ForegroundColor Green
Write-Host ""

# Check if running as Administrator
$currentPrincipal = New-Object Security.Principal.WindowsPrincipal([Security.Principal.WindowsIdentity]::GetCurrent())
if (-not $currentPrincipal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)) {
    Write-Host "❌ Please run this script as Administrator" -ForegroundColor Red
    Write-Host "Right-click PowerShell and select 'Run as Administrator'" -ForegroundColor Yellow
    Read-Host "Press any key to exit"
    exit 1
}

# Install Ollama using winget
Write-Host "📦 Checking for Ollama installation..." -ForegroundColor Blue

try {
    $ollamaVersion = ollama --version 2>$null
    if ($ollamaVersion) {
        Write-Host "✅ Ollama is already installed: $ollamaVersion" -ForegroundColor Green
    }
} catch {
    Write-Host "📦 Installing Ollama via winget..." -ForegroundColor Blue
    try {
        winget install Ollama.Ollama --accept-package-agreements --accept-source-agreements
        Write-Host "✅ Ollama installed successfully" -ForegroundColor Green
        
        # Add Ollama to PATH if needed
        $env:PATH += ";$env:LOCALAPPDATA\Programs\Ollama"
        
        Write-Host "⚠️  Please restart PowerShell for PATH changes to take effect" -ForegroundColor Yellow
        Write-Host "Then run this script again to continue setup" -ForegroundColor Yellow
        Read-Host "Press any key to exit"
        exit 0
    } catch {
        Write-Host "❌ Failed to install Ollama via winget" -ForegroundColor Red
        Write-Host "Please install manually from https://ollama.ai/download" -ForegroundColor Yellow
        Read-Host "Press any key to exit"
        exit 1
    }
}

Write-Host ""

# Start Ollama service
Write-Host "🚀 Starting Ollama service..." -ForegroundColor Blue

# Kill any existing Ollama processes
Get-Process -Name "ollama" -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue

# Start Ollama in background
Start-Process -FilePath "ollama" -ArgumentList "serve" -WindowStyle Hidden

# Wait for service to start
Write-Host "⏳ Waiting for Ollama to start..." -ForegroundColor Blue
Start-Sleep -Seconds 5

# Test connection
try {
    $response = Invoke-RestMethod -Uri "http://localhost:11434/api/tags" -Method Get -TimeoutSec 10
    Write-Host "✅ Ollama is running" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to connect to Ollama service" -ForegroundColor Red
    Write-Host "Please start Ollama manually by running 'ollama serve' in a separate PowerShell window" -ForegroundColor Yellow
    Read-Host "Press any key to continue anyway"
}

Write-Host ""

# Install recommended models
Write-Host "📥 Installing recommended AI models..." -ForegroundColor Blue
Write-Host "This may take a while depending on your internet connection..." -ForegroundColor Yellow
Write-Host ""

$models = @("codellama:latest", "llama3:latest", "deepseek-coder:latest")

foreach ($model in $models) {
    Write-Host "📦 Pulling $model..." -ForegroundColor Blue
    try {
        $pullProcess = Start-Process -FilePath "ollama" -ArgumentList "pull", $model -Wait -PassThru -NoNewWindow
        if ($pullProcess.ExitCode -eq 0) {
            Write-Host "✅ $model installed successfully" -ForegroundColor Green
        } else {
            Write-Host "⚠️  Failed to install $model (you can install it later)" -ForegroundColor Yellow
        }
    } catch {
        Write-Host "⚠️  Failed to install $model (you can install it later)" -ForegroundColor Yellow
    }
    Write-Host ""
}

Write-Host "🎉 Setup Complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Install the Dalvik VS Code extension:" -ForegroundColor White
Write-Host "   code --install-extension dalvik-agent.vsix" -ForegroundColor Gray
Write-Host "2. Restart VS Code" -ForegroundColor White
Write-Host "3. Click the Dalvik icon in the sidebar to start coding!" -ForegroundColor White
Write-Host ""

Write-Host "Available models:" -ForegroundColor Cyan
try {
    ollama list
} catch {
    Write-Host "Run 'ollama list' to see installed models" -ForegroundColor Gray
}

Write-Host ""
Write-Host "💡 Tips:" -ForegroundColor Yellow
Write-Host "- Use 'codellama:latest' for general coding (default)" -ForegroundColor White
Write-Host "- Use 'deepseek-coder:latest' for complex algorithms" -ForegroundColor White
Write-Host "- Use 'llama3:latest' for explanations and documentation" -ForegroundColor White
Write-Host ""
Write-Host "🔧 To change models: Open Dalvik → Settings → Select model" -ForegroundColor Cyan
Write-Host ""
Write-Host "Happy coding with Dalvik! 🚀" -ForegroundColor Green

Read-Host "Press any key to exit"
