#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
BIN="$PROJECT_DIR/build/whatsapp-bot"

if [ ! -f "$BIN" ]; then
    echo "❌ Binario no encontrado. Ejecutá primero: ./script_tools/build.sh"
    exit 1
fi

echo "🧪 Test: listar sesiones + consultas de ejemplo"
echo ""

# Test con múltiples consultas
printf '{"id":1,"method":"listSessions","params":{}}
{"id":2,"method":"prompt","params":{"sessionId":"ses_test","text":"hola, necesito ayuda","channel":"whatsapp"}}
{"id":3,"method":"prompt","params":{"sessionId":"ses_test","text":"cual es el horario de atencion?","channel":"whatsapp"}}
{"id":4,"method":"prompt","params":{"sessionId":"ses_test","text":"cuanto cuesta el producto?","channel":"whatsapp"}}
{"id":5,"method":"prompt","params":{"sessionId":"ses_test","text":"gracias","channel":"whatsapp"}}
{"id":6,"method":"prompt","params":{"sessionId":"ses_test","text":"adios","channel":"whatsapp"}}
{"id":7,"method":"getMessages","params":{"id":"ses_test"}}
{"id":8,"method":"close","params":{}}' | "$BIN" | python3 -c "
import sys, json
for line in sys.stdin:
    line = line.strip()
    if line:
        print(json.dumps(json.loads(line), indent=2))
        print()
"
