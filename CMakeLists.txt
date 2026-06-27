cmake_minimum_required(VERSION 3.20)
project(whatsapp-bot VERSION 1.0.0 LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

find_package(nlohmann_json QUIET)
if(NOT nlohmann_json_FOUND)
  include(FetchContent)
  FetchContent_Declare(
    nlohmann_json
    URL https://github.com/nlohmann/json/releases/download/v3.11.3/json.tar.xz
  )
  FetchContent_MakeAvailable(nlohmann_json)
endif()

add_executable(whatsapp-bot
  src/main.cpp
  src/bridge_protocol.cpp
  src/bot.cpp
)

target_link_libraries(whatsapp-bot PRIVATE nlohmann_json::nlohmann_json)
