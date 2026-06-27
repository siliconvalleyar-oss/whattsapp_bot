# WhatsApp Bot C++ — opencode-wa Bridge

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
![Version](https://img.shields.io/badge/version-1.0.0-blue)

Bot de atención al cliente vía WhatsApp usando `opencode-wa` como gateway y un backend en **C++** puro para el procesamiento de mensajes.

---

## Arquitectura

```
WhatsApp ──► opencode-wa ──► bridge.js ──► C++ (whatsapp-bot)
```

| Capa | Rol |
|------|-----|
| **WhatsApp** | App del usuario (Message yourself) |
| **opencode-wa** | Gateway WhatsApp → Bridge. Escucha mensajes, maneja comandos, control de acceso |
| **bridge.js** | Carga el binario C++, traduce la interfaz `Bridge` de opencode-wa a NDJSON por stdin/stdout |
| **whatsapp-bot** | Binario C++ que recibe JSON, procesa la consulta y responde |

### Protocolo

La comunicación bridge.js ↔ whatsapp-bot usa **NDJSON** (Newline-Delimited JSON):

```
→ {"id":1,"method":"listSessions","params":{}}
← {"id":1,"result":[{"id":"ses_abc...","title":"WhatsApp #1"}]}

→ {"id":2,"method":"prompt","params":{"sessionId":"ses_abc...","text":"hola","channel":"whatsapp"}}
← {"id":2,"result":{"text":"¡Hola! ...","ms":5,"providerID":"cpp","modelID":"whatsapp-bot"}}
```

---

## Requisitos

- **Node.js** ≥ 18
- **OpenCode CLI** (`opencode` en PATH)
- **opencode-wa** (`npm i -g opencode-wa`)
- **CMake** ≥ 3.20
- **Compilador C++20** (g++ ≥ 11, clang ≥ 14)
- **nlohmann/json** (se descarga automáticamente vía FetchContent)

---

## Instalación

```bash
# 1. Compilar el binario C++
git clone https://github.com/siliconvalleyar-oss/whattsapp_bot.git
cd whattsapp_bot
cmake -B build
cmake --build build

# 2. Verificar que funciona
echo '{"id":1,"method":"listSessions","params":{}}
{"id":2,"method":"close","params":{}}' | ./build/whatsapp-bot

# 3. Configurar WhatsApp (solo la primera vez)
opencode-wa config

# 4. Ejecutar el gateway con el bridge C++
opencode-wa run --bridge ./bridge.js
```

---

## Uso desde WhatsApp

| Comando | Descripción |
|---------|-------------|
| `/sesslist` | Lista todas las sesiones |
| `/sess <n>` | Fijar sesión por número |
| `/new` | Crear nueva sesión |
| `/help` | Muestra la ayuda completa del gateway |
| `/status` | Muestra sesión, modelo y agente activos |
| `/model` | Ver modelo activo |
| `/model <n>` | Cambiar de modelo |
| `/history` | Últimos 10 mensajes |
| `/undo` / `/redo` | Deshacer / rehacer último mensaje |
| `/stop` | Detener operación en curso |

El bot responde automáticamente consultas de clientes sin necesidad de comandos especiales.

---

## Comportamiento del bot

El bot detecta palabras clave y responde apropiadamente:

| Palabra clave | Respuesta |
|---------------|-----------|
| hola, buenos, saludos | Saludo de bienvenida |
| horario | Horario de atención |
| precio, costo, cuanto | Información de cotización |
| contacto, tel, email | Datos de contacto |
| gracias | Agradecimiento |
| adios, chao, bye | Despedida |
| *otro* | Respuesta genérica + aviso al representante |

---

## Personalizar respuestas

Editar `src/bot.cpp`, función `processQuery()`:

```cpp
if (lower.find("envio") != std::string::npos) {
    return "Los envíos tardan entre 3 y 5 días hábiles. ¿Necesitas tracking?";
}
```

### Integrar con una IA real

```cpp
// Ejemplo: llamar a OpenAI / Claude / etc. vía HTTP
std::string response = callAIAPI(input.text);
return response;
```

---

## Estructura del proyecto

```
whattsapp_bot/
├── CMakeLists.txt          # Build system CMake
├── LICENSE                 # Licencia MIT
├── VERSION                 # Versión del proyecto
├── bridge.js               # Bridge JavaScript → C++
├── .gitignore              # Exclusiones de seguridad
├── .githooks/
│   └── pre-push            # Hook que crea tag v$VERSION al pushear
├── docs/
│   ├── README.md           # Este archivo
│   ├── RULES.md            # Reglas de oro del proyecto
│   ├── ARCHITECTURE.md     # Arquitectura detallada
│   ├── COMMANDS.md         # Comandos de WhatsApp
│   ├── CUSTOMIZATION.md    # Personalización del bot
│   ├── PROTOCOL.md         # Protocolo NDJSON
│   ├── DEPLOYMENT.md       # Despliegue y systemd
│   └── DATABASE.md         # Base de datos de clientes
├── script_tools/
│   ├── build.sh            # Compilar proyecto
│   ├── run.sh              # Ejecutar gateway WhatsApp
│   ├── test.sh             # Test rápido del binario
│   ├── query.sh            # Enviar consulta de prueba
│   ├── tag.sh              # Crear y pushear tag
│   ├── status.sh           # Estado del proyecto
│   └── clean.sh            # Limpiar build
├── src/
│   ├── main.cpp            # Loop principal stdin/stdout
│   ├── bridge_protocol.h   # Protocolo NDJSON
│   ├── bridge_protocol.cpp
│   ├── bot.h               # Lógica del bot
│   └── bot.cpp
└── build/                  # Generado por CMake (ignorado)
```

---

## Control de versiones

El proyecto usa `VERSION` como fuente única de verdad para la versión.

```bash
# Crear un tag y pushear
git tag v$(cat VERSION)
git push origin v$(cat VERSION)

# Subir cambios + tag
git push origin main --tags
```

---

## Licencia

Distribuido bajo licencia MIT. Ver [`LICENSE`](LICENSE).
