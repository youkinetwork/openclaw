import type { OpenClawPluginApi } from "openclaw/plugin-sdk";
import { getSavedKey } from "./storage.js";

export const registerOmniHooks = (api: OpenClawPluginApi) => {
  api.on("message_received", async (event) => {
    const key = await getSavedKey(api);
    api.logger.info(`[omni-permission] 📥 [Key: ${key}] Message: ${event.content}`);
  });

  api.on("before_tool_call", async (event) => {
    const key = await getSavedKey(api);
    api.logger.info(`[omni-permission] 🛡️ [Key: ${key}] Tool Call: ${event.toolName}`);
  });

  // Add other hooks here following the same pattern...
};
