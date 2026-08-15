import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const requiredProjectPageTokens = [
  'data-language="zh-CN"',
  'data-language="zh-Hant"',
  'data-language="en"',
  'data-language="ja"',
  "55",
  "50",
  "9",
  "CI",
  "npm",
  "Node.js",
  "MIT",
  "Wiki sources",
  "Topics",
  "Languages",
  "assets/yingge-epic.png",
  "assets/letter-to-grandma-hero.png",
  "examples/letter-to-grandma-feature.md",
  "examples/letter-to-grandma-video-scripts.md",
  "examples/video-to-wiki-demo.md",
  "editorial_original",
  "link_only",
  "localStorage",
  "teochewPeopleLanguage",
  "prefers-reduced-motion",
  'href="#main-content"',
  "data-i18n",
  "translations",
];

test("project showcase exposes the multilingual Wiki and production surface", async () => {
  const page = await readFile(new URL("../index.html", import.meta.url), "utf8");

  for (const token of requiredProjectPageTokens) {
    assert.match(page, new RegExp(token.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")), `missing ${token}`);
  }

  assert.doesNotMatch(page, /fonts\.(?:googleapis|gstatic)\.com/);
  assert.doesNotMatch(page, /<script[^>]+src=/);
  assert.doesNotMatch(page, /IntersectionObserver/);
  assert.doesNotMatch(page, /\.js \.reveal\s*\{[^}]*opacity:\s*0/s);
  assert.match(page, /<link rel="icon" href="data:image\/svg\+xml,/);
  assert.match(page, /<main\b[^>]*id="main-content"/);
  assert.match(page, /<img\b[^>]*alt="[^"]+"/);
});

test("npm package includes the live project showcase", async () => {
  const packageJson = JSON.parse(
    await readFile(new URL("../package.json", import.meta.url), "utf8"),
  );

  assert.ok(packageJson.files.includes("index.html"));
});

test("project home and release validator keep the showcase discoverable", async () => {
  const [readme, validator] = await Promise.all([
    readFile(new URL("../README.md", import.meta.url), "utf8"),
    readFile(new URL("../scripts/validate-skill.ps1", import.meta.url), "utf8"),
  ]);

  assert.match(readme, /<a href="index\.html">项目展示页<\/a>/);
  assert.match(validator, /index\.html/);
  assert.match(validator, /assets\/yingge-epic\.png/);
  assert.match(validator, /examples\/letter-to-grandma-feature\.md/);
  assert.match(validator, /examples\/video-to-wiki-demo\.md/);
});
