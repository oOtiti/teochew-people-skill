import assert from "node:assert/strict";
import { mkdtemp, mkdir, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import { validateMediaManifest } from "../scripts/validate-media-manifest.mjs";

async function temporaryRoot() {
  return mkdtemp(path.join(os.tmpdir(), "teochew-media-"));
}

async function put(root, relative, content) {
  const target = path.join(root, relative);
  await mkdir(path.dirname(target), { recursive: true });
  await writeFile(target, content, "utf8");
}

function item(overrides = {}) {
  return {
    id: "editorial-visual",
    path: "assets/editorial-visual.svg",
    media_type: "image",
    rights_status: "editorial_original",
    creator: "TEOCHEW PEOPLE",
    creation_method: "hand-authored SVG",
    source_ids: ["example-source"],
    alt: "原创编辑视觉，用抽象线条说明跨海家庭资料关系",
    disclaimer: "非历史照片、非电影剧照、非具体活动现场。",
    purpose: "Article evidence graphic",
    reviewed: "2026-08-15",
    ...overrides,
  };
}

async function validRoot() {
  const root = await temporaryRoot();
  await put(
    root,
    "assets/editorial-visual.svg",
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 675"><rect width="1200" height="675"/></svg>',
  );
  await put(
    root,
    "skills/teochew-people-skill/raw/example.md",
    "---\nid: example-source\npage_type: source\n---\n",
  );
  await put(
    root,
    "assets/media-manifest.json",
    JSON.stringify({ version: 1, items: [item()] }, null, 2),
  );
  return root;
}

test("validateMediaManifest accepts source-grounded editorial originals", async () => {
  const root = await validRoot();
  const result = await validateMediaManifest(root);

  assert.deepEqual(result.issues, []);
  assert.equal(result.itemCount, 1);
});

test("validateMediaManifest rejects duplicate identity, paths, and unsafe rights", async () => {
  const root = await validRoot();
  await put(
    root,
    "assets/media-manifest.json",
    JSON.stringify(
      {
        version: 1,
        items: [
          item({ rights_status: "public" }),
          item({ alt: "", disclaimer: "" }),
        ],
      },
      null,
      2,
    ),
  );

  const result = await validateMediaManifest(root);
  const codes = new Set(result.issues.map(({ code }) => code));

  for (const code of [
    "duplicate-asset-id",
    "duplicate-asset-path",
    "invalid-rights-status",
    "missing-alt",
    "missing-disclaimer",
  ]) {
    assert.equal(codes.has(code), true, `expected ${code}`);
  }
});

test("validateMediaManifest rejects escaping, missing, and ungrounded assets", async () => {
  const root = await validRoot();
  await put(
    root,
    "assets/media-manifest.json",
    JSON.stringify(
      {
        version: 1,
        items: [
          item({ id: "escape", path: "../outside.svg" }),
          item({ id: "missing", path: "assets/missing.svg" }),
          item({ id: "unknown-source", source_ids: ["not-admitted"] }),
        ],
      },
      null,
      2,
    ),
  );

  const result = await validateMediaManifest(root);
  const codes = new Set(result.issues.map(({ code }) => code));

  for (const code of ["unsafe-asset-path", "missing-asset", "missing-source"]) {
    assert.equal(codes.has(code), true, `expected ${code}`);
  }
});

test("validateMediaManifest rejects SVG files that fetch remote images", async () => {
  const root = await validRoot();
  await put(
    root,
    "assets/editorial-visual.svg",
    '<svg xmlns="http://www.w3.org/2000/svg"><image href="https://example.test/still.jpg"/></svg>',
  );

  const result = await validateMediaManifest(root);

  assert.equal(
    result.issues.some(({ code }) => code === "remote-svg-image"),
    true,
  );
});
