# WhatsApp Bot C++ — opencode-wa Bridge

Bot de atención al cliente vía WhatsApp usando `opencode-wa` con backend C++.

## Arquitectura

```
WhatsApp → opencode-wa → bridge.js → C++ (whatsapp-bot)
```

- **`opencode-wa`** — gateway WhatsApp que recibe mensajes
- **`bridge.js`** — capa delgada JS que spawncea el binario C++ y traduce la interfaz `Bridge`
- **`whatsapp-bot`** — binario C++ que procesa consultas y responde

La comunicación entre `bridge.js` y `whatsapp-bot` es via **NDJSON** (JSON delimitado por newline) por stdin/stdout.

## Requisitos

- Node.js ≥ 18
- OpenCode CLI (`opencode`)
- `opencode-wa` (`npm i -g opencode-wa`)
- CMake ≥ 3.20
- Compilador C++20 (g++ ≥ 11, clang ≥ 14)

## Compilar

```bash
cd /home/optimus/Documentos/src/desktop_src/whatsapp
cmake -B build
cmake --build build
```

## Configurar WhatsApp

```bash
opencode-wa config
```

Sigue los pasos: escanea el QR, configura tu número y política de acceso.

## Ejecutar

```bash
opencode-wa run --bridge ./bridge.js
```

## Comandos disponibles en WhatsApp

| Comando | Descripción |
|---------|-------------|
| `/sesslist` | Lista sesiones |
| `/sess <n>` | Fijar sesión |
| `/new` | Nueva sesión |
| `/help` | Ayuda completa |
| `/status` | Estado actual |
| `/model` | Ver modelo activo |
| `/history` | Últimos mensajes |

El bot responde automáticamente consultas de clientes con respuestas predefinidas basadas en palabras clave (horarios, precios, contacto, etc.).

## Personalizar respuestas

Editar `src/bot.cpp` — función `processQuery()`. Para integrar una API de IA (OpenAI, Claude, etc.), modifica esa función para hacer llamadas HTTP.

## Protocolo NDJSON

```
→ {"id":1,"method":"listSessions","params":{}}
← {"id":1,"result":[{"id":"ses_...","title":"..."}]}

→ {"id":2,"method":"prompt","params":{"sessionId":"ses_...","text":"hola","channel":"whatsapp"}}
← {"id":2,"result":{"text":"¡Hola! ...","ms":5,"providerID":"cpp","modelID":"whatsapp-bot"}}
```

## Estructura del proyecto

```
├── CMakeLists.txt
├── bridge.js
├── src/
│   ├── main.cpp            # Loop principal stdin/stdout
│   ├── bridge_protocol.h   # Protocolo NDJSON
│   ├── bridge_protocol.cpp
│   ├── bot.h               # Lógica del bot
│   └── bot.cpp
├── .gitignore
└── README.md
```
