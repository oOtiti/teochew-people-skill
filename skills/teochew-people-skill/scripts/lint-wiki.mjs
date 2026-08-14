#!/usr/bin/env node
import path from "node:path";
import { fileURLToPath } from "node:url";
import { lintWiki } from "./wiki-lib.mjs";

const skillRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

async function main() {
  const args = new Set(process.argv.slice(2));
  for (const arg of args) if (arg !== "--json") throw new Error(`Unknown option: ${arg}`);
  const result = await lintWiki(skillRoot);
  if (args.has("--json")) process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
  else if (result.ok) process.stdout.write("Wiki lint passed\n");
  else for (const entry of result.issues) process.stderr.write(`${entry.code}: ${entry.file}: ${entry.message}\n`);
  if (!result.ok) process.exitCode = 1;
}

main().catch((error) => {
  process.stderr.write(`lint-wiki: ${error.message}\n`);
  process.exitCode = 1;
});
