#!/usr/bin/env bash
set -euo pipefail

# push.sh - Incrementa VERSION, commitea, taguea y pushea
# Uso: ./script_tools/push.sh [mensaje de commit opcional]

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
cd "$PROJECT_DIR"

# 1. Verificar que no haya cambios sin stagear
if ! git diff --quiet; then
    echo "❌ Hay cambios sin stagear. Stagealos o descartalos primero."
    git diff --stat
    exit 1
fi

# 2. Verificar que haya algo para commitear
if git diff --cached --quiet; then
    echo "⚠️  No hay cambios stageados para commitear."
    echo "   Usá: git add <archivos> && ./script_tools/push.sh"
    exit 1
fi

# 3. Incrementar VERSION
CURRENT="$(cat VERSION | tr -d '[:space:]')"
MAJOR="${CURRENT%%.*}"
REST="${CURRENT#*.}"
MINOR="${REST%.*}"
PATCH="${REST#*.}"
NEXT_PATCH="$((PATCH + 1))"
NEXT="${MAJOR}.${MINOR}.${NEXT_PATCH}"

echo "📌 VERSION: $CURRENT → $NEXT"
echo "$NEXT" > VERSION
git add VERSION

# 4. Commit (con mensaje opcional o por defecto)
MSG="${*:-"Bump version $CURRENT → $NEXT"}"
git commit -m "$MSG"

# 5. Tag
TAG="v${NEXT}"
git tag "$TAG"
echo "🏷️  Tag: $TAG"

# 6. Push
echo "📤 Pusheando..."
git push origin main --tags

echo "✅ Listo."
