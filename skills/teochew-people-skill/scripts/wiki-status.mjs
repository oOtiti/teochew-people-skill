#!/usr/bin/env node
import path from "node:path";
import { fileURLToPath } from "node:url";
import { wikiStatus } from "./wiki-lib.mjs";

const skillRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

async function main() {
  const args = new Set(process.argv.slice(2));
  for (const arg of args) if (arg !== "--json") throw new Error(`Unknown option: ${arg}`);
  const status = await wikiStatus(skillRoot);
  if (args.has("--json")) process.stdout.write(`${JSON.stringify(status, null, 2)}\n`);
  else process.stdout.write(`Wiki status: ${status.sources} sources, ${status.pages} pages, ${status.categories} categories, ${status.stale} stale, ${status.orphans} orphaned\n`);
}

main().catch((error) => {
  process.stderr.write(`wiki-status: ${error.message}\n`);
  process.exitCode = 1;
});
