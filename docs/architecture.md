# Arquitectura

## Diagrama general

```
┌─────────────────────────────────────────────────────┐
│                    WhatsApp                          │
│              (Message yourself)                      │
└──────────────────────┬──────────────────────────────┘
                       │ Baileys (WebSocket)
                       ▼
┌──────────────────────────────────────────────────────┐
│                  opencode-wa                          │
│                                                      │
│  ┌─────────────┐  ┌──────────────┐  ┌────────────┐  │
│  │ Inbound     │  │ Commands     │  │ Access     │  │
│  │ handler     │  │ (/help, etc) │  │ control    │  │
│  └──────┬──────┘  └──────────────┘  └────────────┘  │
└─────────┼────────────────────────────────────────────┘
          │ Llamadas a bridge
          ▼
┌──────────────────────────────────────────────────────┐
│                  bridge.js                            │
│                                                      │
│  Carga y gestiona el proceso C++. Traduce cada       │
│  método de la interfaz Bridge a JSON por stdin.      │
│  Lee respuestas JSON por stdout del proceso hijo.    │
└──────────────────────┬───────────────────────────────┘
          │ stdin/stdout (NDJSON)
          ▼
┌──────────────────────────────────────────────────────┐
│              whatsapp-bot (C++)                       │
│                                                      │
│  ┌──────────────┐  ┌──────────────┐  ┌────────────┐  │
│  │ Protocol     │  │ Bot          │  │ Session    │  │
│  │ NDJSON       │  │ (processQuery)│  │ manager    │  │
│  └──────────────┘  └──────────────┘  └────────────┘  │
└──────────────────────────────────────────────────────┘
```

## Flujo de un mensaje

1. El usuario envía un mensaje por WhatsApp
2. `opencode-wa` recibe el mensaje vía Baileys
3. El gateway verifica política de acceso (allowlist, pairing, etc.)
4. Si es un comando (`/help`, `/sess`, etc.), lo maneja internamente
5. Si es un mensaje normal, llama a `bridge.prompt()`
6. `bridge.js` serializa el pedido a JSON y lo escribe en stdin del proceso C++
7. El binario C++ lee la línea, parsea, ejecuta `processQuery()` y responde por stdout
8. `bridge.js` recibe la respuesta y la retorna al gateway
9. `opencode-wa` envía la respuesta al usuario por WhatsApp

## Comunicación bridge.js → C++

Protocolo **NDJSON** (Newline-Delimited JSON):

- bridge.js escribe en **stdin** del proceso C++
- C++ escribe en **stdout** (una línea JSON por respuesta)
- Cada request tiene un `id` correlativo para asociar respuesta
- El proceso C++ se mantiene vivo, procesando requests secuencialmente

## Sesiones

Las sesiones se almacenan en memoria dentro del proceso C++. Cada sesión contiene:
- `id` único
- `title` (título editable)
- Historial de mensajes (user ↔ assistant)

Cuando `opencode-wa` envía un prompt con `sessionId`, el bot C++ busca la sesión (o la crea si no existe), registra el mensaje, genera respuesta y la guarda en el historial.
