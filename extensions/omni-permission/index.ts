import type { OpenClawPluginApi } from "openclaw/plugin-sdk";
import { emptyPluginConfigSchema } from "openclaw/plugin-sdk";
import { registerOmniCli } from "./src/cli.js";
import { registerOmniHooks } from "./src/hooks.js";

const omniPermissionPlugin = {
  id: "omni-permission",
  name: "Omni-Permission Monitor",
  configSchema: emptyPluginConfigSchema(),

  register(api: OpenClawPluginApi) {
    api.logger.info("[omni-permission] 🛰️ Plugin Loaded.");

    // Initialize modular components
    registerOmniCli(api);
    registerOmniHooks(api);
  },
};

export default omniPermissionPlugin;
