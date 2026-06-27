#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

echo "🔧 Configurando CMake..."
cmake -B "$PROJECT_DIR/build" -S "$PROJECT_DIR"

echo "🔨 Compilando..."
cmake --build "$PROJECT_DIR/build"

echo "✅ Compilación exitosa. Binario: $PROJECT_DIR/build/whatsapp-bot"
