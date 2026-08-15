import { access, readFile, readdir, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const REQUIRED_FIELDS = [
  "id",
  "path",
  "media_type",
  "rights_status",
  "creator",
  "creation_method",
  "source_ids",
  "alt",
  "disclaimer",
  "purpose",
  "reviewed",
];

function issue(code, message, item = "manifest") {
  return { code, item, message };
}

async function walkMarkdown(directory) {
  const files = [];
  let entries;
  try {
    entries = await readdir(directory, { withFileTypes: true });
  } catch (error) {
    if (error.code === "ENOENT") return files;
    throw error;
  }
  for (const entry of entries) {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await walkMarkdown(target)));
    if (entry.isFile() && entry.name.endsWith(".md")) files.push(target);
  }
  return files;
}

async function admittedSourceIds(root) {
  const rawRoot = path.join(root, "skills", "teochew-people-skill", "raw");
  const ids = new Set();
  for (const file of await walkMarkdown(rawRoot)) {
    if (["index.md", "source-review.md"].includes(path.basename(file))) continue;
    const content = await readFile(file, "utf8");
    const match = content.match(/^id:\s*([A-Za-z0-9-]+)\s*$/m);
    if (match) ids.add(match[1]);
  }
  return ids;
}

function isWithin(parent, target) {
  const relative = path.relative(parent, target);
  return relative !== "" && !relative.startsWith(`..${path.sep}`) && relative !== ".." && !path.isAbsolute(relative);
}

export async function validateMediaManifest(
  root,
  manifestRelative = path.join("assets", "media-manifest.json"),
) {
  const issues = [];
  const manifestPath = path.resolve(root, manifestRelative);
  let manifest;

  try {
    manifest = JSON.parse(await readFile(manifestPath, "utf8"));
  } catch (error) {
    const code = error.code === "ENOENT" ? "missing-manifest" : "invalid-manifest-json";
    return { issues: [issue(code, error.message)], itemCount: 0 };
  }

  if (manifest.version !== 1) {
    issues.push(issue("invalid-manifest-version", "Manifest version must be 1."));
  }
  if (!Array.isArray(manifest.items) || manifest.items.length === 0) {
    issues.push(issue("missing-manifest-items", "Manifest must contain at least one item."));
    return { issues, itemCount: 0 };
  }

  const sourceIds = await admittedSourceIds(root);
  const assetsRoot = path.resolve(root, "assets");
  const ids = new Set();
  const paths = new Set();

  for (const entry of manifest.items) {
    const label = entry?.id || entry?.path || "unnamed-item";
    for (const field of REQUIRED_FIELDS) {
      const value = entry?.[field];
      if (value === undefined || value === null || value === "" || (Array.isArray(value) && value.length === 0)) {
        issues.push(issue(`missing-${field.replaceAll("_", "-")}`, `Missing required field '${field}'.`, label));
      }
    }

    if (ids.has(entry.id)) issues.push(issue("duplicate-asset-id", `Duplicate asset id '${entry.id}'.`, label));
    if (entry.id) ids.add(entry.id);
    if (paths.has(entry.path)) issues.push(issue("duplicate-asset-path", `Duplicate asset path '${entry.path}'.`, label));
    if (entry.path) paths.add(entry.path);

    if (entry.media_type !== "image") {
      issues.push(issue("invalid-media-type", "Manifest assets must use media_type 'image'.", label));
    }
    if (entry.rights_status !== "editorial_original") {
      issues.push(issue("invalid-rights-status", "Local showcase assets must be editorial_original.", label));
    }
    if (typeof entry.alt !== "string" || entry.alt.trim().length < 12) {
      issues.push(issue("missing-alt", "Alt text must be at least 12 characters.", label));
    }
    if (typeof entry.disclaimer !== "string" || entry.disclaimer.trim().length < 12) {
      issues.push(issue("missing-disclaimer", "Disclaimer must be at least 12 characters.", label));
    }
    if (!Array.isArray(entry.source_ids) || entry.source_ids.length === 0) {
      issues.push(issue("missing-source-ids", "At least one admitted source id is required.", label));
    } else {
      for (const sourceId of entry.source_ids) {
        if (!sourceIds.has(sourceId)) {
          issues.push(issue("missing-source", `Unknown source id '${sourceId}'.`, label));
        }
      }
    }

    const declared = typeof entry.path === "string" ? entry.path.replaceAll("\\", "/") : "";
    const target = declared ? path.resolve(root, declared) : "";
    const pathIsSafe =
      declared.startsWith("assets/") &&
      !declared.startsWith("assets/../") &&
      !path.isAbsolute(declared) &&
      target &&
      isWithin(assetsRoot, target);

    if (!pathIsSafe) {
      issues.push(issue("unsafe-asset-path", `Asset path must stay within assets/: '${entry.path}'.`, label));
      continue;
    }

    try {
      await access(target);
      if (!(await stat(target)).isFile()) throw Object.assign(new Error("not a file"), { code: "ENOENT" });
    } catch {
      issues.push(issue("missing-asset", `Asset file does not exist: '${entry.path}'.`, label));
      continue;
    }

    if (path.extname(target).toLowerCase() === ".svg") {
      const svg = await readFile(target, "utf8");
      if (/<image\b[^>]*(?:href|xlink:href)\s*=\s*["']https?:\/\//i.test(svg)) {
        issues.push(issue("remote-svg-image", "SVG assets may not fetch remote images.", label));
      }
    }
  }

  return { issues, itemCount: manifest.items.length };
}

async function main() {
  const scriptPath = fileURLToPath(import.meta.url);
  const root = path.resolve(path.dirname(scriptPath), "..");
  const result = await validateMediaManifest(root);
  if (result.issues.length) {
    for (const entry of result.issues) {
      console.error(`[${entry.code}] ${entry.item}: ${entry.message}`);
    }
    process.exitCode = 1;
    return;
  }
  console.log(`Media manifest valid: ${result.itemCount} editorial originals`);
}

const invokedPath = process.argv[1] ? pathToFileURL(path.resolve(process.argv[1])).href : "";
if (invokedPath === import.meta.url) await main();
