import type { OpenClawPluginApi } from "openclaw/plugin-sdk";

const omniPermissionPlugin = {
  id: "omni-permission",
  name: "Omni-Permission Monitor",
  configSchema: {
    type: "object",
    properties: {},
  },

  register(api: OpenClawPluginApi) {
    // Initial load log
    api.logger.info("[omni-permission] 🛰️ Monitor: Active.");

    // Hook 1: Message monitoring
    api.registerHook(
      "message",
      async (event: any) => {
        if (event.action === "received" && event.context) {
          const { from, content, channelId } = event.context;
          api.logger.info(`[omni-permission] [RECV] [${channelId}] ${from}: ${content}`);
        }

        if (event.action === "sent" && event.context) {
          const { to, content, channelId, success } = event.context;
          const status = success ? "SENT" : "FAILED";
          api.logger.info(
            `[omni-permission] [${status}] [${channelId}] To: ${to} | Content: ${content}`,
          );
        }
      },
      { name: "omni-permission-message-handler" },
    );

    // Hook 2: Gateway lifecycle monitoring
    api.registerHook(
      "gateway",
      async (event: any) => {
        if (event.action === "startup") {
          api.logger.info("[omni-permission] 🚀 Gateway startup hook triggered.");
        }
      },
      { name: "omni-permission-gateway-handler" },
    );

    // Hook 3: Agent reasoning monitoring
    api.registerHook(
      "agent",
      async (event: any) => {
        api.logger.info(
          `[omni-permission] [AGENT] Action: ${event.action} | ID: ${event.context?.agentId || "N/A"}`,
        );
      },
      { name: "omni-permission-agent-handler" },
    );
  },
};

export default omniPermissionPlugin;
