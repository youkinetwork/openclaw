import * as fs from "node:fs/promises";
import * as path from "node:path";
import * as readline from "node:readline/promises";
import type { OpenClawPluginApi } from "openclaw/plugin-sdk";
import { emptyPluginConfigSchema } from "openclaw/plugin-sdk";

const omniPermissionPlugin = {
  id: "omni-permission",
  name: "Omni-Permission Monitor",
  configSchema: emptyPluginConfigSchema(),

  register(api: OpenClawPluginApi) {
    const keyPath = path.join(api.runtime.state.resolveStateDir(), "omni_key.txt");
    api.logger.info(`[omni-permission] 🛰️ Plugin Loaded. Storage: ${keyPath}`);

    // Helper to read the key for logging in hooks
    const getSavedKey = async () => {
      try {
        return await fs.readFile(keyPath, "utf-8");
      } catch {
        return "NO_KEY_SAVED";
      }
    };

    // --- CLI COMMAND ---
    api.registerCli(
      ({ program }) => {
        program
          .command("omni-permission")
          .command("set-key")
          .action(async () => {
            const rl = readline.createInterface({
              input: process.stdin,
              output: process.stdout,
            });
            const publicKey = await rl.question("Please enter your OpenClaw Public Key: ");
            rl.close();

            if (publicKey) {
              // Persist to disk so the Gateway process can see it
              await fs.mkdir(path.dirname(keyPath), { recursive: true });
              await fs.writeFile(keyPath, publicKey, "utf-8");

              api.logger.info(`[omni-permission] 🔑 Key saved to disk.`);
              console.log(`✅ Registered and Persisted: ${publicKey.substring(0, 10)}...`);
            }
          });
      },
      { commands: ["omni-permission"] },
    );

    // --- LIFECYCLE HOOKS ---
    // All hooks now fetch and print the saved key

    api.on("gateway_start", async () => {
      const key = await getSavedKey();
      api.logger.info(`[omni-permission] 🚀 [Key: ${key}] Gateway starting.`);
    });

    api.on("message_received", async (event) => {
      const key = await getSavedKey();
      api.logger.info(`[omni-permission] 📥 [Key: ${key}] Message: ${event.content}`);
    });

    api.on("before_tool_call", async (event) => {
      const key = await getSavedKey();
      api.logger.info(`[omni-permission] 🛡️ [Key: ${key}] Tool Call: ${event.toolName}`);
    });

    api.on("after_tool_call", async (event) => {
      const key = await getSavedKey();
      api.logger.info(`[omni-permission] ✅ [Key: ${key}] Tool Result: ${event.toolName}`);
    });

    api.on("message_sending", async () => {
      const key = await getSavedKey();
      api.logger.info(`[omni-permission] 📤 [Key: ${key}] Bot is replying.`);
    });

    api.on("agent_end", async () => {
      const key = await getSavedKey();
      api.logger.info(`[omni-permission] 🏁 [Key: ${key}] Session ended.`);
    });
  },
};

export default omniPermissionPlugin;
