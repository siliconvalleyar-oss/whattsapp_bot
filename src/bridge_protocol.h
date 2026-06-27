#pragma once
#include <string>
#include <string_view>
#include <nlohmann/json.hpp>

struct BridgeRequest {
    int id = 0;
    std::string method;
    nlohmann::json params;
};

struct BridgeSession {
    std::string id;
    std::string title;
};

struct BridgePrompt {
    std::string sessionId;
    std::string text;
    std::string channel;
};

struct BridgeReply {
    std::string text;
    long ms = 0;
    std::string providerID{"cpp"};
    std::string modelID{"whatsapp-bot"};
};

class BridgeProtocol {
public:
    static std::optional<BridgeRequest> parseRequest(std::string_view line);
    static std::string makeResponse(int id, nlohmann::json result);
    static std::string makeError(int id, const std::string& message);
};
