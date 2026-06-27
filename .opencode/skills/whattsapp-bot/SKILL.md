---
name: whattsapp-bot
description: WhatsApp bot with opencode-wa gateway and C++ backend. Covers build, run, architecture, conventions, and NDJSON protocol.
---

# whattsapp_bot

WhatsApp bot for customer service using `opencode-wa` as gateway and a **C++ backend** (`whatsapp-bot` binary) that communicates via NDJSON over stdin/stdout.

## Architecture

```
WhatsApp → opencode-wa → bridge.js → stdin/stdout (NDJSON) → whatsapp-bot (C++)
```

## Structure

- `bridge.js` — JS bridge that spawns C++ process and translates Bridge interface
- `src/` — C++ source (main.cpp, bot.cpp, bridge_protocol.cpp)
- `docs/` — All project documentation (.md files)
- `script_tools/` — Bash utilities (build, run, test, query, tag, status, clean)
- `database/` — Client CSV/Excel data (gitignored)
- `VERSION` — Single source of truth for version (auto-bumped on push)

## Build

```bash
cd /home/optimus/Documentos/src/desktop_src/whatsapp
./script_tools/build.sh
# or manually:
cmake -B build && cmake --build build
```

## Run

```bash
opencode-wa config           # first-time setup (QR scan)
./script_tools/run.sh        # opencode-wa run --bridge ./bridge.js
```

## Test

```bash
./script_tools/test.sh       # sends sample queries to C++ binary
./script_tools/query.sh <session_id> "consulta"   # custom query
```

## NDJSON protocol

C++ binary reads JSON requests from stdin, writes JSON responses to stdout:

```
→ {"id":1,"method":"prompt","params":{"sessionId":"ses_abc","text":"hola","channel":"whatsapp"}}
← {"id":1,"result":{"text":"¡Hola! ...","ms":0,"providerID":"cpp","modelID":"whatsapp-bot"}}
```

Full reference: `docs/PROTOCOL.md`

## Key conventions

- Never delete files; deprecate instead
- All `.md` files in `docs/` — uppercase name + lowercase extension
- `VERSION` is auto-bumped (PATCH) on every `git push` via pre-push hook
- Each push creates a `vMAJOR.MINOR.PATCH` tag
- Database files in `database/` are gitignored (sensitive data)
- Run `./script_tools/test.sh` before pushing
- Bridge must implement ALL Bridge interface methods

## Common commands

| Command | Description |
|---------|-------------|
| `./script_tools/build.sh` | Compile C++ binary |
| `./script_tools/run.sh` | Start WhatsApp gateway |
| `./script_tools/test.sh` | Run integration test |
| `./script_tools/query.sh` | Send test query |
| `./script_tools/tag.sh` | Bump version, tag, push |
| `./script_tools/status.sh` | Project health check |
| `./script_tools/clean.sh` | Remove build artifacts |
| `git push` | Auto-bumps VERSION + creates tag |
