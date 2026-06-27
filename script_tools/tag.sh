#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
cd "$PROJECT_DIR"

CURRENT="$(cat VERSION | tr -d '[:space:]')"

# Incrementar PATCH
MAJOR="${CURRENT%%.*}"
REST="${CURRENT#*.}"
MINOR="${REST%.*}"
PATCH="${REST#*.}"
NEXT_PATCH="$((PATCH + 1))"
NEXT="${MAJOR}.${MINOR}.${NEXT_PATCH}"

echo "📌 Versión actual: $CURRENT"
echo "⬆️  Nueva versión: $NEXT"
echo ""

# Guardar y commitear
echo "$NEXT" > VERSION
git add VERSION
git commit -m "Bump version $CURRENT → $NEXT"

TAG="v${NEXT}"
echo "🏷️  Creando tag $TAG..."
git tag "$TAG"

echo "📤 Pusheando commit y tag..."
git push origin main --tags

echo "✅ Tag $TAG pusheado correctamente."
