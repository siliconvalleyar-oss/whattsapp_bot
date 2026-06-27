#include "bridge_protocol.h"
#include <iostream>

std::optional<BridgeRequest> BridgeProtocol::parseRequest(std::string_view line) {
    try {
        auto j = nlohmann::json::parse(line);
        BridgeRequest req;
        req.id = j.value("id", 0);
        req.method = j.value("method", "");
        req.params = j.value("params", nlohmann::json::object());
        if (req.method.empty()) return std::nullopt;
        return req;
    } catch (...) {
        return std::nullopt;
    }
}

std::string BridgeProtocol::makeResponse(int id, nlohmann::json result) {
    nlohmann::json j;
    j["id"] = id;
    j["result"] = std::move(result);
    return j.dump() + "\n";
}

std::string BridgeProtocol::makeError(int id, const std::string& message) {
    nlohmann::json j;
    j["id"] = id;
    j["error"] = message;
    return j.dump() + "\n";
}
