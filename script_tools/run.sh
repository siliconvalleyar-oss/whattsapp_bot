#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

BIN="$PROJECT_DIR/build/whatsapp-bot"
if [ ! -f "$BIN" ]; then
    echo "❌ Binario no encontrado. Ejecutá primero: ./script_tools/build.sh"
    exit 1
fi

echo "🚀 Iniciando gateway WhatsApp con bridge C++..."
echo "   (asegurate de haber ejecutado 'opencode-wa config' primero)"
echo ""

cd "$PROJECT_DIR"
opencode-wa run --bridge ./bridge.js
