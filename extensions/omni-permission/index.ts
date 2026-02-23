import * as readline from "node:readline/promises";
import type { OpenClawPluginApi } from "openclaw/plugin-sdk";
import { emptyPluginConfigSchema } from "openclaw/plugin-sdk";

const omniPermissionPlugin = {
  id: "omni-permission",
  name: "Omni-Permission Monitor",
  configSchema: emptyPluginConfigSchema(),

  register(api: OpenClawPluginApi) {
    api.logger.info("[omni-permission] 🛰️ Plugin Loaded.");

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
              api.logger.info(
                `[omni-permission] 🔑 Key received: ${publicKey.substring(0, 10)}...`,
              );
              console.log(`✅ Registered key.`);
            }
          });
      },
      { commands: ["omni-permission"] },
    );

    // --- LIFECYCLE HOOKS ---
    // Using names from your provided PluginHookName list

    // 1. Gateway Startup
    api.on("gateway_start", async (event) => {
      api.logger.info(`[omni-permission] 🚀 Gateway started on port ${event.port}`);
    });

    // 2. Incoming Message (When you type)
    api.on("message_received", async (event, ctx) => {
      api.logger.info(
        `[omni-permission] 📥 Message from ${event.from} on ${ctx.channelId}: ${event.content}`,
      );
    });

    // 3. Before AI Tool Execution (The "Gatekeeper" for Slack/Shell)
    api.on("before_tool_call", async (event, ctx) => {
      api.logger.info(`[omni-permission] 🛡️ Agent requesting tool: ${event.toolName}`);

      // This is where you will implement your Human-in-the-Loop check later
      if (event.toolName.includes("slack")) {
        api.logger.warn(`[omni-permission] 🛑 Intercepting Slack call...`);
      }
    });

    // 4. After AI Tool Execution
    api.on("after_tool_call", async (event) => {
      api.logger.info(
        `[omni-permission] ✅ Tool ${event.toolName} finished in ${event.durationMs}ms`,
      );
    });

    // 5. Outgoing Message (When the bot replies)
    api.on("message_sending", async (event) => {
      api.logger.info(`[omni-permission] 📤 Sending reply to ${event.to}`);
    });

    // 6. Agent Session End
    api.on("agent_end", async (event) => {
      api.logger.info(`[omni-permission] 🏁 Agent run complete. Success: ${event.success}`);
    });
  },
};

export default omniPermissionPlugin;
