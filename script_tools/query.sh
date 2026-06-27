#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
BIN="$PROJECT_DIR/build/whatsapp-bot"

if [ ! -f "$BIN" ]; then
    echo "❌ Binario no encontrado. Ejecutá primero: ./script_tools/build.sh"
    exit 1
fi

SESSION_ID="${1:-ses_test}"
QUERY="${2:-}"

if [ -z "$QUERY" ]; then
    echo "Uso: $0 <session_id> <consulta>"
    echo ""
    echo "Ejemplos:"
    echo "  $0 ses_test 'hola, necesito ayuda'"
    echo "  $0 ses_test 'cual es el horario?'"
    echo "  $0 ses_test 'adios'"
    exit 1
fi

printf '{"id":1,"method":"prompt","params":{"sessionId":"%s","text":"%s","channel":"whatsapp"}}
{"id":2,"method":"close","params":{}}' "$SESSION_ID" "$QUERY" | "$BIN" | python3 -c "
import sys, json
for line in sys.stdin:
    line = line.strip()
    if line:
        print(json.dumps(json.loads(line), indent=2))
        print()
"
