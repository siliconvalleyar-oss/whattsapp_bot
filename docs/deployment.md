# Despliegue

## Requisitos del servidor

- Linux (probado en Ubuntu 24.04)
- Node.js ≥ 18
- CMake ≥ 3.20
- g++ ≥ 11 o clang ≥ 14
- `opencode` CLI
- `opencode-wa` instalado globalmente

## Instalación desde cero

```bash
# 1. Instalar dependencias del sistema
sudo apt update
sudo apt install -y nodejs cmake g++ git

# 2. Instalar opencode CLI
curl -fsSL https://opencode.ai/install.sh | sh

# 3. Instalar opencode-wa
npm install -g opencode-wa

# 4. Clonar el proyecto
git clone https://github.com/siliconvalleyar-oss/whattsapp_bot.git
cd whattsapp_bot

# 5. Compilar
cmake -B build
cmake --build build

# 6. Configurar WhatsApp
opencode-wa config

# 7. Ejecutar
opencode-wa run --bridge ./bridge.js
```

## Ejecución como servicio (systemd)

Crear `/etc/systemd/system/whatsapp-bot.service`:

```ini
[Unit]
Description=WhatsApp Bot C++ with opencode-wa
After=network.target

[Service]
Type=simple
User=tu-usuario
WorkingDirectory=/home/tu-usuario/whattsapp_bot
ExecStart=/usr/bin/opencode-wa run --bridge ./bridge.js
Restart=on-failure
RestartSec=5
Environment=WA_VERBOSE=0
Environment=OPENCODE_DISABLE_CLAUDE_CODE_PROMPT=1

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl daemon-reload
sudo systemctl enable whatsapp-bot
sudo systemctl start whatsapp-bot
sudo systemctl status whatsapp-bot
```

## Mantenimiento

### Actualizar el bot C++

```bash
cd whattsapp_bot
git pull
cmake -B build
cmake --build build
sudo systemctl restart whatsapp-bot
```

### Actualizar opencode-wa

```bash
npm update -g opencode-wa
sudo systemctl restart whatsapp-bot
```

### Logs

```bash
journalctl -u whatsapp-bot -f
```

## Seguridad

- El gateway solo escucha en `127.0.0.1` (loopback)
- `opencode-wa` nunca expone puertos a la red
- No se almacenan tokens ni API keys en el repositorio
- Usar política `allowlist` para restringir acceso solo a números conocidos
