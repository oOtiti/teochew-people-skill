import test from "node:test";
import assert from "node:assert/strict";
import os from "node:os";
import path from "node:path";
import { mkdtemp, mkdir, readFile, rm, symlink, writeFile } from "node:fs/promises";

import {
  buildIndexes,
  initVault,
  lintWiki,
  parseFrontmatter,
  wikiStatus,
} from "../skills/teochew-people-skill/scripts/wiki-lib.mjs";

const temporaryRoots = [];

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

function sourcePage({ id, title, tier = "A", url = "https://example.test/source" }) {
  return `---\nid: ${id}\ntitle: ${title}\npage_type: source\nsource_tier: ${tier}\nsource_url: ${url}\npublisher: Example Publisher\naccessed: 2026-08-01\n---\nSource notes.\n`;
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
  await put(root, "raw/source-b.md", sourcePage({ id: "source-b", title: "Source Beta" }));
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
  assert.doesNotMatch(result.rawIndex, /Source review/i);
});

test("lintWiki reports broken evidence, metadata, link, tier, and freshness rules", async () => {
  const root = await temporaryRoot();
  await put(root, "raw/index.md", "<!-- GENERATED: wiki-index -->\n");
  await put(root, "raw/source-review.md", "# Source review\n");
  await put(root, "raw/a.md", sourcePage({ id: "source-a", title: "Source A" }));
  await put(root, "raw/duplicate.md", sourcePage({ id: "source-a", title: "Duplicate", tier: "Z" }));
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
    "c-only-core-claim",
    "stale-event",
  ]) {
    assert.equal(codes.has(code), true, `expected lint issue ${code}`);
  }
  assert.equal(result.ok, false);
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
