import path from "node:path";
import { constants } from "node:fs";
import {
  copyFile,
  lstat,
  mkdir,
  readFile,
  readdir,
  realpath,
  writeFile,
} from "node:fs/promises";

const GENERATED_MARKER = "<!-- GENERATED: teochew-wiki; DO NOT EDIT -->";
const PROJECT_OVERLAY_IGNORE = `# Teochew People project overlays are private by default.
# To intentionally include selected files in version control, replace the wildcard
# with explicit allow rules or use \`git add -f <path>\` after reviewing the content.
*
!.gitignore
`;
const SOURCE_TIERS = new Set(["A", "B", "C"]);
const MEDIA_TYPES = new Set(["video", "audio", "image"]);
const RIGHTS_STATUSES = new Set(["official_or_licensed", "link_only", "editorial_original"]);
const TRANSCRIPT_STATUSES = new Set(["verified_excerpt", "partial", "unavailable"]);
const MEDIA_DURATION_PATTERN = /^\d{2}:\d{2}:\d{2}$/;
const TIMECODE_SCOPE_PATTERN = /^\d{2}:\d{2}:\d{2}-\d{2}:\d{2}:\d{2}$/;
const MEDIA_METADATA_FIELDS = ["media_type", "rights_status", "media_duration", "transcript_status", "timecode_scope"];
const IMAGE_ONLY_INVALID_FIELDS = ["media_duration", "transcript_status", "timecode_scope"];
const SOURCE_STATUSES = new Set(["unavailable"]);
const EVIDENCE_STATES = new Set(["verified", "synthesis", "varies", "unknown"]);
const FRESHNESS_VALUES = new Set(["enduring", "current", "event"]);
const CORE_CLAIM_ROLES = new Set(["definition", "history", "geographic_scope"]);

function compareText(left, right) {
  return left < right ? -1 : left > right ? 1 : 0;
}

function toPosix(value) {
  return value.split(path.sep).join("/");
}

function relativePath(root, file) {
  return toPosix(path.relative(root, file));
}

function parseValue(raw, lineNumber) {
  const value = raw.trim();
  if (value === "") return "";
  if (value === "true") return true;
  if (value === "false") return false;
  if (/^-?(?:0|[1-9]\d*)(?:\.\d+)?$/.test(value)) return Number(value);

  if (value.startsWith("[")) {
    let parsed;
    try {
      parsed = JSON.parse(value);
    } catch {
      throw new Error(`Invalid JSON-style array on frontmatter line ${lineNumber}`);
    }
    if (!Array.isArray(parsed) || parsed.some((item) => item !== null && typeof item === "object")) {
      throw new Error(`Only scalar JSON-style arrays are supported on frontmatter line ${lineNumber}`);
    }
    return parsed;
  }

  if (value.startsWith("{") || value.startsWith("-") && !/^-\d/.test(value)) {
    throw new Error(`Unsupported nested YAML on frontmatter line ${lineNumber}`);
  }

  if (value.startsWith('"')) {
    try {
      const parsed = JSON.parse(value);
      if (typeof parsed !== "string") throw new Error();
      return parsed;
    } catch {
      throw new Error(`Invalid quoted string on frontmatter line ${lineNumber}`);
    }
  }

  if (value.startsWith("'") && value.endsWith("'") && value.length >= 2) {
    return value.slice(1, -1).replaceAll("''", "'");
  }

  return value;
}

export function parseFrontmatter(text) {
  if (typeof text !== "string") throw new TypeError("Frontmatter input must be a string");
  const normalized = text.replace(/^\uFEFF/, "").replaceAll("\r\n", "\n");
  if (!normalized.startsWith("---\n")) return { data: {}, body: normalized };

  const end = normalized.indexOf("\n---\n", 4);
  if (end === -1) throw new Error("Frontmatter is missing its closing --- delimiter");
  const block = normalized.slice(4, end);
  const data = {};

  for (const [index, line] of block.split("\n").entries()) {
    const lineNumber = index + 2;
    if (line.trim() === "" || line.trimStart().startsWith("#")) continue;
    if (/^\s/.test(line) || /^-\s/.test(line)) {
      throw new Error(`Unsupported nested YAML on frontmatter line ${lineNumber}`);
    }
    const match = /^([A-Za-z][A-Za-z0-9_-]*):(?:\s?(.*))$/.exec(line);
    if (!match) throw new Error(`Unsupported frontmatter syntax on line ${lineNumber}`);
    const [, key, rawValue] = match;
    if (Object.hasOwn(data, key)) throw new Error(`Duplicate frontmatter key '${key}' on line ${lineNumber}`);
    data[key] = parseValue(rawValue, lineNumber);
  }

  return { data, body: normalized.slice(end + 5) };
}

export async function collectMarkdown(root) {
  const absoluteRoot = path.resolve(root);
  const files = [];

  const rootStats = await lstatIfPresent(absoluteRoot);
  if (!rootStats) return files;
  await assertNoLinkedComponents(absoluteRoot, "Markdown corpus");
  if (!rootStats.isDirectory() || rootStats.isSymbolicLink()) {
    throw new Error(`Markdown corpus root must be a real directory: ${absoluteRoot}`);
  }

  async function assertDirectoryUnchanged(directory, expected) {
    await assertNoLinkedComponents(directory, "Markdown corpus");
    const current = await lstat(directory);
    if (!current.isDirectory() || current.isSymbolicLink() || !sameIdentity(expected, current)) {
      throw new Error(`Markdown corpus directory changed during traversal: ${directory}`);
    }
  }

  async function visit(directory, expectedDirectory) {
    await assertDirectoryUnchanged(directory, expectedDirectory);
    const entries = await readdir(directory, { withFileTypes: true });
    await assertDirectoryUnchanged(directory, expectedDirectory);
    entries.sort((a, b) => compareText(a.name, b.name));
    for (const entry of entries) {
      const candidate = path.join(directory, entry.name);
      await assertNoLinkedComponents(candidate, "Markdown corpus");
      const stats = await lstat(candidate);
      if (stats.isSymbolicLink()) {
        throw new Error(`Markdown corpus contains a symbolic link, junction, or reparse point: ${candidate}`);
      }
      if (stats.isDirectory()) await visit(candidate, stats);
      else if (stats.isFile()) {
        if (path.extname(entry.name).toLowerCase() === ".md") files.push(candidate);
      } else {
        throw new Error(`Markdown corpus contains an unsupported filesystem entry: ${candidate}`);
      }
    }
    await assertDirectoryUnchanged(directory, expectedDirectory);
  }

  await visit(absoluteRoot, rootStats);
  return files;
}

async function readRecord(skillRoot, file) {
  let parsed;
  try {
    parsed = parseFrontmatter(await readFile(file, "utf8"));
  } catch (error) {
    error.message = `${relativePath(skillRoot, file)}: ${error.message}`;
    throw error;
  }
  return {
    ...parsed.data,
    file,
    relative: relativePath(skillRoot, file),
    pageType: parsed.data.page_type,
  };
}

async function corpusRecords(skillRoot) {
  const rawRoot = path.join(skillRoot, "raw");
  const wikiRoot = path.join(skillRoot, "wiki");
  const rawFiles = (await collectMarkdown(rawRoot)).filter((file) => {
    const relative = relativePath(rawRoot, file);
    return relative !== "index.md" && relative !== "source-review.md";
  });
  const wikiFiles = (await collectMarkdown(wikiRoot)).filter(
    (file) => relativePath(wikiRoot, file) !== "index.md",
  );
  const raw = await Promise.all(rawFiles.map((file) => readRecord(skillRoot, file)));
  const wiki = await Promise.all(wikiFiles.map((file) => readRecord(skillRoot, file)));
  return { raw, wiki };
}

function escapeTable(value) {
  return String(value ?? "").replaceAll("|", "\\|").replaceAll("\n", " ");
}

function renderRawIndex(skillRoot, sources) {
  const lines = [
    GENERATED_MARKER,
    "",
    "# 原始资料索引",
    "",
    "本页由 `scripts/build-index.mjs` 从已收录的 raw 来源生成。来源取舍记录见 [source-review.md](./source-review.md)。",
    "",
  ];
  if (sources.length === 0) {
    lines.push("_当前没有已收录的公开来源。_", "");
    return lines.join("\n");
  }
  lines.push("| 来源 | 层级 | 状态 | 发布者 | 文件 |", "| --- | --- | --- | --- | --- |");
  for (const source of sources) {
    const link = `./${relativePath(path.join(skillRoot, "raw"), source.file)}`;
    const sourceStatus = source.source_status === "unavailable"
      ? "unavailable（不可回放）"
      : source.source_status || "—";
    lines.push(`| ${escapeTable(source.title)} | ${escapeTable(source.source_tier)} | ${escapeTable(sourceStatus)} | ${escapeTable(source.publisher)} | [${escapeTable(source.id)}](${link}) |`);
  }
  lines.push("");
  return lines.join("\n");
}

function renderWikiIndex(skillRoot, categories, pages) {
  const lines = [
    GENERATED_MARKER,
    "",
    "# 潮汕公共知识索引",
    "",
    "从本页进入主题；按需读取，避免一次加载整个知识库。",
    "",
  ];
  const byCategory = new Map();
  for (const page of pages) {
    if (!byCategory.has(page.category)) byCategory.set(page.category, []);
    byCategory.get(page.category).push(page);
  }
  const categoryNames = new Set([...categories.map(({ category }) => category), ...byCategory.keys()]);
  for (const category of [...categoryNames].sort(compareText)) {
    const categoryPage = categories.find((entry) => entry.category === category);
    const heading = categoryPage?.title || category;
    const categoryLink = categoryPage
      ? `./${relativePath(path.join(skillRoot, "wiki"), categoryPage.file)}`
      : null;
    lines.push(`## ${categoryLink ? `[${heading}](${categoryLink})` : heading}`, "");
    const categoryPages = byCategory.get(category) || [];
    if (categoryPages.length === 0) lines.push("_此分类尚无公开主题页。_", "");
    else {
      for (const page of categoryPages) {
        const link = `./${relativePath(path.join(skillRoot, "wiki"), page.file)}`;
        lines.push(`- [${page.title}](${link}) — ${page.summary || page.id}`);
      }
      lines.push("");
    }
  }
  return lines.join("\n");
}

export async function buildIndexes(skillRoot, options = {}) {
  const root = path.resolve(skillRoot);
  const { raw, wiki } = await corpusRecords(root);
  const sources = raw
    .filter(({ pageType }) => pageType === "source")
    .sort((a, b) => compareText(a.title || "", b.title || "") || compareText(a.relative, b.relative));
  const categories = wiki
    .filter(({ pageType }) => pageType === "category-index")
    .sort((a, b) => compareText(a.category || "", b.category || "") || compareText(a.title || "", b.title || ""));
  const pages = wiki
    .filter(({ pageType }) => pageType !== "category-index")
    .filter(({ pageType }) => pageType === "topic")
    .sort((a, b) => compareText(a.category || "", b.category || "") || compareText(a.title || "", b.title || "") || compareText(a.relative, b.relative));
  const rawIndex = renderRawIndex(root, sources);
  const wikiIndex = renderWikiIndex(root, categories, pages);

  if (options.write !== false) {
    await mkdir(path.join(root, "raw"), { recursive: true });
    await mkdir(path.join(root, "wiki"), { recursive: true });
    await writeFile(path.join(root, "raw", "index.md"), rawIndex, "utf8");
    await writeFile(path.join(root, "wiki", "index.md"), wikiIndex, "utf8");
  }

  return { rawIndex, wikiIndex, sources, pages, categories };
}

function isWithin(root, candidate) {
  const relative = path.relative(root, candidate);
  return relative === "" || (!relative.startsWith(`..${path.sep}`) && relative !== ".." && !path.isAbsolute(relative));
}

function sameIdentity(left, right) {
  return left.dev === right.dev && left.ino === right.ino && left.birthtimeMs === right.birthtimeMs;
}

async function lstatIfPresent(candidate) {
  try {
    return await lstat(candidate);
  } catch (error) {
    if (error.code === "ENOENT") return null;
    throw error;
  }
}

async function assertNoLinkedComponents(candidate, label) {
  const absolute = path.resolve(candidate);
  const parsed = path.parse(absolute);
  const parts = absolute.slice(parsed.root.length).split(path.sep).filter(Boolean);
  let current = parsed.root;
  for (const part of parts) {
    current = path.join(current, part);
    const stats = await lstatIfPresent(current);
    if (!stats) break;
    if (stats.isSymbolicLink()) {
      throw new Error(`${label} contains a symbolic link, junction, or reparse point: ${current}`);
    }
  }
}

function issue(code, file, message) {
  return { code, file, message };
}

function requiredFields(record, fields) {
  return fields.filter((field) => record[field] === undefined || record[field] === "");
}

function parseClockToSeconds(value) {
  if (!MEDIA_DURATION_PATTERN.test(value)) return null;
  const [hoursText, minutesText, secondsText] = value.split(":");
  const hours = Number(hoursText);
  const minutes = Number(minutesText);
  const seconds = Number(secondsText);
  if (minutes >= 60 || seconds >= 60) return null;
  return (hours * 3600) + (minutes * 60) + seconds;
}

function hasMediaValue(record, field) {
  return record[field] !== undefined && record[field] !== "";
}

function ageInDays(reviewed, now) {
  const parsed = Date.parse(`${reviewed}T00:00:00Z`);
  return Number.isFinite(parsed) ? Math.floor((now.getTime() - parsed) / 86_400_000) : Number.POSITIVE_INFINITY;
}

export async function lintWiki(skillRoot, options = {}) {
  const root = path.resolve(skillRoot);
  const now = options.now instanceof Date ? options.now : new Date();
  const issues = [];
  let records;
  try {
    const corpus = await corpusRecords(root);
    records = [...corpus.raw, ...corpus.wiki];
  } catch (error) {
    return { ok: false, issues: [issue("invalid-frontmatter", "", error.message)] };
  }

  const ids = new Map();
  for (const record of records) {
    if (!record.id) continue;
    if (ids.has(record.id)) {
      issues.push(issue("duplicate-id", record.relative, `ID '${record.id}' is also used by ${ids.get(record.id)}`));
    } else ids.set(record.id, record.relative);
  }

  const sources = records.filter(({ pageType }) => pageType === "source");
  const sourceById = new Map();
  for (const source of sources) if (!sourceById.has(source.id)) sourceById.set(source.id, source);

  for (const record of records) {
    if (record.pageType === "category-index") {
      const missing = requiredFields(record, ["id", "title", "page_type", "category"]);
      if (missing.length) issues.push(issue("missing-metadata", record.relative, `Missing: ${missing.join(", ")}`));
      continue;
    }

    if (record.pageType === "source") {
      const missing = requiredFields(record, ["id", "title", "page_type", "source_tier", "source_url", "publisher", "accessed"]);
      if (missing.length) issues.push(issue("missing-metadata", record.relative, `Missing: ${missing.join(", ")}`));
      if (!SOURCE_TIERS.has(record.source_tier)) {
        issues.push(issue("invalid-source-tier", record.relative, `Source tier must be A, B, or C; received '${record.source_tier}'`));
      }
      if (record.source_status && !SOURCE_STATUSES.has(record.source_status)) {
        issues.push(issue("invalid-source-status", record.relative, `Source status must be unavailable when present; received '${record.source_status}'`));
      }
      if (MEDIA_METADATA_FIELDS.some((field) => hasMediaValue(record, field))) {
        const missingMedia = new Set();
        if (!hasMediaValue(record, "media_type")) missingMedia.add("media_type");
        if (!hasMediaValue(record, "rights_status")) missingMedia.add("rights_status");
        const requiresTemporalMetadata = record.media_type === "video" ||
          record.media_type === "audio" ||
          hasMediaValue(record, "media_duration") ||
          hasMediaValue(record, "transcript_status") ||
          hasMediaValue(record, "timecode_scope");
        if (requiresTemporalMetadata) {
          for (const field of requiredFields(record, ["media_duration", "transcript_status"])) missingMedia.add(field);
        }
        if (hasMediaValue(record, "media_type") && !MEDIA_TYPES.has(record.media_type)) {
          issues.push(issue("invalid-media-type", record.relative, `Media type must be video, audio, or image; received '${record.media_type}'`));
        }
        if (hasMediaValue(record, "rights_status") && !RIGHTS_STATUSES.has(record.rights_status)) {
          issues.push(
            issue(
              "invalid-rights-status",
              record.relative,
              `Rights status must be official_or_licensed, link_only, or editorial_original; received '${record.rights_status}'`,
            ),
          );
        }
        if (hasMediaValue(record, "transcript_status") && !TRANSCRIPT_STATUSES.has(record.transcript_status)) {
          issues.push(
            issue(
              "invalid-transcript-status",
              record.relative,
              `Transcript status must be verified_excerpt, partial, or unavailable; received '${record.transcript_status}'`,
            ),
          );
        }
        const durationSeconds = hasMediaValue(record, "media_duration")
          ? parseClockToSeconds(record.media_duration)
          : null;
        if (hasMediaValue(record, "media_duration") && durationSeconds === null) {
          issues.push(
            issue(
              "invalid-media-duration",
              record.relative,
              `Media duration must use HH:MM:SS; received '${record.media_duration}'`,
            ),
          );
        }
        if (
          record.transcript_status !== undefined &&
          record.transcript_status !== "unavailable" &&
          record.timecode_scope === undefined
        ) {
          missingMedia.add("timecode_scope");
        }
        if (hasMediaValue(record, "timecode_scope")) {
          let validTimecodeScope = TIMECODE_SCOPE_PATTERN.test(record.timecode_scope);
          if (validTimecodeScope) {
            const [startText, endText] = record.timecode_scope.split("-");
            const startSeconds = parseClockToSeconds(startText);
            const endSeconds = parseClockToSeconds(endText);
            validTimecodeScope = startSeconds !== null &&
              endSeconds !== null &&
              startSeconds <= endSeconds &&
              (durationSeconds === null || endSeconds <= durationSeconds);
          }
          if (!validTimecodeScope) {
            issues.push(
              issue(
                "invalid-timecode-scope",
                record.relative,
                `Timecode scope must use HH:MM:SS-HH:MM:SS within duration bounds; received '${record.timecode_scope}'`,
              ),
            );
          }
        }
        if (record.media_type === "image") {
          const invalidFields = IMAGE_ONLY_INVALID_FIELDS.filter((field) => hasMediaValue(record, field));
          if (invalidFields.length) {
            issues.push(
              issue(
                "invalid-media-fields",
                record.relative,
                `Image sources cannot include: ${invalidFields.join(", ")}`,
              ),
            );
          }
        }
        if (missingMedia.size) {
          issues.push(
            issue(
              "missing-media-metadata",
              record.relative,
              `Missing media metadata: ${[...missingMedia].sort(compareText).join(", ")}`,
            ),
          );
        }
      }
      continue;
    }

    if (record.pageType !== "topic") {
      issues.push(issue("missing-metadata", record.relative, "Markdown corpus page must declare page_type"));
      continue;
    }

    const missing = requiredFields(record, [
      "id",
      "title",
      "page_type",
      "category",
      "evidence_state",
      "source_ids",
      "related",
      "claim_roles",
      "production_facets",
      "freshness",
      "reviewed",
    ]);
    if (missing.length) issues.push(issue("missing-metadata", record.relative, `Missing: ${missing.join(", ")}`));
    if (record.evidence_state !== undefined && !EVIDENCE_STATES.has(record.evidence_state)) {
      issues.push(issue("invalid-evidence-state", record.relative, `Unknown evidence state '${record.evidence_state}'`));
    }
    if (record.freshness !== undefined && !FRESHNESS_VALUES.has(record.freshness)) {
      issues.push(issue("invalid-freshness", record.relative, `Unknown freshness '${record.freshness}'`));
    }

    if (Array.isArray(record.source_ids)) {
      for (const sourceId of record.source_ids) {
        if (!sourceById.has(sourceId)) issues.push(issue("broken-source-id", record.relative, `Unknown source ID '${sourceId}'`));
      }
    }

    if (Array.isArray(record.related)) {
      for (const related of record.related) {
        if (typeof related !== "string") {
          issues.push(issue("broken-related-link", record.relative, "Related links must be strings"));
          continue;
        }
        const target = path.resolve(root, ...related.split("/"));
        let valid = isWithin(root, target);
        if (valid) {
          try {
            valid = (await lstat(target)).isFile();
          } catch {
            valid = false;
          }
        }
        if (!valid) issues.push(issue("broken-related-link", record.relative, `Missing or unsafe related path '${related}'`));
      }
    }

    const roles = Array.isArray(record.claim_roles) ? record.claim_roles : [];
    const coreClaim = roles.some((role) => CORE_CLAIM_ROLES.has(role));
    if (coreClaim && Array.isArray(record.source_ids) && record.source_ids.length > 0) {
      const evidence = record.source_ids.map((id) => sourceById.get(id)).filter(Boolean);
      if (evidence.length > 0 && evidence.every(({ source_tier: tier }) => tier === "C")) {
        issues.push(issue("c-only-core-claim", record.relative, "C-tier sources cannot establish a core claim"));
      }
      const hasA = evidence.some(({ source_tier: tier }) => tier === "A");
      const directB = new Set(evidence.filter(({ source_tier: tier }) => tier === "B").map(({ publisher, source_url }) => `${publisher}|${source_url}`));
      if (!hasA && directB.size < 2) {
        issues.push(issue("insufficient-core-sources", record.relative, "A stable core claim needs one A source or two independent B sources"));
      }
    }

    const age = ageInDays(record.reviewed, now);
    if (record.freshness === "current" && age > 180) {
      issues.push(issue("stale-current", record.relative, `Current page was reviewed ${age} days ago`));
    }
    if (
      record.freshness === "event" &&
      !["closed", "superseded"].includes(record.event_status) &&
      age > 30
    ) {
      issues.push(issue("stale-event", record.relative, `Open event page was reviewed ${age} days ago`));
    }
  }

  issues.sort((a, b) => compareText(a.file, b.file) || compareText(a.code, b.code) || compareText(a.message, b.message));
  return { ok: issues.length === 0, issues };
}

export async function initVault({ target, templateRoot, force = false, projectOverlay = false }) {
  if (typeof target !== "string" || target.trim() === "") throw new TypeError("Vault target must be a non-empty path");
  if (typeof templateRoot !== "string" || templateRoot.trim() === "") throw new TypeError("Template root must be a non-empty path");
  const sourceRoot = path.resolve(templateRoot);
  const destinationRoot = path.resolve(target);
  if (isWithin(sourceRoot, destinationRoot) || isWithin(destinationRoot, sourceRoot)) {
    throw new Error("Vault target and template root must not overlap");
  }

  await assertNoLinkedComponents(sourceRoot, "Template path");
  const sourceRootStat = await lstat(sourceRoot);
  if (!sourceRootStat.isDirectory() || sourceRootStat.isSymbolicLink()) throw new Error("Template root must be a real directory without symbolic links, junctions, or reparse points");

  const entries = [];
  async function scanTemplate(sourceDirectory) {
    const before = await lstat(sourceDirectory);
    if (!before.isDirectory() || before.isSymbolicLink()) {
      throw new Error(`Template contains a symbolic link, junction, or reparse point: ${relativePath(sourceRoot, sourceDirectory) || "."}`);
    }
    const names = (await readdir(sourceDirectory)).sort(compareText);
    const afterRead = await lstat(sourceDirectory);
    if (!sameIdentity(before, afterRead)) throw new Error(`Template directory changed during initialization: ${relativePath(sourceRoot, sourceDirectory) || "."}`);

    for (const name of names) {
      const source = path.join(sourceDirectory, name);
      if (!isWithin(sourceRoot, source)) throw new Error(`Unsafe template path: ${name}`);
      const stats = await lstat(source);
      const relative = path.relative(sourceRoot, source);
      if (stats.isSymbolicLink()) {
        throw new Error(`Template contains a symbolic link, junction, or reparse point: ${toPosix(relative)}`);
      }
      if (stats.isDirectory()) {
        entries.push({ source, relative, type: "directory", stats });
        await scanTemplate(source);
      } else if (stats.isFile()) {
        entries.push({ source, relative, type: "file", stats });
      } else {
        throw new Error(`Template contains an unsupported filesystem entry: ${toPosix(relative)}`);
      }
    }
  }

  await scanTemplate(sourceRoot);
  const sourceRootAfterScan = await lstat(sourceRoot);
  if (!sameIdentity(sourceRootStat, sourceRootAfterScan)) throw new Error("Template root changed during initialization");

  await assertNoLinkedComponents(destinationRoot, "Vault destination");
  await mkdir(destinationRoot, { recursive: true });
  await assertNoLinkedComponents(destinationRoot, "Vault destination");
  const destinationRootStat = await lstat(destinationRoot);
  if (!destinationRootStat.isDirectory() || destinationRootStat.isSymbolicLink()) {
    throw new Error("Vault target must be a real directory without symbolic links, junctions, or reparse points");
  }
  const destinationRealRoot = await realpath(destinationRoot);
  let created = 0;
  let skipped = 0;

  async function assertDestinationSafe(destination) {
    if (!isWithin(destinationRoot, destination)) throw new Error(`Unsafe vault destination: ${destination}`);
    await assertNoLinkedComponents(destinationRoot, "Vault destination");
    await assertNoLinkedComponents(destination, "Vault destination");
    const currentRoot = await lstat(destinationRoot);
    if (!currentRoot.isDirectory() || currentRoot.isSymbolicLink() || !sameIdentity(destinationRootStat, currentRoot)) {
      throw new Error("Vault destination root changed during initialization");
    }
    let existing = destination;
    while (!(await lstatIfPresent(existing))) {
      const parent = path.dirname(existing);
      if (parent === existing || !isWithin(destinationRoot, parent)) throw new Error(`Unsafe vault destination: ${destination}`);
      existing = parent;
    }
    const physical = await realpath(existing);
    if (!isWithin(destinationRealRoot, physical)) {
      throw new Error(`Vault destination resolves outside its root through a symbolic link, junction, or reparse point: ${destination}`);
    }
  }

  async function assertSourceUnchanged(entry) {
    await assertNoLinkedComponents(entry.source, "Template path");
    const current = await lstat(entry.source);
    if (current.isSymbolicLink() || !sameIdentity(entry.stats, current)) {
      throw new Error(`Template entry changed during initialization: ${toPosix(entry.relative)}`);
    }
    if (entry.type === "directory" ? !current.isDirectory() : !current.isFile()) {
      throw new Error(`Template entry changed type during initialization: ${toPosix(entry.relative)}`);
    }
  }

  for (const entry of entries) {
    await assertSourceUnchanged(entry);
    await assertDestinationSafe(path.resolve(destinationRoot, entry.relative));
  }

  for (const entry of entries) {
    const destination = path.resolve(destinationRoot, entry.relative);
    await assertSourceUnchanged(entry);
    await assertDestinationSafe(destination);
    if (entry.type === "directory") {
      await mkdir(destination, { recursive: true });
      await assertDestinationSafe(destination);
      continue;
    }

    await assertDestinationSafe(path.dirname(destination));
    await assertSourceUnchanged(entry);
    try {
      await copyFile(entry.source, destination, force ? 0 : constants.COPYFILE_EXCL);
      created += 1;
    } catch (error) {
      if (!force && error.code === "EEXIST") skipped += 1;
      else throw error;
    }
    await assertSourceUnchanged(entry);
    await assertDestinationSafe(destination);
  }

  if (projectOverlay) {
    const ignoreFile = path.join(destinationRoot, ".gitignore");
    await assertDestinationSafe(ignoreFile);
    try {
      await writeFile(ignoreFile, PROJECT_OVERLAY_IGNORE, {
        encoding: "utf8",
        flag: force ? "w" : "wx",
      });
      created += 1;
    } catch (error) {
      if (!force && error.code === "EEXIST") skipped += 1;
      else throw error;
    }
    await assertDestinationSafe(ignoreFile);
  }
  return { target: destinationRoot, created, skipped };
}

export async function wikiStatus(skillRoot, options = {}) {
  const root = path.resolve(skillRoot);
  const { raw, wiki } = await corpusRecords(root);
  const sources = raw.filter(({ pageType }) => pageType === "source");
  const pages = wiki.filter(({ pageType }) => pageType === "topic");
  const categories = wiki.filter(({ pageType }) => pageType === "category-index");
  const lint = await lintWiki(root, options);
  const staleFiles = new Set(
    lint.issues.filter(({ code }) => code === "stale-current" || code === "stale-event").map(({ file }) => file),
  );
  let index = "";
  const indexPath = path.join(root, "wiki", "index.md");
  try {
    index = await readFile(indexPath, "utf8");
  } catch (error) {
    if (error.code !== "ENOENT") {
      throw new Error(`wiki/index.md could not be read (${indexPath}): ${error.message}`, { cause: error });
    }
  }
  const orphans = pages.filter((page) => {
    const link = `./${relativePath(path.join(root, "wiki"), page.file)}`;
    return !index.includes(`](${link})`);
  });
  return {
    sources: sources.length,
    pages: pages.length,
    categories: categories.length,
    stale: staleFiles.size,
    orphans: orphans.length,
  };
}
