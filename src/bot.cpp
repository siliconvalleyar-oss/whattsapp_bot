#include "bot.h"
#include <sstream>
#include <algorithm>
#include <cctype>
#include <random>

static std::string randomHex(size_t len) {
    static const char hex[] = "0123456789abcdef";
    static thread_local std::mt19937 rng(std::random_device{}());
    std::uniform_int_distribution<int> dist(0, 15);
    std::string out(len, '0');
    for (auto& c : out) c = hex[dist(rng)];
    return out;
}

Bot::Bot() {
    auto id = "ses_" + randomHex(16);
    sessions_[id] = Session{id, "WhatsApp #1", {}};
    activeSessionId_ = id;
}

std::string Bot::generateId() {
    return "ses_" + randomHex(16);
}

std::vector<BridgeSession> Bot::listSessions() {
    std::lock_guard lock(mtx_);
    std::vector<BridgeSession> out;
    for (const auto& [id, s] : sessions_) {
        out.push_back({id, s.title});
    }
    return out;
}

BridgeSession Bot::createSession(const std::string& title) {
    std::lock_guard lock(mtx_);
    auto id = generateId();
    sessions_[id] = Session{id, title, {}};
    return {id, title};
}

void Bot::deleteSession(const std::string& id) {
    std::lock_guard lock(mtx_);
    sessions_.erase(id);
    if (activeSessionId_ == id) activeSessionId_.clear();
}

std::optional<BridgeSession> Bot::getSession(const std::string& id) {
    std::lock_guard lock(mtx_);
    auto it = sessions_.find(id);
    if (it == sessions_.end()) return std::nullopt;
    return BridgeSession{it->second.id, it->second.title};
}

void Bot::renameSession(const std::string& id, const std::string& title) {
    std::lock_guard lock(mtx_);
    auto it = sessions_.find(id);
    if (it != sessions_.end()) {
        it->second.title = title;
    }
}

nlohmann::json Bot::getMessages(const std::string& id) {
    std::lock_guard lock(mtx_);
    auto it = sessions_.find(id);
    if (it == sessions_.end()) return nlohmann::json::array();
    nlohmann::json arr = nlohmann::json::array();
    for (const auto& [role, text] : it->second.messages) {
        arr.push_back({
            {"role", role},
            {"text", text},
            {"id", role + "_" + std::to_string(arr.size())}
        });
    }
    return arr;
}

nlohmann::json Bot::getSessionLastUsed(const std::string& id) {
    return {{"providerID", "cpp"}, {"modelID", "whatsapp-bot"}, {"agent", "customer-support"}};
}

nlohmann::json Bot::undo(const std::string& sessionId) {
    std::lock_guard lock(mtx_);
    auto it = sessions_.find(sessionId);
    if (it == sessions_.end() || it->second.messages.empty()) {
        return {{"ok", false}, {"reason", "nothing more to undo"}};
    }
    it->second.messages.pop_back();
    std::string lastText;
    if (!it->second.messages.empty()) {
        lastText = it->second.messages.back().second;
    }
    return {{"ok", true}, {"text", lastText}};
}

nlohmann::json Bot::redo(const std::string& sessionId) {
    return {{"ok", false}, {"reason", "redo not supported"}};
}

std::string Bot::processQuery(const std::string& text) {
    auto lower = text;
    std::transform(lower.begin(), lower.end(), lower.begin(), ::tolower);

    if (lower.find("hola") != std::string::npos || lower.find("buenos") != std::string::npos || lower.find("saludos") != std::string::npos) {
        return "¡Hola! Bienvenido al servicio de atención al cliente. ¿En qué puedo ayudarte hoy?";
    }
    if (lower.find("horario") != std::string::npos) {
        return "Nuestro horario de atención es de lunes a viernes de 9:00 a 18:00 hs. ¿Necesitas algo más?";
    }
    if (lower.find("precio") != std::string::npos || lower.find("costo") != std::string::npos || lower.find("cuanto") != std::string::npos) {
        return "Para información sobre precios y cotizaciones, por favor indícanos qué producto o servicio te interesa y te enviaremos los detalles.";
    }
    if (lower.find("contacto") != std::string::npos || lower.find("tel") != std::string::npos || lower.find("email") != std::string::npos) {
        return "Puedes contactarnos al +1234567890 o enviarnos un email a soporte@ejemplo.com. ¿Algo más en que pueda ayudarte?";
    }
    if (lower.find("gracias") != std::string::npos) {
        return "¡De nada! Si tienes más preguntas, no dudes en escribirnos. ¡Que tengas un excelente día!";
    }
    if (lower.find("adios") != std::string::npos || lower.find("chao") != std::string::npos || lower.find("bye") != std::string::npos) {
        return "¡Hasta luego! Gracias por contactarnos. Estaremos aquí si necesitas algo más.";
    }

    return "Gracias por tu mensaje. Hemos recibido tu consulta y la estamos procesando. "
           "Un representante se comunicará contigo a la brevedad. "
           "Mientras tanto, ¿hay algo más en lo que pueda ayudarte?";
}

BridgeReply Bot::prompt(const BridgePrompt& input) {
    auto start = std::chrono::steady_clock::now();

    std::lock_guard lock(mtx_);
    auto it = sessions_.find(input.sessionId);
    if (it == sessions_.end()) {
        sessions_[input.sessionId] = Session{input.sessionId, "Chat Session", {}};
        it = sessions_.find(input.sessionId);
    }
    activeSessionId_ = input.sessionId;

    it->second.messages.emplace_back("user", input.text);

    std::string response = processQuery(input.text);

    it->second.messages.emplace_back("assistant", response);

    auto end = std::chrono::steady_clock::now();
    auto ms = std::chrono::duration_cast<std::chrono::milliseconds>(end - start).count();

    return {response, ms, "cpp", "whatsapp-bot"};
}

bool Bot::stop(const std::string& sessionId) {
    return true;
}
