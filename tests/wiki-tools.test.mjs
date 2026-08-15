import test from "node:test";
import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import os from "node:os";
import path from "node:path";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";
import { copyFile, mkdtemp, mkdir, readFile, rm, symlink, writeFile } from "node:fs/promises";

import {
  buildIndexes,
  initVault,
  lintWiki,
  parseFrontmatter,
  wikiStatus,
} from "../skills/teochew-people-skill/scripts/wiki-lib.mjs";

const temporaryRoots = [];
const execFileAsync = promisify(execFile);
const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const installerScript = path.join(repositoryRoot, "scripts", "install-skill.mjs");
const wikiLibraryScript = path.join(
  repositoryRoot,
  "skills",
  "teochew-people-skill",
  "scripts",
  "wiki-lib.mjs",
);
const vaultInitializerScript = path.join(
  repositoryRoot,
  "skills",
  "teochew-people-skill",
  "scripts",
  "init-vault.mjs",
);

test.afterEach(async () => {
  await Promise.all(temporaryRoots.splice(0).map((root) => rm(root, { recursive: true, force: true })));
});

async function temporaryRoot() {
  const root = await mkdtemp(path.join(os.tmpdir(), "teochew-wiki-"));
  temporaryRoots.push(root);
  return root;
}

async function put(root, relativePath, content) {
  const file = path.join(root, ...relativePath.split("/"));
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, content, "utf8");
  return file;
}

async function exists(candidate) {
  try {
    await readFile(candidate);
    return true;
  } catch (error) {
    if (error.code === "ENOENT") return false;
    throw error;
  }
}

function runInstaller(args, options = {}) {
  return runInstallerAt(installerScript, args, options);
}

function runInstallerAt(script, args, options = {}) {
  return execFileAsync(process.execPath, [script, ...args], {
    cwd: options.cwd || repositoryRoot,
    encoding: "utf8",
    windowsHide: true,
  });
}

function runVaultInitializer(args, options = {}) {
  return execFileAsync(process.execPath, [vaultInitializerScript, ...args], {
    cwd: options.cwd || repositoryRoot,
    encoding: "utf8",
    windowsHide: true,
  });
}

async function installerFixture(root) {
  const fixtureRoot = path.join(root, "fixture-repo");
  const fixtureInstaller = path.join(fixtureRoot, "scripts", "install-skill.mjs");
  const source = path.join(fixtureRoot, "skills", "teochew-people-skill");
  await mkdir(path.dirname(fixtureInstaller), { recursive: true });
  await mkdir(path.join(source, "scripts"), { recursive: true });
  await copyFile(installerScript, fixtureInstaller);
  await copyFile(wikiLibraryScript, path.join(source, "scripts", "wiki-lib.mjs"));
  await put(source, "SKILL.md", "# Fixture skill\n");
  return { fixtureInstaller, fixtureRoot, source };
}

function sourcePage({ id, title, tier = "A", url = "https://example.test/source", status = "", extra = "" }) {
  const statusLine = status ? `source_status: ${status}\n` : "";
  return `---\nid: ${id}\ntitle: ${title}\npage_type: source\nsource_tier: ${tier}\nsource_url: ${url}\npublisher: Example Publisher\naccessed: 2026-08-01\n${statusLine}${extra}---\nSource notes.\n`;
}

function topicPage({
  id,
  title,
  category,
  sourceIds = ["source-a"],
  related = [],
  claimRoles = ["visual_detail"],
  freshness = "enduring",
  reviewed = "2026-08-01",
  extra = "",
}) {
  return `---\nid: ${id}\ntitle: ${title}\npage_type: topic\ncategory: ${category}\nevidence_state: verified\nsource_ids: ${JSON.stringify(sourceIds)}\nrelated: ${JSON.stringify(related)}\nclaim_roles: ${JSON.stringify(claimRoles)}\nproduction_facets: ["writing"]\nfreshness: ${freshness}\nreviewed: ${reviewed}\n${extra}---\nTopic notes.\n`;
}

test("parseFrontmatter parses controlled scalar values and JSON-style arrays", () => {
  const parsed = parseFrontmatter(`---
id: customs-greeting
title: "Greeting customs"
published: true
priority: 3
source_ids: ["source-a", "source-b"]
---
Body text.
`);

  assert.deepEqual(parsed.data, {
    id: "customs-greeting",
    title: "Greeting customs",
    published: true,
    priority: 3,
    source_ids: ["source-a", "source-b"],
  });
  assert.equal(parsed.body, "Body text.\n");
});

test("parseFrontmatter rejects unsupported nested YAML clearly", () => {
  assert.throws(
    () => parseFrontmatter("---\nid: page-a\nmetadata:\n  child: value\n---\nBody\n"),
    /unsupported nested YAML/i,
  );
});

test("buildIndexes sorts topic pages by category and title and omits category indexes", async () => {
  const root = await temporaryRoot();
  await put(root, "raw/source-review.md", "# Source review\n");
  await put(root, "raw/index.md", "<!-- GENERATED: wiki-index -->\n");
  await put(root, "raw/source-b.md", sourcePage({ id: "source-b", title: "Source Beta", status: "unavailable" }));
  await put(root, "raw/source-a.md", sourcePage({ id: "source-a", title: "Source Alpha" }));
  await put(root, "wiki/index.md", "<!-- GENERATED: wiki-index -->\n");
  await put(
    root,
    "wiki/customs/index.md",
    "---\nid: category-customs\ntitle: Customs\npage_type: category-index\ncategory: customs\n---\nNavigation.\n",
  );
  await put(root, "wiki/customs/beta.md", topicPage({ id: "customs-beta", title: "Beta", category: "customs" }));
  await put(root, "wiki/customs/alpha.md", topicPage({ id: "customs-alpha", title: "Alpha", category: "customs" }));
  await put(root, "wiki/food/zeta.md", topicPage({ id: "food-zeta", title: "Zeta", category: "food" }));

  const result = await buildIndexes(root, { write: false });

  assert.deepEqual(
    result.pages.map(({ category, title }) => [category, title]),
    [
      ["customs", "Alpha"],
      ["customs", "Beta"],
      ["food", "Zeta"],
    ],
  );
  assert.equal(result.pages.some(({ pageType }) => pageType === "category-index"), false);
  assert.match(result.rawIndex, /Source Alpha[\s\S]*Source Beta/);
  assert.match(result.rawIndex, /Source Beta[^\n]*unavailable/);
  assert.doesNotMatch(result.rawIndex, /Source review/i);
});

test("lintWiki reports broken evidence, metadata, link, tier, and freshness rules", async () => {
  const root = await temporaryRoot();
  await put(root, "raw/index.md", "<!-- GENERATED: wiki-index -->\n");
  await put(root, "raw/source-review.md", "# Source review\n");
  await put(root, "raw/a.md", sourcePage({ id: "source-a", title: "Source A" }));
  await put(root, "raw/duplicate.md", sourcePage({ id: "source-a", title: "Duplicate", tier: "Z", status: "broken" }));
  await put(root, "raw/c.md", sourcePage({ id: "source-c", title: "Source C", tier: "C" }));
  await put(root, "wiki/index.md", "<!-- GENERATED: wiki-index -->\n");
  await put(
    root,
    "wiki/customs/index.md",
    "---\nid: category-customs\ntitle: Customs\npage_type: category-index\ncategory: customs\n---\nNavigation.\n",
  );
  await put(
    root,
    "wiki/customs/broken.md",
    topicPage({
      id: "customs-broken",
      title: "Broken",
      category: "customs",
      sourceIds: ["missing-source"],
      related: ["wiki/food/missing.md"],
    }),
  );
  await put(
    root,
    "wiki/customs/no-title.md",
    "---\nid: customs-no-title\npage_type: topic\ncategory: customs\n---\nMissing metadata.\n",
  );
  await put(
    root,
    "wiki/customs/c-only.md",
    topicPage({
      id: "customs-c-only",
      title: "C-only core claim",
      category: "customs",
      sourceIds: ["source-c"],
      claimRoles: ["definition"],
    }),
  );
  await put(
    root,
    "wiki/current-events/old-event.md",
    topicPage({
      id: "event-old",
      title: "Old event",
      category: "current-events",
      freshness: "event",
      reviewed: "2026-01-01",
      extra: "event_status: open\n",
    }),
  );

  const result = await lintWiki(root, { now: new Date("2026-08-15T00:00:00Z") });
  const codes = new Set(result.issues.map(({ code }) => code));

  for (const code of [
    "duplicate-id",
    "broken-source-id",
    "broken-related-link",
    "missing-metadata",
    "invalid-source-tier",
    "invalid-source-status",
    "c-only-core-claim",
    "stale-event",
  ]) {
    assert.equal(codes.has(code), true, `expected lint issue ${code}`);
  }
  assert.equal(result.ok, false);
});

test("lintWiki validates media source evidence and rights metadata", async () => {
  const root = await temporaryRoot();
  await put(root, "raw/index.md", "<!-- GENERATED: wiki-index -->\n");
  await put(root, "raw/source-review.md", "# Source review\n");
  await put(
    root,
    "raw/valid-video.md",
    sourcePage({
      id: "valid-video",
      title: "Valid video",
      extra:
        "media_type: video\nrights_status: link_only\nmedia_duration: 00:03:12\ntranscript_status: verified_excerpt\ntimecode_scope: 00:00:08-00:01:10\n",
    }),
  );
  await put(
    root,
    "raw/broken-video.md",
    sourcePage({
      id: "broken-video",
      title: "Broken video",
      extra:
        "media_type: stream\nrights_status: copied\ntranscript_status: complete\ntimecode_scope: first minute\n",
    }),
  );

  const result = await lintWiki(root, { now: new Date("2026-08-15T00:00:00Z") });
  const brokenIssues = result.issues.filter(({ file }) => file === "raw/broken-video.md");
  const codes = new Set(brokenIssues.map(({ code }) => code));

  for (const code of [
    "missing-media-metadata",
    "invalid-media-type",
    "invalid-rights-status",
    "invalid-transcript-status",
    "invalid-timecode-scope",
  ]) {
    assert.equal(codes.has(code), true, `expected lint issue ${code}`);
  }
  assert.equal(result.issues.some(({ file }) => file === "raw/valid-video.md"), false);
});

test("lintWiki requires media source evidence to declare media_type when media metadata is present", async () => {
  const root = await temporaryRoot();
  await put(root, "raw/index.md", "<!-- GENERATED: wiki-index -->\n");
  await put(root, "raw/source-review.md", "# Source review\n");
  await put(
    root,
    "raw/rights-only.md",
    sourcePage({ id: "rights-only", title: "Rights only", extra: "rights_status: link_only\n" }),
  );
  await put(
    root,
    "raw/duration-only.md",
    sourcePage({ id: "duration-only", title: "Duration only", extra: "media_duration: 00:03:12\n" }),
  );
  await put(
    root,
    "raw/transcript-only.md",
    sourcePage({ id: "transcript-only", title: "Transcript only", extra: "transcript_status: partial\n" }),
  );
  await put(
    root,
    "raw/timecode-only.md",
    sourcePage({ id: "timecode-only", title: "Timecode only", extra: "timecode_scope: 00:00:08-00:01:10\n" }),
  );

  const result = await lintWiki(root, { now: new Date("2026-08-15T00:00:00Z") });

  for (const file of [
    "raw/rights-only.md",
    "raw/duration-only.md",
    "raw/transcript-only.md",
    "raw/timecode-only.md",
  ]) {
    const issueForFile = result.issues.find(({ code, file: issueFile, message }) =>
      code === "missing-media-metadata" &&
      issueFile === file &&
      /media_type/.test(message));
    assert.ok(issueForFile, `expected missing media_type issue for ${file}`);
  }
});

test("lintWiki validates media source evidence clock values and scope boundaries", async () => {
  const root = await temporaryRoot();
  await put(root, "raw/index.md", "<!-- GENERATED: wiki-index -->\n");
  await put(root, "raw/source-review.md", "# Source review\n");
  await put(
    root,
    "raw/bad-duration.md",
    sourcePage({
      id: "bad-duration",
      title: "Bad duration",
      extra: "media_type: video\nrights_status: link_only\nmedia_duration: 00:99:00\ntranscript_status: unavailable\n",
    }),
  );
  await put(
    root,
    "raw/reversed-scope.md",
    sourcePage({
      id: "reversed-scope",
      title: "Reversed scope",
      extra:
        "media_type: video\nrights_status: link_only\nmedia_duration: 00:03:12\ntranscript_status: verified_excerpt\ntimecode_scope: 00:02:00-00:01:00\n",
    }),
  );
  await put(
    root,
    "raw/scope-past-duration.md",
    sourcePage({
      id: "scope-past-duration",
      title: "Scope past duration",
      extra:
        "media_type: video\nrights_status: link_only\nmedia_duration: 00:03:12\ntranscript_status: verified_excerpt\ntimecode_scope: 00:03:00-00:03:30\n",
    }),
  );

  const result = await lintWiki(root, { now: new Date("2026-08-15T00:00:00Z") });
  const issueCodesByFile = new Map();
  for (const { file, code } of result.issues) {
    if (!issueCodesByFile.has(file)) issueCodesByFile.set(file, new Set());
    issueCodesByFile.get(file).add(code);
  }

  assert.equal(issueCodesByFile.get("raw/bad-duration.md")?.has("invalid-media-duration"), true);
  assert.equal(issueCodesByFile.get("raw/reversed-scope.md")?.has("invalid-timecode-scope"), true);
  assert.equal(issueCodesByFile.get("raw/scope-past-duration.md")?.has("invalid-timecode-scope"), true);
});

test("lintWiki rejects video-only media source evidence fields on images", async () => {
  const root = await temporaryRoot();
  await put(root, "raw/index.md", "<!-- GENERATED: wiki-index -->\n");
  await put(root, "raw/source-review.md", "# Source review\n");
  await put(
    root,
    "raw/still-image.md",
    sourcePage({
      id: "still-image",
      title: "Still image",
      extra:
        "media_type: image\nrights_status: editorial_original\nmedia_duration: 00:00:05\ntranscript_status: partial\ntimecode_scope: 00:00:00-00:00:05\n",
    }),
  );

  const result = await lintWiki(root, { now: new Date("2026-08-15T00:00:00Z") });
  const imageIssues = result.issues.filter(({ file }) => file === "raw/still-image.md");
  const codes = new Set(imageIssues.map(({ code }) => code));

  assert.equal(codes.has("invalid-media-fields"), true);
});

test("initVault creates a vault and preserves modified files on a second run", async () => {
  const root = await temporaryRoot();
  const templateRoot = path.join(root, "template");
  const target = path.join(root, "vault");
  await put(templateRoot, "profile.md", "home_region:\n");
  await put(templateRoot, "wiki/index.md", "# Local wiki\n");
  await put(templateRoot, "raw/index.md", "# Local raw\n");

  const result = await initVault({ target, templateRoot });

  assert.equal(await readFile(path.join(target, "profile.md"), "utf8"), "home_region:\n");
  assert.equal(result.created, 3);
  assert.equal(result.skipped, 0);
  await writeFile(path.join(target, "profile.md"), "home_region: 汕头\n", "utf8");

  const secondResult = await initVault({ target, templateRoot });

  assert.equal(await readFile(path.join(target, "profile.md"), "utf8"), "home_region: 汕头\n");
  assert.equal(secondResult.created, 0);
  assert.equal(secondResult.skipped, 3);
});

test("initVault rejects overlapping roots and source or destination link escapes", async (t) => {
  const root = await temporaryRoot();
  const templateRoot = path.join(root, "template");
  await put(templateRoot, "profile.md", "home_region:\n");
  await put(templateRoot, "wiki/page.md", "# Local page\n");

  for (const target of [templateRoot, path.join(templateRoot, "nested"), root]) {
    await assert.rejects(
      initVault({ target, templateRoot }),
      /must not overlap/i,
      `expected overlapping target ${target} to be rejected`,
    );
  }

  const target = path.join(root, "vault");
  const external = path.join(root, "external");
  await mkdir(target, { recursive: true });
  await mkdir(external, { recursive: true });
  await symlink(external, path.join(target, "wiki"), process.platform === "win32" ? "junction" : "dir");

  await assert.rejects(initVault({ target, templateRoot }), /symbolic|junction|reparse|unsafe/i);
  await assert.rejects(readFile(path.join(external, "page.md"), "utf8"), { code: "ENOENT" });

  const linkedTemplate = path.join(root, "linked-template");
  const linkedSource = path.join(root, "linked-source");
  await mkdir(linkedTemplate, { recursive: true });
  await put(linkedSource, "escaped.md", "# External source\n");
  await symlink(linkedSource, path.join(linkedTemplate, "wiki"), process.platform === "win32" ? "junction" : "dir");
  await assert.rejects(
    initVault({ target: path.join(root, "linked-vault"), templateRoot: linkedTemplate }),
    /symbolic|junction|reparse/i,
  );

  const externalFile = await put(root, "external-file.md", "external\n");
  const fileTemplate = path.join(root, "file-template");
  await mkdir(fileTemplate, { recursive: true });
  try {
    await symlink(externalFile, path.join(fileTemplate, "profile.md"), "file");
    await assert.rejects(
      initVault({ target: path.join(root, "file-vault"), templateRoot: fileTemplate }),
      /symbolic|junction|reparse/i,
    );
  } catch (error) {
    if (error.code !== "EPERM") throw error;
    t.diagnostic("ordinary file symlinks require extra privileges; directory-junction rejection was verified");
  }
});

test("installer resolves an explicit global vault independently from the skill destination", async () => {
  const root = await temporaryRoot();
  const skillParent = path.join(root, "skills");
  const vault = path.join(root, "private", "vault");

  const { stdout } = await runInstaller([
    "--dest",
    skillParent,
    "--init-vault",
    "--vault",
    vault,
  ]);

  assert.equal(await exists(path.join(skillParent, "teochew-people-skill", "SKILL.md")), true);
  assert.equal(await exists(path.join(vault, "profile.md")), true);
  assert.match(stdout, new RegExp(vault.replaceAll("\\", "\\\\")));
});

test("installer initializes a private project overlay with opt-in versioning guidance", async () => {
  const root = await temporaryRoot();
  const skillParent = path.join(root, "skills");
  const projectRoot = path.join(root, "project");
  const overlay = path.join(projectRoot, ".teochew-people");

  await runInstaller(["--dest", skillParent, "--init-project", projectRoot]);

  assert.equal(await exists(path.join(overlay, "profile.md")), true);
  assert.equal(await exists(path.join(overlay, "wiki", "index.md")), true);
  const ignore = await readFile(path.join(overlay, ".gitignore"), "utf8");
  assert.match(ignore, /^\*$/m);
  assert.match(ignore, /version control|git add -f|intentionally/i);
});

test("installer can initialize a global vault after a skill-only install without rewriting the skill", async () => {
  const root = await temporaryRoot();
  const skillParent = path.join(root, "skills");
  const installedSkill = path.join(skillParent, "teochew-people-skill");
  const vault = path.join(root, "vault");

  await runInstaller(["--dest", skillParent, "--no-vault"]);
  await put(installedSkill, "installation-marker.txt", "keep staged install\n");

  const { stdout } = await runInstaller([
    "--dest",
    skillParent,
    "--init-vault",
    "--vault",
    vault,
  ]);

  assert.equal(await readFile(path.join(installedSkill, "installation-marker.txt"), "utf8"), "keep staged install\n");
  assert.equal(await exists(path.join(vault, "profile.md")), true);
  assert.match(stdout, /保留现有\s*skill[\s\S]*仅初始化[\s\S]*vault/i);
});

test("installer can initialize a project overlay after a skill-only install without rewriting the skill", async () => {
  const root = await temporaryRoot();
  const skillParent = path.join(root, "skills");
  const installedSkill = path.join(skillParent, "teochew-people-skill");
  const projectRoot = path.join(root, "project");
  const overlay = path.join(projectRoot, ".teochew-people");

  await runInstaller(["--dest", skillParent, "--no-vault"]);
  await put(installedSkill, "installation-marker.txt", "keep staged install\n");

  const { stdout } = await runInstaller(["--dest", skillParent, "--init-project", projectRoot]);

  assert.equal(await readFile(path.join(installedSkill, "installation-marker.txt"), "utf8"), "keep staged install\n");
  assert.equal(await exists(path.join(overlay, "profile.md")), true);
  assert.equal(await exists(path.join(overlay, ".gitignore")), true);
  assert.match(stdout, /保留现有\s*skill[\s\S]*仅初始化[\s\S]*overlay/i);
});

test("installer still rejects an ordinary duplicate install and contradictory --no-vault flags", async () => {
  const root = await temporaryRoot();
  const skillParent = path.join(root, "skills");
  const vault = path.join(root, "vault");
  const projectRoot = path.join(root, "project");

  await runInstaller(["--dest", skillParent, "--no-vault"]);
  await assert.rejects(runInstaller(["--dest", skillParent]), (error) => /目标已存在/.test(error.stderr || error.message));
  await assert.rejects(
    runInstaller(["--dest", path.join(root, "conflict-vault"), "--no-vault", "--init-vault", "--vault", vault]),
    (error) => /--no-vault cannot be combined/i.test(error.stderr || error.message),
  );
  await assert.rejects(
    runInstaller(["--dest", path.join(root, "conflict-project"), "--no-vault", "--init-project", projectRoot]),
    (error) => /--no-vault cannot be combined/i.test(error.stderr || error.message),
  );
});

test("init-vault CLI resolves --project to the project's private overlay", async () => {
  const root = await temporaryRoot();
  const projectRoot = path.join(root, "project");
  const overlay = path.join(projectRoot, ".teochew-people");

  const { stdout } = await runVaultInitializer(["--project", projectRoot]);

  assert.equal(await exists(path.join(overlay, "profile.md")), true);
  assert.equal(await exists(path.join(overlay, ".gitignore")), true);
  assert.match(stdout, new RegExp(overlay.replaceAll("\\", "\\\\")));
});

test("forced skill reinstall preserves modified global profile and local wiki", async () => {
  const root = await temporaryRoot();
  const skillParent = path.join(root, "skills");
  const installedSkill = path.join(skillParent, "teochew-people-skill");
  const vault = path.join(root, "vault");
  const installArgs = ["--dest", skillParent, "--init-vault", "--vault", vault];

  await runInstaller(installArgs);
  await writeFile(path.join(vault, "profile.md"), "home_region: 潮州\n", "utf8");
  await writeFile(path.join(vault, "wiki", "index.md"), "# 我的本地知识\n", "utf8");
  await writeFile(path.join(installedSkill, "SKILL.md"), "damaged public install\n", "utf8");

  await runInstaller([...installArgs, "--force"]);

  assert.equal(await readFile(path.join(vault, "profile.md"), "utf8"), "home_region: 潮州\n");
  assert.equal(await readFile(path.join(vault, "wiki", "index.md"), "utf8"), "# 我的本地知识\n");
  assert.notEqual(await readFile(path.join(installedSkill, "SKILL.md"), "utf8"), "damaged public install\n");
});

test("project initialization refuses a junction that escapes the resolved overlay target", async () => {
  const root = await temporaryRoot();
  const skillParent = path.join(root, "skills");
  const projectRoot = path.join(root, "project");
  const external = path.join(root, "external");
  await mkdir(projectRoot, { recursive: true });
  await mkdir(external, { recursive: true });
  await symlink(external, path.join(projectRoot, ".teochew-people"), process.platform === "win32" ? "junction" : "dir");

  await assert.rejects(
    runInstaller(["--dest", skillParent, "--init-project", projectRoot]),
    (error) => /symbolic|junction|reparse|unsafe/i.test(error.stderr || error.message),
  );
  assert.equal(await exists(path.join(external, "profile.md")), false);
});

test("installer rejects a source-tree junction before deleting an existing installation", async () => {
  const root = await temporaryRoot();
  const { fixtureInstaller, fixtureRoot, source } = await installerFixture(root);
  const external = path.join(root, "external-junction-data");
  const skillParent = path.join(root, "installed-skills");
  const installedSkill = path.join(skillParent, "teochew-people-skill");
  await put(external, "secret.txt", "must never be installed\n");
  await symlink(external, path.join(source, "linked-outside"), process.platform === "win32" ? "junction" : "dir");
  await put(installedSkill, "existing-marker.txt", "preserve before source validation\n");

  await assert.rejects(
    runInstallerAt(fixtureInstaller, ["--dest", skillParent, "--force"], { cwd: fixtureRoot }),
    (error) => /symbolic|junction|reparse/i.test(error.stderr || error.message),
  );

  assert.equal(
    await readFile(path.join(installedSkill, "existing-marker.txt"), "utf8"),
    "preserve before source validation\n",
  );
  assert.equal(await exists(path.join(installedSkill, "linked-outside", "secret.txt")), false);
});

test("installer rejects an ordinary source-tree symlink when the platform permits creating one", async (t) => {
  const root = await temporaryRoot();
  const { fixtureInstaller, fixtureRoot, source } = await installerFixture(root);
  const externalFile = await put(root, "external-file.txt", "must never be installed\n");
  const skillParent = path.join(root, "installed-skills");
  const installedSkill = path.join(skillParent, "teochew-people-skill");
  await put(installedSkill, "existing-marker.txt", "preserve before source validation\n");

  try {
    await symlink(externalFile, path.join(source, "linked-file.txt"), "file");
  } catch (error) {
    if (error.code !== "EPERM") throw error;
    t.diagnostic("ordinary file symlinks require extra privileges; the mandatory junction case runs separately");
    return;
  }

  await assert.rejects(
    runInstallerAt(fixtureInstaller, ["--dest", skillParent, "--force"], { cwd: fixtureRoot }),
    (error) => /symbolic|junction|reparse/i.test(error.stderr || error.message),
  );
  assert.equal(
    await readFile(path.join(installedSkill, "existing-marker.txt"), "utf8"),
    "preserve before source validation\n",
  );
  assert.equal(await exists(path.join(installedSkill, "linked-file.txt")), false);
});

test("installer dry-run prints every resolved target without creating directories", async () => {
  const root = await temporaryRoot();
  const skillParent = path.join(root, "dry", "skills");
  const vault = path.join(root, "dry", "vault");
  const projectRoot = path.join(root, "dry", "project");

  const { stdout } = await runInstaller([
    "--dest",
    skillParent,
    "--init-vault",
    "--vault",
    vault,
    "--init-project",
    projectRoot,
    "--dry-run",
  ]);

  assert.match(stdout, new RegExp(skillParent.replaceAll("\\", "\\\\")));
  assert.match(stdout, new RegExp(vault.replaceAll("\\", "\\\\")));
  assert.match(stdout, new RegExp(path.join(projectRoot, ".teochew-people").replaceAll("\\", "\\\\")));
  assert.equal(await exists(path.join(skillParent, "teochew-people-skill", "SKILL.md")), false);
  assert.equal(await exists(path.join(vault, "profile.md")), false);
  assert.equal(await exists(path.join(projectRoot, ".teochew-people", "profile.md")), false);
});

test("installer remains skill-only by default and honors --no-vault", async () => {
  const root = await temporaryRoot();
  const defaultSkillParent = path.join(root, "default-skills");
  const explicitSkillParent = path.join(root, "explicit-skills");
  const vault = path.join(root, "vault");

  await runInstaller(["--dest", defaultSkillParent]);
  await runInstaller(["--dest", explicitSkillParent, "--vault", vault, "--no-vault"]);

  assert.equal(await exists(path.join(defaultSkillParent, "teochew-people-skill", "SKILL.md")), true);
  assert.equal(await exists(path.join(explicitSkillParent, "teochew-people-skill", "SKILL.md")), true);
  assert.equal(await exists(path.join(vault, "profile.md")), false);
});

test("wiki tools fail closed on a linked corpus directory without consuming external content", async () => {
  const root = await temporaryRoot();
  const skillRoot = path.join(root, "skill");
  const external = path.join(root, "external-corpus");
  const rawIndex = await put(skillRoot, "raw/index.md", "RAW INDEX SENTINEL\n");
  await put(skillRoot, "raw/source-review.md", "# Source review\n");
  await put(skillRoot, "wiki/index.md", "WIKI INDEX SENTINEL\n");
  await put(
    external,
    "outside.md",
    "---\nid: external-secret\ntitle: EXTERNAL CONTENT MUST NOT BE READ\npage_type: source\nsource_tier: A\nsource_url: https://example.test/secret\npublisher: External\naccessed: 2026-08-15\n---\nsecret\n",
  );
  await symlink(
    external,
    path.join(skillRoot, "raw", "linked-outside"),
    process.platform === "win32" ? "junction" : "dir",
  );

  await assert.rejects(buildIndexes(skillRoot), /corpus[\s\S]*(symbolic|junction|reparse|link)/i);
  const lint = await lintWiki(skillRoot);
  assert.equal(lint.ok, false);
  assert.equal(lint.issues.some(({ message }) => /corpus[\s\S]*(symbolic|junction|reparse|link)/i.test(message)), true);
  assert.equal(lint.issues.some(({ message }) => /EXTERNAL CONTENT MUST NOT BE READ/.test(message)), false);
  await assert.rejects(wikiStatus(skillRoot), /corpus[\s\S]*(symbolic|junction|reparse|link)/i);
  assert.equal(await readFile(rawIndex, "utf8"), "RAW INDEX SENTINEL\n");
});

test("wikiStatus tolerates a missing index but rejects other index read failures", async () => {
  const root = await temporaryRoot();
  await put(root, "raw/source-a.md", sourcePage({ id: "source-a", title: "Source A" }));
  await put(
    root,
    "wiki/customs/index.md",
    "---\nid: category-customs\ntitle: Customs\npage_type: category-index\ncategory: customs\n---\nNavigation.\n",
  );
  await put(root, "wiki/customs/topic.md", topicPage({ id: "customs-topic", title: "Topic", category: "customs" }));

  const withoutIndex = await wikiStatus(root, { now: new Date("2026-08-15T00:00:00Z") });
  assert.equal(withoutIndex.orphans, 1);

  await mkdir(path.join(root, "wiki", "index.md"), { recursive: true });
  await assert.rejects(wikiStatus(root), /wiki[\\/]index\.md[\s\S]*(read|directory|EISDIR)/i);
});

test("wikiStatus returns source, page, category, stale, and orphan counts", async () => {
  const root = await temporaryRoot();
  await put(root, "raw/index.md", "<!-- GENERATED: wiki-index -->\n");
  await put(root, "raw/source-review.md", "# Source review\n");
  await put(root, "raw/source-a.md", sourcePage({ id: "source-a", title: "Source A" }));
  await put(root, "wiki/index.md", "<!-- GENERATED: wiki-index -->\n");
  await put(
    root,
    "wiki/current-events/index.md",
    "---\nid: category-current-events\ntitle: Current events\npage_type: category-index\ncategory: current-events\n---\nNavigation.\n",
  );
  await put(
    root,
    "wiki/current-events/old-event.md",
    topicPage({
      id: "event-old",
      title: "Old event",
      category: "current-events",
      freshness: "event",
      reviewed: "2026-01-01",
      extra: "event_status: open\n",
    }),
  );
  await buildIndexes(root);

  assert.deepEqual(await wikiStatus(root, { now: new Date("2026-08-15T00:00:00Z") }), {
    sources: 1,
    pages: 1,
    categories: 1,
    stale: 1,
    orphans: 0,
  });
});
