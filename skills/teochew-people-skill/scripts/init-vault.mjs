#!/usr/bin/env node
import path from "node:path";
import { fileURLToPath } from "node:url";
import { initVault } from "./wiki-lib.mjs";

const skillRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

async function main() {
  const args = process.argv.slice(2);
  const flags = new Set(args.filter((arg) => arg.startsWith("--")));
  for (const flag of flags) if (!["--force", "--json"].includes(flag)) throw new Error(`Unknown option: ${flag}`);
  const targets = args.filter((arg) => !arg.startsWith("--"));
  if (targets.length > 1) throw new Error("Usage: init-vault.mjs [target] [--force] [--json]");
  const target = path.resolve(targets[0] || path.join(process.cwd(), ".teochew-people"));
  const result = await initVault({
    target,
    templateRoot: path.join(skillRoot, "assets", "vault-template"),
    force: flags.has("--force"),
  });
  if (flags.has("--json")) process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
  else process.stdout.write(`Local vault ready at ${result.target}: ${result.created} created, ${result.skipped} preserved\n`);
}

main().catch((error) => {
  process.stderr.write(`init-vault: ${error.message}\n`);
  process.exitCode = 1;
});
