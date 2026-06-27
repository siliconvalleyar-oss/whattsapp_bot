#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
cd "$PROJECT_DIR"

VERSION="$(cat VERSION | tr -d '[:space:]')"
TAG="v${VERSION}"

if git rev-parse "$TAG" >/dev/null 2>&1; then
    echo "⚠️  El tag $TAG ya existe."
    read -rp "¿Sobrescribir? (s/N): " CONFIRM
    if [ "$CONFIRM" != "s" ] && [ "$CONFIRM" != "S" ]; then
        echo "Cancelado."
        exit 0
    fi
    git tag -d "$TAG"
fi

echo "🏷️  Creando tag $TAG..."
git tag "$TAG"

echo "📤 Pusheando tag..."
git push origin "$TAG"

echo "✅ Tag $TAG pusheado correctamente."
