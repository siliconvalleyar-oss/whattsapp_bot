#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

echo "🧹 Limpiando build..."
rm -rf "$PROJECT_DIR/build"
echo "✅ Build eliminado."

echo "🧹 Limpiando residuos de IDE..."
rm -rf "$PROJECT_DIR/.vscode" "$PROJECT_DIR/.idea" 2>/dev/null || true
echo "✅ Limpieza completa."
