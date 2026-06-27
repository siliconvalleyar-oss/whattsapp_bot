import { spawn } from "node:child_process";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createInterface } from "node:readline";

const __dirname = dirname(fileURLToPath(import.meta.url));

function startCpp() {
  const bin = resolve(__dirname, "build", "whatsapp-bot");
  const proc = spawn(bin, [], {
    stdio: ["pipe", "pipe", "pipe"],
    env: { ...process.env },
  });

  const rl = createInterface({ input: proc.stdout });
  const pending = new Map();
  let nextId = 1;

  rl.on("line", (line) => {
    let msg;
    try { msg = JSON.parse(line); } catch { return; }
    const { id, result, error } = msg;
    if (id !== undefined && pending.has(id)) {
      const { resolve, reject } = pending.get(id);
      pending.delete(id);
      if (error) reject(new Error(error));
      else resolve(result);
    }
  });

  proc.on("exit", (code) => {
    for (const [, { reject }] of pending) reject(new Error(`C++ process exited with code ${code}`));
    pending.clear();
  });

  proc.on("error", (err) => {
    for (const [, { reject }] of pending) reject(err);
    pending.clear();
  });

  function call(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = nextId++;
      pending.set(id, { resolve, reject });
      proc.stdin.write(JSON.stringify({ id, method, params }) + "\n");
    });
  }

  return { proc, call, rl };
}

const { proc, call, rl } = startCpp();

process.on("exit", () => { proc.kill(); rl.close(); });
process.on("SIGTERM", () => { proc.kill(); rl.close(); });
process.on("SIGINT", () => { proc.kill(); rl.close(); });

async function prompt(input) {
  const res = await call("prompt", {
    sessionId: input.sessionId,
    text: input.text,
    channel: input.channel,
    ...(input.media ? { media: input.media } : {}),
  });
  return {
    text: res.text,
    ms: res.ms,
    providerID: res.providerID,
    modelID: res.modelID,
  };
}

export default {
  listSessions:     ()          => call("listSessions"),
  createSession:    ({ title }) => call("createSession", { title }),
  deleteSession:    (id)        => call("deleteSession", { id }),
  getSession:       (id)        => call("getSession", { id }),
  renameSession:    (id, title) => call("renameSession", { id, title }),
  getMessages:      (id)        => call("getMessages", { id }),
  getSessionLastUsed: (id)      => call("getSessionLastUsed", { id }),
  undo:             (id)        => call("undo", { sessionId: id }),
  redo:             (id)        => call("redo", { sessionId: id }),
  prompt,
  stop:             (sessionId) => call("stop", { sessionId }),
  listModels:       ()          => call("listModels"),
  listAgents:       ()          => call("listAgents"),
  getModelVariants: (pid, mid)  => call("getModelVariants", { providerID: pid, modelID: mid }),
  getStatus:        ()          => call("getStatus"),
  diag:             ()          => call("diag"),
  close:            ()          => call("close").finally(() => { proc.kill(); rl.close(); }),
};
