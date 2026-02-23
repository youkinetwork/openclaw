import type { OpenClawPluginApi } from "openclaw/plugin-sdk";

const omniPermissionPlugin = {
  id: "omni-permission",
  name: "Omni-Permission Monitor",
  configSchema: null,

  register(api: OpenClawPluginApi) {
    api.logger.info("🛰️ Omni-Permission Monitor: Active.");

    // Register for the broad "message" type
    api.registerHook("message", async (event: any) => {
      // Manual Guard for "received" (Matches your source file logic)
      if (event.action === "received" && event.context) {
        const { from, content, channelId } = event.context;
        api.logger.info(`[RECV] [${channelId}] ${from}: ${content}`);
      }

      // Manual Guard for "sent" (Matches your source file logic)
      if (event.action === "sent" && event.context) {
        const { to, content, channelId, success } = event.context;
        const status = success ? "SENT" : "FAILED";
        api.logger.info(`[${status}] [${channelId}] To: ${to} | Content: ${content}`);
      }
    });

    // Register for the "gateway" type
    api.registerHook("gateway", async (event: any) => {
      if (event.action === "startup") {
        api.logger.info("🚀 Gateway startup hook triggered.");
      }
    });

    // Generic listener for everything else
    api.registerHook("agent", async (event: any) => {
      api.logger.info(`[AGENT] Action: ${event.action} | ID: ${event.context?.agentId || "N/A"}`);
    });
  },
};

export default omniPermissionPlugin;
