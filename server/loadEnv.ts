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
 * Backend env: single file `server/.env`.
 * On Render (and similar), variables come from the dashboard; the file is optional.
 */
const repoRoot = findRepoRoot();
const serverEnv = path.join(repoRoot, "server", ".env");

if (existsSync(serverEnv)) {
  config({ path: serverEnv });
}
