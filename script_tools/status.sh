#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
cd "$PROJECT_DIR"

echo "📋 Estado del proyecto"
echo "══════════════════════"
echo ""

# Versión
echo "📌 Versión: $(cat VERSION 2>/dev/null || echo 'N/A')"

# Git
echo "📍 Rama:    $(git branch --show-current 2>/dev/null || echo 'N/A')"
echo "🏷️  Tags:     $(git tag | tr '\n' ' ' || echo 'ninguno')"

# Binario
BIN="$PROJECT_DIR/build/whatsapp-bot"
if [ -f "$BIN" ]; then
    echo "✅ Binario:  compilado ($(file "$BIN" | awk -F', ' '{print $2}'))"
else
    echo "❌ Binario:  no compilado (usar ./script_tools/build.sh)"
fi

# opencode-wa
if command -v opencode-wa &>/dev/null; then
    echo "✅ opencode-wa: instalado"
else
    echo "❌ opencode-wa: no instalado"
fi

# opencode
if command -v opencode &>/dev/null; then
    echo "✅ opencode:  instalado"
else
    echo "❌ opencode:  no instalado"
fi

echo ""
echo "📁 Archivos:"
git ls-files | head -20 | sed 's/^/  /'
echo "  ... ($(git ls-files | wc -l) total)"
