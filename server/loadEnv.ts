import { config } from "dotenv";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function findRepoRoot(): string {
  let dir = __dirname;
  for (let i = 0; i < 8; i++) {
    if (existsSync(path.join(dir, "package.json"))) {
      return dir;
    }
    const parent = path.dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  return process.cwd();
}

/**
 * Backend env only under `server/`: `.env.development` | `.env.production` | optional `.env`.
 * On Render, variables usually come from the dashboard (no files).
 */
const repoRoot = findRepoRoot();
const serverDir = path.join(repoRoot, "server");
const isProd = process.env.NODE_ENV === "production";
const modeFile = path.join(serverDir, isProd ? ".env.production" : ".env.development");
const fallback = path.join(serverDir, ".env");

if (existsSync(modeFile)) {
  config({ path: modeFile });
}
if (existsSync(fallback)) {
  config({ path: fallback, override: false });
}
