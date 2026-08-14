#!/usr/bin/env node
import path from "node:path";
import { fileURLToPath } from "node:url";
import { readFile } from "node:fs/promises";
import { buildIndexes } from "./wiki-lib.mjs";

const skillRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

async function main() {
  const args = new Set(process.argv.slice(2));
  for (const arg of args) if (!["--check", "--json"].includes(arg)) throw new Error(`Unknown option: ${arg}`);
  const check = args.has("--check");
  const result = await buildIndexes(skillRoot, { write: !check });
  if (check) {
    const [rawIndex, wikiIndex] = await Promise.all([
      readFile(path.join(skillRoot, "raw", "index.md"), "utf8").catch(() => ""),
      readFile(path.join(skillRoot, "wiki", "index.md"), "utf8").catch(() => ""),
    ]);
    if (rawIndex !== result.rawIndex || wikiIndex !== result.wikiIndex) {
      throw new Error("Generated indexes are out of date; run npm run wiki:index");
    }
  }
  const summary = { sources: result.sources.length, pages: result.pages.length, categories: result.categories.length, checked: check };
  process.stdout.write(args.has("--json") ? `${JSON.stringify(summary, null, 2)}\n` : `Wiki indexes ${check ? "are current" : "updated"}: ${summary.sources} sources, ${summary.pages} pages, ${summary.categories} categories\n`);
}

main().catch((error) => {
  process.stderr.write(`build-index: ${error.message}\n`);
  process.exitCode = 1;
});
