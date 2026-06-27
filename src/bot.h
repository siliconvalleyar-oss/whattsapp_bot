#pragma once
#include <string>
#include <vector>
#include <map>
#include <mutex>
#include <atomic>
#include <chrono>
#include "bridge_protocol.h"

class Bot {
public:
    Bot();

    std::vector<BridgeSession> listSessions();
    BridgeSession createSession(const std::string& title);
    void deleteSession(const std::string& id);
    std::optional<BridgeSession> getSession(const std::string& id);
    void renameSession(const std::string& id, const std::string& title);
    nlohmann::json getMessages(const std::string& id);
    nlohmann::json getSessionLastUsed(const std::string& id);
    BridgeReply prompt(const BridgePrompt& input);
    bool stop(const std::string& sessionId);
    nlohmann::json undo(const std::string& sessionId);
    nlohmann::json redo(const std::string& sessionId);

private:
    struct Session {
        std::string id;
        std::string title;
        std::vector<std::pair<std::string, std::string>> messages;
    };

    std::string generateId();
    std::string processQuery(const std::string& text);

    std::map<std::string, Session> sessions_;
    std::mutex mtx_;
    std::atomic<int> counter_{0};
    std::string activeSessionId_;
};
