import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import vm from "node:vm";

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

test("language switching localizes document state and accessible labels", async () => {
  const page = await readFile(new URL("../index.html", import.meta.url), "utf8");
  const script = page.match(/<script>([\s\S]*?)<\/script>/)?.[1];
  assert.ok(script, "inline language script is missing");

  class FakeElement {
    constructor(dataset = {}) {
      this.dataset = dataset;
      this.attributes = new Map();
      this.textContent = "";
    }

    addEventListener(type, listener) {
      this[`${type}Listener`] = listener;
    }

    setAttribute(name, value) {
      this.attributes.set(name, String(value));
    }

    getAttribute(name) {
      return this.attributes.get(name) ?? null;
    }
  }

  const keysFor = (attribute) => [...page.matchAll(new RegExp(`${attribute}="([^"]+)"`, "g"))]
    .map((match) => new FakeElement({ [attribute.replace(/^data-/, "").replace(/-([a-z])/g, (_, letter) => letter.toUpperCase())]: match[1] }));
  const languageButtons = [...page.matchAll(/data-language="([^"]+)"/g)]
    .map((match) => new FakeElement({ language: match[1] }));
  const translatable = keysFor("data-i18n");
  const ariaLabels = keysFor("data-i18n-aria");
  const altTexts = keysFor("data-i18n-alt");
  const stored = new Map();
  const document = {
    documentElement: { lang: "" },
    title: "",
    querySelectorAll(selector) {
      return {
        "[data-language]": languageButtons,
        "[data-i18n]": translatable,
        "[data-i18n-aria]": ariaLabels,
        "[data-i18n-alt]": altTexts,
        "[data-copy]": [],
      }[selector] ?? [];
    },
  };
  const context = vm.createContext({
    document,
    localStorage: {
      getItem: (key) => stored.get(key) ?? null,
      setItem: (key, value) => stored.set(key, value),
    },
    navigator: {},
    window: { setTimeout() {} },
  });

  vm.runInContext(script, context);
  assert.equal(typeof context.setLanguage, "function");

  const expectations = {
    "zh-CN": ["项目导航", "语言选择", "项目状态", "Wiki 数量"],
    "zh-Hant": ["項目導覽", "語言選擇", "項目狀態", "Wiki 數量"],
    en: ["Project navigation", "Language selector", "Project status", "Wiki counts"],
    ja: ["プロジェクトナビゲーション", "言語選択", "プロジェクト状況", "Wiki 件数"],
  };

  for (const [language, expectedLabels] of Object.entries(expectations)) {
    context.setLanguage(language, true);
    assert.equal(document.documentElement.lang, language);
    assert.ok(document.title.startsWith("TEOCHEW PEOPLE"));
    assert.deepEqual(ariaLabels.map((element) => element.getAttribute("aria-label")), expectedLabels);
    assert.ok(altTexts.length >= 6);
    assert.ok(altTexts.every((element) => element.getAttribute("alt")), `${language} has an empty localized alt`);
    assert.deepEqual(
      languageButtons.map((button) => button.getAttribute("aria-pressed")),
      languageButtons.map((button) => String(button.dataset.language === language)),
    );
  }
  assert.equal(stored.get("teochewPeopleLanguage"), "ja");
});

test("npm package includes the live project showcase", async () => {
  const packageJson = JSON.parse(
    await readFile(new URL("../package.json", import.meta.url), "utf8"),
  );

  assert.ok(packageJson.files.includes("index.html"));
});

test("GitHub READMEs are the primary multilingual project showcase", async () => {
  const [readme, traditional, english, japanese, validator, packageSource, workflow, renderCheck] = await Promise.all([
    readFile(new URL("../README.md", import.meta.url), "utf8"),
    readFile(new URL("../README.zh-Hant.md", import.meta.url), "utf8"),
    readFile(new URL("../README.en.md", import.meta.url), "utf8"),
    readFile(new URL("../README.ja.md", import.meta.url), "utf8"),
    readFile(new URL("../scripts/validate-skill.ps1", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
    readFile(new URL("../.github/workflows/ci.yml", import.meta.url), "utf8"),
    readFile(new URL("../scripts/validate-github-readmes.mjs", import.meta.url), "utf8").catch(() => ""),
  ]);

  for (const localizedReadme of [readme, traditional, english, japanese]) {
    assert.match(localizedReadme, /<h1 align="center">TEOCHEW PEOPLE<\/h1>/);
    assert.match(localizedReadme, /href="skills\/teochew-people-skill\/wiki\/index\.md"/);
    assert.match(localizedReadme, /href="examples\/letter-to-grandma-feature\.md"/);
    assert.match(localizedReadme, /href="examples\/letter-to-grandma-video-scripts\.md"/);
    assert.match(localizedReadme, /Categories-9/);
    assert.doesNotMatch(localizedReadme, /<a href="index\.html">/);
  }

  const orderedFrontScreens = [
    [readme, ["assets/social-preview.png", "<h1 align=\"center\">", "actions/workflows/ci.yml/badge.svg", "<strong>简体中文</strong>", "skills/teochew-people-skill/wiki/index.md", "examples/letter-to-grandma-feature.md", "examples/letter-to-grandma-video-scripts.md", "href=\"#快速安装\"", "## 这是一套什么样的 WIKI"]],
    [traditional, ["assets/social-preview.png", "<h1 align=\"center\">", "actions/workflows/ci.yml/badge.svg", "<strong><a href=\"README.zh-Hant.md\">繁體中文", "skills/teochew-people-skill/wiki/index.md", "examples/letter-to-grandma-feature.md", "examples/letter-to-grandma-video-scripts.md", "href=\"#快速安裝\"", "## 這是什麼"]],
    [english, ["assets/social-preview.png", "<h1 align=\"center\">", "actions/workflows/ci.yml/badge.svg", "<strong><a href=\"README.en.md\">English", "skills/teochew-people-skill/wiki/index.md", "examples/letter-to-grandma-feature.md", "examples/letter-to-grandma-video-scripts.md", "href=\"#install\"", "## What it is"]],
    [japanese, ["assets/social-preview.png", "<h1 align=\"center\">", "actions/workflows/ci.yml/badge.svg", "<strong><a href=\"README.ja.md\">日本語", "skills/teochew-people-skill/wiki/index.md", "examples/letter-to-grandma-feature.md", "examples/letter-to-grandma-video-scripts.md", "href=\"#インストール\"", "## このプロジェクトについて"]],
  ];
  for (const [localizedReadme, tokens] of orderedFrontScreens) {
    let previousPosition = -1;
    for (const token of tokens) {
      const position = localizedReadme.indexOf(token);
      assert.ok(position > previousPosition, `${token} is missing or out of GitHub first-screen order`);
      previousPosition = position;
    }
  }

  assert.match(readme, /^## 这是一套什么样的 WIKI$/m);
  assert.match(readme, /<a href="#快速安装">快速安装<\/a>/);
  assert.match(validator, /GitHub 仓库首页/);
  assert.match(validator, /assets\/yingge-epic\.png/);
  assert.match(validator, /examples\/letter-to-grandma-feature\.md/);
  assert.match(validator, /examples\/video-to-wiki-demo\.md/);
  const packageJson = JSON.parse(packageSource);
  assert.equal(packageJson.scripts["readme:render:check"], "node scripts/validate-github-readmes.mjs");
  assert.match(renderCheck, /https:\/\/api\.github\.com\/markdown/);
  assert.match(renderCheck, /README\.zh-Hant\.md/);
  assert.match(renderCheck, /GitHubFirstScreen/);
  assert.match(workflow, /npm run readme:render:check/);
  assert.match(workflow, /GITHUB_TOKEN:/);
});
