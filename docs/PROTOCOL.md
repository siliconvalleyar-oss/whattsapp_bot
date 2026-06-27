# Protocolo NDJSON

La comunicación entre `bridge.js` y el binario `whatsapp-bot` usa **NDJSON** (Newline-Delimited JSON) a través de **stdin/stdout**.

## Formato general

### Request (bridge.js → C++)

```json
{"id": <int>, "method": "<string>", "params": {<object>}}
```

Una línea por request, terminada en `\n`.

### Response exitosa (C++ → bridge.js)

```json
{"id": <int>, "result": <any>}
```

### Response con error (C++ → bridge.js)

```json
{"id": <int>, "error": "<mensaje>"}
```

## Métodos implementados

### listSessions

```json
→ {"id":1,"method":"listSessions","params":{}}
← {"id":1,"result":[{"id":"ses_abc123","title":"WhatsApp #1"}]}
```

### createSession

```json
→ {"id":2,"method":"createSession","params":{"title":"Nueva sesión"}}
← {"id":2,"result":{"id":"ses_def456","title":"Nueva sesión"}}
```

### deleteSession

```json
→ {"id":3,"method":"deleteSession","params":{"id":"ses_abc123"}}
← {"id":3,"result":null}
```

### getSession

```json
→ {"id":4,"method":"getSession","params":{"id":"ses_abc123"}}
← {"id":4,"result":{"id":"ses_abc123","title":"WhatsApp #1"}}
```

### renameSession

```json
→ {"id":5,"method":"renameSession","params":{"id":"ses_abc123","title":"Nuevo título"}}
← {"id":5,"result":{"id":"ses_abc123","title":"Nuevo título"}}
```

### getMessages

```json
→ {"id":6,"method":"getMessages","params":{"id":"ses_abc123"}}
← {"id":6,"result":[{"role":"user","text":"hola","id":"user_0"},{"role":"assistant","text":"¡Hola!","id":"assistant_1"}]}
```

### prompt (el más importante)

```json
→ {"id":7,"method":"prompt","params":{"sessionId":"ses_abc123","text":"consulta del usuario","channel":"whatsapp"}}
← {"id":7,"result":{"text":"Respuesta del bot","ms":5,"providerID":"cpp","modelID":"whatsapp-bot"}}
```

### stop

```json
→ {"id":8,"method":"stop","params":{"sessionId":"ses_abc123"}}
← {"id":8,"result":true}
```

### undo / redo

```json
→ {"id":9,"method":"undo","params":{"sessionId":"ses_abc123"}}
← {"id":9,"result":{"ok":true,"text":"último mensaje del usuario"}}
```

### listModels

```json
→ {"id":10,"method":"listModels","params":{}}
← {"id":10,"result":[{"providerID":"cpp","modelID":"whatsapp-bot","name":"WhatsApp Bot C++","free":true}]}
```

### diag / getStatus / listAgents

```json
→ {"id":11,"method":"diag","params":{}}
← {"id":11,"result":{"text":"WhatsApp Bot C++ v1.0.0 running"}}
```

### close

Finaliza el proceso C++.

```json
→ {"id":12,"method":"close","params":{}}
← {"id":12,"result":true}
```

## Notas

- Cada request **debe** terminar con `\n` (newline)
- Las respuestas se reciben en el mismo orden que los requests (síncrono)
- El proceso C++ nunca escribe a stdout por iniciativa propia, solo como respuesta a un request
- Los mensajes de error/depuración van a **stderr** y no afectan el protocolo
