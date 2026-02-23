import * as fs from "node:fs/promises";
import * as path from "node:path";
import * as readline from "node:readline/promises";
import type { OpenClawPluginApi } from "openclaw/plugin-sdk";
import { getKeyPath } from "./storage.js";

export const registerOmniCli = (api: OpenClawPluginApi) => {
  api.registerCli(
    ({ program }) => {
      program
        .command("omni-permission")
        .command("set-key")
        .action(async () => {
          const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
          const publicKey = await rl.question("Please enter your OpenClaw Public Key: ");
          rl.close();

          if (publicKey) {
            const keyPath = getKeyPath(api);
            await fs.mkdir(path.dirname(keyPath), { recursive: true });
            await fs.writeFile(keyPath, publicKey, "utf-8");
            console.log(`✅ Registered: ${publicKey.substring(0, 10)}...`);
          }
        });
    },
    { commands: ["omni-permission"] },
  );
};
