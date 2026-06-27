#include <iostream>
#include <string>
#include <thread>
#include <atomic>
#include "bridge_protocol.h"
#include "bot.h"

static std::atomic<bool> running{true};

int main() {
    std::ios::sync_with_stdio(false);
    std::cin.tie(nullptr);

    Bot bot;

    while (running) {
        std::string line;
        if (!std::getline(std::cin, line)) break;
        if (line.empty()) continue;

        auto req = BridgeProtocol::parseRequest(line);
        if (!req) {
            std::cerr << "{\"error\":\"invalid request\"}\n" << std::flush;
            continue;
        }

        try {
            const auto& method = req->method;
            const auto& params = req->params;
            auto id = req->id;

            if (method == "listSessions") {
                auto sessions = bot.listSessions();
                nlohmann::json arr = nlohmann::json::array();
                for (const auto& s : sessions) {
                    arr.push_back({{"id", s.id}, {"title", s.title}});
                }
                std::cout << BridgeProtocol::makeResponse(id, arr) << std::flush;
            }
            else if (method == "createSession") {
                auto title = params.value("title", "New Session");
                auto s = bot.createSession(title);
                nlohmann::json j = {{"id", s.id}, {"title", s.title}};
                std::cout << BridgeProtocol::makeResponse(id, j) << std::flush;
            }
            else if (method == "deleteSession") {
                auto sid = params.value("id", "");
                bot.deleteSession(sid);
                std::cout << BridgeProtocol::makeResponse(id, nullptr) << std::flush;
            }
            else if (method == "getSession") {
                auto sid = params.value("id", "");
                auto s = bot.getSession(sid);
                if (s) {
                    nlohmann::json j = {{"id", s->id}, {"title", s->title}};
                    std::cout << BridgeProtocol::makeResponse(id, j) << std::flush;
                } else {
                    std::cout << BridgeProtocol::makeResponse(id, nullptr) << std::flush;
                }
            }
            else if (method == "renameSession") {
                auto sid = params.value("id", "");
                auto title = params.value("title", "");
                bot.renameSession(sid, title);
                nlohmann::json j = {{"id", sid}, {"title", title}};
                std::cout << BridgeProtocol::makeResponse(id, j) << std::flush;
            }
            else if (method == "getMessages") {
                auto sid = params.value("id", "");
                auto msgs = bot.getMessages(sid);
                std::cout << BridgeProtocol::makeResponse(id, msgs) << std::flush;
            }
            else if (method == "getSessionLastUsed") {
                auto sid = params.value("id", "");
                auto info = bot.getSessionLastUsed(sid);
                std::cout << BridgeProtocol::makeResponse(id, info) << std::flush;
            }
            else if (method == "undo") {
                auto sid = params.value("sessionId", "");
                auto res = bot.undo(sid);
                std::cout << BridgeProtocol::makeResponse(id, res) << std::flush;
            }
            else if (method == "redo") {
                auto sid = params.value("sessionId", "");
                auto res = bot.redo(sid);
                std::cout << BridgeProtocol::makeResponse(id, res) << std::flush;
            }
            else if (method == "getModelVariants") {
                std::cout << BridgeProtocol::makeResponse(id, nlohmann::json::array()) << std::flush;
            }
            else if (method == "prompt") {
                BridgePrompt prompt;
                prompt.sessionId = params.value("sessionId", "");
                prompt.text = params.value("text", "");
                prompt.channel = params.value("channel", "whatsapp");
                auto reply = bot.prompt(prompt);
                nlohmann::json j = {
                    {"text", reply.text},
                    {"ms", reply.ms},
                    {"providerID", reply.providerID},
                    {"modelID", reply.modelID}
                };
                std::cout << BridgeProtocol::makeResponse(id, j) << std::flush;
            }
            else if (method == "stop") {
                auto sid = params.value("sessionId", "");
                bool ok = bot.stop(sid);
                std::cout << BridgeProtocol::makeResponse(id, ok) << std::flush;
            }
            else if (method == "listModels") {
                nlohmann::json arr = nlohmann::json::array();
                arr.push_back({{"providerID", "cpp"}, {"modelID", "whatsapp-bot"}, {"name", "WhatsApp Bot C++"}, {"free", true}});
                std::cout << BridgeProtocol::makeResponse(id, arr) << std::flush;
            }
            else if (method == "listAgents") {
                nlohmann::json arr = nlohmann::json::array();
                arr.push_back({{"name", "customer-support"}, {"kind", "auto"}});
                std::cout << BridgeProtocol::makeResponse(id, arr) << std::flush;
            }
            else if (method == "getStatus") {
                nlohmann::json j = {{"agent", "customer-support"}, {"model", "cpp/whatsapp-bot"}};
                std::cout << BridgeProtocol::makeResponse(id, j) << std::flush;
            }
            else if (method == "diag") {
                nlohmann::json j = {{"text", "WhatsApp Bot C++ v1.0.0 running"}};
                std::cout << BridgeProtocol::makeResponse(id, j) << std::flush;
            }
            else if (method == "close") {
                running = false;
                std::cout << BridgeProtocol::makeResponse(id, true) << std::flush;
            }
            else {
                std::cout << BridgeProtocol::makeError(id, "unknown method: " + method) << std::flush;
            }
        } catch (const std::exception& e) {
            std::cerr << BridgeProtocol::makeError(req->id, e.what()) << std::flush;
        }
    }

    return 0;
}
