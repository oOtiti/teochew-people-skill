import { readFile } from "node:fs/promises";

const GITHUB_MARKDOWN_ENDPOINT = "https://api.github.com/markdown";
const REPOSITORY_CONTEXT = "oOtiti/teochew-people-skill";
const unsafeHtmlAttribute = /(?:alt|title)="[^"]*[<>][^"]*"/;
const commonLinks = [
  'href="skills/teochew-people-skill/wiki/index.md"',
  'href="examples/letter-to-grandma-feature.md"',
  'href="examples/letter-to-grandma-video-scripts.md"',
];

const readmeSpecs = [
  {
    file: "README.md",
    selectedLanguage: "<strong>简体中文</strong>",
    renderedLanguage: "<strong>简体中文</strong>",
    installLink: 'href="#快速安装"',
    renderedInstallLink: 'href="#快速安装">快速安装</a>',
    firstHeading: "## 这是一套什么样的 WIKI",
    renderedHeading: "这是一套什么样的 WIKI",
  },
  {
    file: "README.zh-Hant.md",
    selectedLanguage: '<strong><a href="README.zh-Hant.md">繁體中文',
    renderedLanguage: ">繁體中文</a></strong>",
    installLink: 'href="#快速安裝"',
    renderedInstallLink: 'href="#快速安裝">快速安裝</a>',
    firstHeading: "## 這是什麼",
    renderedHeading: "這是什麼",
  },
  {
    file: "README.en.md",
    selectedLanguage: '<strong><a href="README.en.md">English',
    renderedLanguage: ">English</a></strong>",
    installLink: 'href="#install"',
    renderedInstallLink: 'href="#install">Install</a>',
    firstHeading: "## What it is",
    renderedHeading: "What it is",
  },
  {
    file: "README.ja.md",
    selectedLanguage: '<strong><a href="README.ja.md">日本語',
    renderedLanguage: ">日本語</a></strong>",
    installLink: 'href="#インストール"',
    renderedInstallLink: 'href="#インストール">インストール</a>',
    firstHeading: "## このプロジェクトについて",
    renderedHeading: "このプロジェクトについて",
  },
];

function assertOrdered(content, tokens, label) {
  let previousPosition = -1;
  for (const token of tokens) {
    const position = content.indexOf(token);
    if (position <= previousPosition) {
      throw new Error(`${label}: missing or out-of-order token ${JSON.stringify(token)}`);
    }
    previousPosition = position;
  }
}

async function renderWithGitHub(markdown) {
  const headers = {
    Accept: "application/vnd.github+json",
    "Content-Type": "application/json",
    "User-Agent": "teochew-people-skill-readme-validator",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  const response = await fetch(GITHUB_MARKDOWN_ENDPOINT, {
    method: "POST",
    headers,
    body: JSON.stringify({ text: markdown, mode: "gfm", context: REPOSITORY_CONTEXT }),
  });
  if (!response.ok) {
    const detail = (await response.text()).slice(0, 500);
    throw new Error(`GitHub Markdown API returned ${response.status}: ${detail}`);
  }
  return response.text();
}

for (const spec of readmeSpecs) {
  const markdown = await readFile(new URL(`../${spec.file}`, import.meta.url), "utf8");
  if (unsafeHtmlAttribute.test(markdown)) {
    throw new Error(`${spec.file}: escape angle brackets inside HTML alt/title attributes for GitHub repository rendering`);
  }
  const sourceOrder = [
    'src="assets/social-preview.png"',
    '<h1 align="center">TEOCHEW PEOPLE</h1>',
    "actions/workflows/ci.yml/badge.svg",
    spec.selectedLanguage,
    ...commonLinks,
    spec.installLink,
    spec.firstHeading,
  ];
  assertOrdered(markdown, sourceOrder, `${spec.file} source`);

  const rendered = await renderWithGitHub(markdown);
  if (rendered.includes("<script")) {
    throw new Error(`${spec.file}: GitHub rendered an unexpected script element`);
  }
  const renderedOrder = [
    "assets/social-preview.png",
    ">TEOCHEW PEOPLE</h1>",
    "actions/workflows/ci.yml/badge.svg",
    spec.renderedLanguage,
    ...commonLinks,
    spec.renderedInstallLink,
    spec.renderedHeading,
  ];
  assertOrdered(rendered, renderedOrder, `${spec.file} GitHub render`);
  if (!rendered.includes("Categories-9")) {
    throw new Error(`${spec.file}: Categories 9 badge is missing from the GitHub render`);
  }

  const renderedBytes = Buffer.byteLength(rendered);
  console.log(`GitHubFirstScreen valid: ${spec.file} (${renderedBytes} rendered bytes)`);
}
