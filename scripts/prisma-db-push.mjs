import "dotenv/config";
import { spawnSync } from "node:child_process";

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL is missing. Add it to the Railway app service variables.");
  process.exit(1);
}

const result = spawnSync(
  "npx",
  ["prisma", "db", "push", "--schema", "prisma/schema.prisma"],
  {
    stdio: "inherit",
    shell: process.platform === "win32",
    env: process.env,
  }
);

process.exit(result.status ?? 1);
