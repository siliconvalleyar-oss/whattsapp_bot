# Personalización del Bot

## Respuestas por palabra clave

El comportamiento del bot se define en `src/bot.cpp`, función `processQuery()`.

### Estructura actual

```cpp
std::string Bot::processQuery(const std::string& text) {
    auto lower = text;
    std::transform(lower.begin(), lower.end(), lower.begin(), ::tolower);

    if (lower.find("palabra") != std::string::npos) {
        return "Respuesta personalizada";
    }
    // ... más reglas ...

    return "Respuesta por defecto";
}
```

### Agregar una nueva regla

```cpp
if (lower.find("envio") != std::string::npos || lower.find("entrega") != std::string::npos) {
    return "Los envíos tardan entre 3 y 5 días hábiles. ¿Necesitas el número de tracking?";
}
```

### Respuestas actuales

| Palabra clave detectada | Respuesta |
|-------------------------|-----------|
| `hola`, `buenos`, `saludos` | Saludo de bienvenida + ofrecimiento de ayuda |
| `horario` | Horario de atención (lunes a viernes 9-18) |
| `precio`, `costo`, `cuanto` | Solicita especificar producto/servicio |
| `contacto`, `tel`, `email` | Datos de contacto |
| `gracias` | Agradecimiento |
| `adios`, `chao`, `bye` | Despedida |
| cualquier otra consulta | Respuesta genérica + aviso de derivación |

## Integrar con API de IA

### Opción 1: Llamada HTTP directa

```cpp
#include <curl/curl.h>

std::string Bot::processQuery(const std::string& text) {
    // Llamar a API de OpenAI, Claude, etc.
    return callAI(text);
}

static std::string callAI(const std::string& prompt) {
    CURL* curl = curl_easy_init();
    // Configurar headers, body JSON con la API key
    // Leer respuesta y retornar texto
}
```

### Opción 2: Usar lib cpp-httplib con OpenAI

Agregar al `CMakeLists.txt`:
```cmake
FetchContent_Declare(cpp-httplib URL ...)
```

### Opción 3: Proxy a otro servicio local

El bot C++ puede enviar el request a un servicio Python/Node corriendo en localhost y devolver su respuesta.

## Modificar el prompt del sistema

Si querés que el bot tenga personalidad o contexto fijo, modificá la sección inicial del mensaje en el método `prompt()` de `bot.cpp` para anteponer instrucciones antes de la consulta del usuario.

## Compilar después de cambios

```bash
cmake -B build && cmake --build build
```
