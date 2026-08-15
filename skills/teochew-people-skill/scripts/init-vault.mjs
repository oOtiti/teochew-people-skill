#!/usr/bin/env node
import path from "node:path";
import { fileURLToPath } from "node:url";
import { initVault } from "./wiki-lib.mjs";

const skillRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

async function main() {
  const args = process.argv.slice(2);
  const flags = new Set();
  const targets = [];
  let projectRoot;
  for (let index = 0; index < args.length; index += 1) {
    const argument = args[index];
    if (["--force", "--json"].includes(argument)) {
      flags.add(argument);
      continue;
    }
    if (argument === "--project") {
      const value = args[index + 1];
      if (!value || value.startsWith("--")) throw new Error("--project requires a directory path");
      projectRoot = value;
      index += 1;
      continue;
    }
    if (argument.startsWith("--")) throw new Error(`Unknown option: ${argument}`);
    targets.push(argument);
  }
  if (targets.length > 1 || (targets.length === 1 && projectRoot)) {
    throw new Error("Usage: init-vault.mjs [target] [--force] [--json] | --project <project-dir> [--force] [--json]");
  }
  const target = projectRoot
    ? path.join(path.resolve(projectRoot), ".teochew-people")
    : path.resolve(targets[0] || path.join(process.cwd(), ".teochew-people"));
  const result = await initVault({
    target,
    templateRoot: path.join(skillRoot, "assets", "vault-template"),
    force: flags.has("--force"),
    projectOverlay: Boolean(projectRoot),
  });
  if (flags.has("--json")) process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
  else process.stdout.write(`Local vault ready at ${result.target}: ${result.created} created, ${result.skipped} preserved\n`);
}

main().catch((error) => {
  process.stderr.write(`init-vault: ${error.message}\n`);
  process.exitCode = 1;
});
