# Reglas de Oro — whattsapp_bot

> Reglas sagradas del proyecto. No se modifican sin consentimiento explícito del equipo.

---

## 1. No borrar archivos del proyecto

Todos los archivos fuente, documentación y scripts creados en el repositorio **no se eliminan**. Si algo parece obsoleto, se **depreca** (nunca se borra) y se deja constancia en el README o en un comentario.

### Excepciones
- Archivos generados por compilación (`build/`)
- Archivos temporales del sistema (`.DS_Store`, `Thumbs.db`)
- Archivos de datos sensibles (`database/*.csv`, etc.)

---

## 2. Datos sensibles nunca se suben

- `database/` contiene datos de clientes — **excluido vía `.gitignore`**
- API keys, tokens, contraseñas, números de teléfono reales → solo en `config.local.json` o `.env`
- Nunca commitear archivos con datos reales de clientes

---

## 3. Versionado semántico

- `VERSION` es la fuente única de verdad (formato `MAJOR.MINOR.PATCH`)
- Cada `git push` incrementa automáticamente el **PATCH**
- Cada push crea un tag `vMAJOR.MINOR.PATCH`
- Para cambios mayores (MAJOR) o menores (MINOR), editar `VERSION` manualmente antes del push

---

## 4. Documentación siempre actualizada

- Cada nueva funcionalidad debe tener su documentación en `docs/`
- El `docs/README.md` refleja la estructura actual del proyecto
- Los scripts en `script_tools/` documentan su uso en el encabezado

---

## 5. Commits claros y en español

- Los mensajes de commit describen **qué** y **por qué**
- Preferir español (idioma del equipo)
- Un commit = un cambio lógico atómico

---

## 6. El bridge C++ nunca rompe el protocolo

- `bridge.js` y `whatsapp-bot` se comunican vía NDJSON
- No cambiar el formato de los mensajes sin actualizar ambos lados
- Todos los métodos de la interfaz `Bridge` deben estar implementados

---

## 7. Tests antes de push

Siempre ejecutar antes de pushear:
```bash
./script_tools/build.sh   # compila
./script_tools/test.sh    # verifica que responde correctamente
```

---

*Estas reglas pueden ser modificadas solo por decisión del equipo y con commit explícito a este archivo.*
