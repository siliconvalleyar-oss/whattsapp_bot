# Comandos de WhatsApp

Todos los comandos se envían en el chat **"Message yourself"** (chat contigo mismo).

## Comandos de sesión

| Comando | Descripción | Ejemplo |
|---------|-------------|---------|
| `/sesslist` | Lista las últimas 20 sesiones | `/sesslist` |
| `/sess <n>` | Fijar sesión por índice | `/sess 2` |
| `/sess <id>` | Fijar sesión por ID | `/sess ses_abc123` |
| `/sess show` | Muestra la sesión fijada actual | `/sess show` |
| `/sess d <n> yes` | Eliminar sesión | `/sess d 1 yes` |
| `/new` | Crear nueva sesión | `/new` |
| `/title <nombre>` | Renombrar sesión actual | `/title Cliente Juan` |
| `/history` | Últimos 10 mensajes | `/history` |
| `/history <n>` | Últimos N mensajes (max 50) | `/history 25` |
| `/last` | Reenviar última respuesta AI | `/last` |

## Comandos de modelo

| Comando | Descripción | Ejemplo |
|---------|-------------|---------|
| `/modellist` | Lista modelos disponibles | `/modellist` |
| `/model` | Muestra modelo activo | `/model` |
| `/model <n>` | Seleccionar modelo por índice | `/model 3` |
| `/model provider/id` | Seleccionar por ID completo | `/model opencode/claude-sonnet` |
| `/model default` | Restablecer modelo por defecto | `/model default` |
| `/agent` | Muestra agente activo | `/agent` |
| `/agent <n\|name>` | Cambiar de agente | `/agent build` |
| `/variants` | Ver variantes del modelo actual | `/variants` |
| `/variants <n\|name>` | Cambiar variante | `/variants high` |

## Comandos de control

| Comando | Descripción | Ejemplo |
|---------|-------------|---------|
| `/help` | Muestra ayuda completa | `/help` |
| `/status` | Estado del gateway y sesión | `/status` |
| `/stop` | Detiene la operación en curso | `/stop` |
| `/ping` | Health check | `/ping` |
| `/undo` | Deshace el último mensaje | `/undo` |
| `/redo` | Rehace el último mensaje deshecho | `/redo` |
| `/stats` | Estadísticas de uso | `/stats` |
| `/diag` | Diagnóstico del gateway | `/diag` |

## Comportamiento del bot C++

Los mensajes que **no** son comandos se envían al bot C++ para procesamiento. El bot responde automáticamente según las palabras clave detectadas (ver `CUSTOMIZATION.md`).
