import * as fs from "node:fs/promises";
import * as path from "node:path";
import type { OpenClawPluginApi } from "openclaw/plugin-sdk";

export const getKeyPath = (api: OpenClawPluginApi) =>
  path.join(api.runtime.state.resolveStateDir(), "omni_key.txt");

export const getSavedKey = async (api: OpenClawPluginApi) => {
  try {
    return await fs.readFile(getKeyPath(api), "utf-8");
  } catch {
    return "NO_KEY_SAVED";
  }
};
