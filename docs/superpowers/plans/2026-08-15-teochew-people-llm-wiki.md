# Teochew People LLM Wiki Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Upgrade `teochew-people-skill` into a source-grounded, self-evolving and locally personalized Teochew People LLM Wiki, with a fully migrated knowledge base and a new `TEOCHEW PEOPLE` visual identity.

**Architecture:** The installable skill owns immutable `raw/` source records, maintained `wiki/` topic pages, five operation playbooks, and zero-dependency Node.js maintenance tools. Public knowledge is versioned in the repository; user preferences live in `~/.teochew-people/`; project-specific overlays live in `.teochew-people/`. The main `SKILL.md` remains a thin router that reads the wiki index, escalates stale or unclear questions to research, and never turns local preferences into public facts.

**Tech Stack:** Markdown, Agent Skills specification, Node.js 18+ standard library, PowerShell validation, Node built-in test runner, GitHub Markdown/SVG/PNG assets, built-in image generation.

---

## File map

### Public skill runtime

- `skills/teochew-people-skill/SKILL.md` — trigger, routing, evidence and personalization rules.
- `skills/teochew-people-skill/wiki-purpose.md` — public scope, audience and non-goals.
- `skills/teochew-people-skill/wiki-schema.md` — raw/page metadata contracts and freshness rules.
- `skills/teochew-people-skill/wiki-log.md` — append-only public knowledge operation log.
- `skills/teochew-people-skill/operations/*.md` — ingest, query, research, evolve and lint procedures.
- `skills/teochew-people-skill/raw/` — date-organized source records and generated index.
- `skills/teochew-people-skill/raw/source-review.md` — append-only source admission decisions, including rejected candidates and reasons.
- `skills/teochew-people-skill/wiki/` — maintained topic pages and generated index.
- `skills/teochew-people-skill/scripts/wiki-lib.mjs` — reusable parser, index, lint, status and vault functions.
- `skills/teochew-people-skill/scripts/{build-index,lint-wiki,wiki-status,init-vault}.mjs` — CLI wrappers.
- `skills/teochew-people-skill/assets/vault-template/` — local-vault starter files.

### Repository validation and distribution

- `tests/skill-scenarios.json` — repeatable behavior probes and expected properties.
- `tests/wiki-tools.test.mjs` — Node unit tests for index, lint and vault safety.
- `scripts/validate-skill.ps1` — structural, content and distribution checks.
- `scripts/install-skill.mjs` — install plus optional vault initialization.
- `package.json` / `package-lock.json` — commands and next feature version.
- `README.md`, `CONTRIBUTING.md`, `skills/README.md`, `docs/*.md`, `examples/before-after.md` — rewritten product and contributor documentation.

### Visual assets

- `assets/hero-background.png` — generated background without text.
- `assets/hero.svg` — deterministic source composition with only `TEOCHEW PEOPLE`.
- `assets/social-preview.png` — raster export used by README and repository social preview.
- `assets/case-demo.svg` — restyled capability comparison.

## Task 1: Capture failing behavior before changing the skill

**Files:**
- Create: `tests/skill-scenarios.json`
- Create: `scripts/validate-scenarios.mjs`
- Temporary evidence only: `tmp/behavior-baseline/`

- [ ] **Step 1: Add the behavior scenario contract**

Create `tests/skill-scenarios.json` with these exact scenario IDs and requirements:

```json
{
  "version": 1,
  "scenarios": [
    {
      "id": "distinguish-bai-ying-laoye",
      "prompt": "拜老爷和营老爷是一回事吗？请说明来源和地方差异。",
      "must": ["区分日常祭拜与社区巡游", "说明地方差异", "提供可核对来源"],
      "must_not": ["统一仪式流程", "潮汕人都"]
    },
    {
      "id": "avoid-universal-deity-list",
      "prompt": "潮汕人一般拜哪些老爷？给我一个准确的解释。",
      "must": ["解释老爷是地方性称谓", "限定地域或场景", "承认资料边界"],
      "must_not": ["全潮汕统一神明名录", "无来源禁忌"]
    },
    {
      "id": "current-cultural-events",
      "prompt": "最近潮汕有什么值得关注的文化热点？",
      "must": ["实时查询", "给出事件日期", "区分事件与长期趋势"],
      "must_not": ["用旧知识假装最新"]
    },
    {
      "id": "personalized-jieyang-writing",
      "prompt": "我家在揭阳，之后写礼俗时优先提醒揭阳和我家做法的差异，但不要当成全潮汕统一习俗。",
      "must": ["确认个性化偏好", "保持公共事实不变", "本地保存需征得同意"],
      "must_not": ["自动写入公共知识"]
    },
    {
      "id": "verify-current-heritage-status",
      "prompt": "这个潮汕文化项目现在还是国家级非遗吗？",
      "must": ["要求明确项目", "实时核验官方名录", "标注核验时间"],
      "must_not": ["凭既有文本直接确认"]
    },
    {
      "id": "teochew-scope",
      "prompt": "Teochew People 是不是只指今天潮州市的人？",
      "must": ["说明历史与当代语境", "覆盖汕头潮州揭阳和海外社群"],
      "must_not": ["把潮州等同全部潮汕"]
    }
  ]
}
```

- [ ] **Step 2: Add a deterministic fixture validator**

Create `scripts/validate-scenarios.mjs` using `node:fs` and `node:assert/strict`. It must reject duplicate IDs, empty prompts, missing `must`, missing `must_not`, and scenario versions other than `1`; success prints `Behavior scenarios valid: 6`.

- [ ] **Step 3: Run the fixture validator**

Run: `node scripts/validate-scenarios.mjs`  
Expected: `Behavior scenarios valid: 6`

- [ ] **Step 4: Run the six scenarios without the new wiki architecture**

Use fresh validation agents without revealing the intended fix. Give each agent only the current skill path and one prompt. Save raw responses and a short rubric result under `tmp/behavior-baseline/`.

Expected RED evidence: at least one of source traceability, current-event verification, durable personalization, or the 拜老爷/营老爷 distinction is missing. Do not edit the skill until the failure is observed and recorded.

- [ ] **Step 5: Commit reusable scenario fixtures**

```powershell
git add tests/skill-scenarios.json scripts/validate-scenarios.mjs
git commit -m "test: add Teochew wiki behavior scenarios"
```

Do not commit `tmp/behavior-baseline/`.

## Task 2: Make the structural validator fail for the new architecture

**Files:**
- Modify: `scripts/validate-skill.ps1`

- [ ] **Step 1: Replace the flat-reference contract with the approved wiki contract**

Update the validator to require:

```powershell
$requiredSkillFiles = @(
    "SKILL.md",
    "wiki-purpose.md",
    "wiki-schema.md",
    "wiki-log.md",
    "agents/openai.yaml",
    "operations/ingest.md",
    "operations/query.md",
    "operations/research.md",
    "operations/evolve.md",
    "operations/lint.md",
    "raw/index.md",
    "raw/source-review.md",
    "wiki/index.md",
    "scripts/wiki-lib.mjs",
    "scripts/build-index.mjs",
    "scripts/lint-wiki.mjs",
    "scripts/wiki-status.mjs",
    "scripts/init-vault.mjs",
    "assets/vault-template/profile.md",
    "assets/vault-template/wiki/index.md",
    "assets/vault-template/raw/index.md"
)
```

Require at least one Markdown page under each of these wiki categories:

```powershell
$requiredWikiCategories = @(
    "concepts", "places", "customs", "food", "arts-language",
    "society-diaspora", "people-organizations", "current-events", "guides"
)
```

Require the public skill to contain `raw`, `wiki`, `research`, `evolve`, `local vault`, `拜老爷`, `营老爷`, `TEOCHEW PEOPLE`, and the five operation names across its bundled text.

- [ ] **Step 2: Run the validator and confirm the expected failure**

Run: `npm run validate`  
Expected: FAIL beginning with a missing file such as `wiki-purpose.md`.

Do not commit while the hook is red.

## Task 3: Build the minimal wiki skeleton and operating contracts

**Files:**
- Modify: `skills/teochew-people-skill/SKILL.md`
- Create: `skills/teochew-people-skill/wiki-purpose.md`
- Create: `skills/teochew-people-skill/wiki-schema.md`
- Create: `skills/teochew-people-skill/wiki-log.md`
- Create: `skills/teochew-people-skill/operations/{ingest,query,research,evolve,lint}.md`
- Create: `skills/teochew-people-skill/raw/index.md`
- Create: `skills/teochew-people-skill/raw/source-review.md`
- Create: `skills/teochew-people-skill/wiki/index.md`
- Create: `skills/teochew-people-skill/assets/vault-template/profile.md`
- Create: `skills/teochew-people-skill/assets/vault-template/wiki/index.md`
- Create: `skills/teochew-people-skill/assets/vault-template/raw/index.md`

- [ ] **Step 1: Write the purpose and schema files**

Use the approved design as the exact contract. `wiki-schema.md` must define the raw and wiki frontmatter shown in the spec, evidence states (`verified`, `synthesis`, `varies`, `unknown`), source tiers (`A`, `B`, `C`, `Reject`), claim roles, freshness classes (`enduring`, `current`, `event`), and these review windows:

- `enduring`: review on source change or explicit challenge.
- `current`: recheck after 180 days.
- `event`: recheck after 30 days until marked `closed` or `superseded`.
- official status, schedules and living-person roles: always verify live when asked for current state.

Source admission rules are mandatory:

- A: authoritative and directly supports the claim.
- B: reliable institutional or edited reporting used as corroboration or current context.
- C: bounded community or personal context; never sufficient for origin, universality or official status.
- Reject: no usable provenance, copied marketing material, irrelevant support or unresolvable conflict.
- Stable core facts need one A source or two independent direct B sources.
- Rejected candidates go to `raw/source-review.md`, never to the generated raw index.

- [ ] **Step 2: Write the five operation playbooks**

Each playbook must have: trigger, inputs, ordered procedure, write boundary, failure handling and completion checks. Compilation is serialized: only one operation may update public `wiki/index.md` and `wiki-log.md` at a time.

- [ ] **Step 3: Rewrite SKILL.md as a thin router**

Keep the existing skill name. The body must route requests through `wiki/index.md`, read no more than three topic pages initially, use `operations/research.md` when coverage is stale or unclear, use `operations/evolve.md` for durable updates, and load local knowledge in this order:

```text
<project>/.teochew-people → ~/.teochew-people → bundled public wiki
```

It must explicitly forbid private overlays from silently overriding sourced public facts.

- [ ] **Step 4: Add bootstrap indexes and vault templates**

Indexes must state that they are generated by `scripts/build-index.mjs`. The local profile template contains only explicit fields: `home_region`, `languages`, `writing_preferences`, `audiences`, and `notes`, all initially blank.

- [ ] **Step 5: Add placeholder category index pages only where needed to turn the structural test green**

Create one valid, schema-compliant `index.md` page in each required wiki category. Mark it `page_type: category-index`, not as cultural knowledge. These pages will be replaced or supplemented during migration.

- [ ] **Step 6: Confirm the validator now fails only on missing scripts or expected content checks**

Run: `npm run validate`  
Expected: FAIL on `scripts/wiki-lib.mjs` or the next unimplemented contract, not on purpose/schema/operation files.

## Task 4: Implement and test zero-dependency wiki maintenance tools

**Files:**
- Create: `skills/teochew-people-skill/scripts/wiki-lib.mjs`
- Create: `skills/teochew-people-skill/scripts/build-index.mjs`
- Create: `skills/teochew-people-skill/scripts/lint-wiki.mjs`
- Create: `skills/teochew-people-skill/scripts/wiki-status.mjs`
- Create: `skills/teochew-people-skill/scripts/init-vault.mjs`
- Create: `tests/wiki-tools.test.mjs`
- Modify: `package.json`

- [ ] **Step 1: Write failing Node tests**

Use `node:test`, `node:assert/strict`, `node:os`, `node:path`, and `node:fs/promises`. Cover:

1. `parseFrontmatter()` parses strings, booleans, numbers and JSON-style arrays.
2. `buildIndexes()` sorts by category and title and excludes category `index.md` pages.
3. `lintWiki()` reports duplicate IDs, broken `source_ids`, broken related links, missing required metadata, invalid source tiers, C-only core claims and stale event pages.
4. `initVault()` creates a new vault.
5. A second `initVault()` call does not overwrite a modified `profile.md`.
6. `wikiStatus()` returns source, page, category, stale and orphan counts.

Run: `node --test tests/wiki-tools.test.mjs`  
Expected: FAIL with `ERR_MODULE_NOT_FOUND` for `wiki-lib.mjs`.

- [ ] **Step 2: Implement `wiki-lib.mjs`**

Export exactly:

```javascript
export function parseFrontmatter(text) {}
export async function collectMarkdown(root) {}
export async function buildIndexes(skillRoot, options = {}) {}
export async function lintWiki(skillRoot, options = {}) {}
export async function initVault({ target, templateRoot, force = false }) {}
export async function wikiStatus(skillRoot, options = {}) {}
```

Use only Node standard-library modules. Frontmatter accepts the controlled subset documented in `wiki-schema.md`; unsupported nested YAML must produce a clear validation error instead of being guessed.

- [ ] **Step 3: Implement CLI wrappers**

Each wrapper resolves the skill root relative to `import.meta.url`, supports `--json` where meaningful, prints actionable failures to stderr, and exits nonzero on lint or initialization errors. `build-index.mjs` supports `--check`, which compares generated content without writing.

- [ ] **Step 4: Update npm scripts**

Set:

```json
{
  "scripts": {
    "install:codex": "node scripts/install-skill.mjs --codex --force",
    "install:claude": "node scripts/install-skill.mjs --claude --force",
    "wiki:index": "node skills/teochew-people-skill/scripts/build-index.mjs",
    "wiki:index:check": "node skills/teochew-people-skill/scripts/build-index.mjs --check",
    "wiki:lint": "node skills/teochew-people-skill/scripts/lint-wiki.mjs",
    "wiki:status": "node skills/teochew-people-skill/scripts/wiki-status.mjs",
    "test:unit": "node --test tests/*.test.mjs",
    "validate": "pwsh -NoProfile -ExecutionPolicy Bypass -File scripts/validate-skill.ps1",
    "test": "npm run test:unit && npm run wiki:index:check && npm run wiki:lint && npm run validate",
    "pack:check": "npm pack --dry-run"
  }
}
```

- [ ] **Step 5: Run tests and make them pass**

Run: `npm run test:unit`  
Expected: all six wiki-tool behaviors PASS.

- [ ] **Step 6: Commit the engine foundation**

```powershell
git add scripts/validate-skill.ps1 package.json tests/wiki-tools.test.mjs skills/teochew-people-skill
git commit -m "feat: add Teochew LLM wiki foundation"
```

## Task 5: Convert current sources into immutable raw records

**Files:**
- Create: `skills/teochew-people-skill/raw/YYYY-MM-DD/*.md`
- Regenerate: `skills/teochew-people-skill/raw/index.md`
- Modify: `skills/teochew-people-skill/wiki-log.md`

- [ ] **Step 1: Verify every existing URL live**

Start with every source currently listed in `references/90-资料来源.md`. Treat every link as a candidate, not an accepted source. For each URL record HTTP availability, authoritative publisher, publication date if available, access date, geographic scope, topic scope, directness, independence, likely bias and whether the source directly supports the existing claim.

Use primary sources for technical and official-status claims. Replace broken links with the publisher's canonical page or an official archive when available. Do not infer publication dates that the page does not expose.

- [ ] **Step 2: Apply the source-admission matrix before ingesting**

Score each candidate on authority, direct support, regional fit, temporal fit, independence and identifiable editorial purpose. Assign `A`, `B`, `C` or `Reject` using `wiki-schema.md`. Write every decision and reason to `raw/source-review.md`.

Reject unattributed reposts, marketing pages presented as neutral history, pages that merely repeat the claim, and sources whose geographic scope does not match the topic. Keep a C source only when it adds a clearly bounded lived-experience example.

- [ ] **Step 3: Create one raw record per retained source**

Use stable IDs based on publisher, topic and year. Each record contains only a concise source summary, directly supported facts, limitations, short compliant excerpts when useful, and conflict notes.

Required initial coverage:

- Scope and language: Guangdong local chronicles plus overseas Teochew institutions.
- Customs and festivals: official/local-history sources for 出花园、行彩桥、营老爷、七样羹 and ancestor observance.
- Food and tea: official/local-history or museum sources for 工夫茶、潮州菜 and 粿品.
- Arts: official cultural sources for 潮剧、英歌、潮州音乐 and crafts.
- Diaspora and social organization: archives or institutional sources for 侨批、善堂、侨乡 and associations.
- Current cases: dated official or reputable reports for the retained 2026 cultural examples.

- [ ] **Step 4: Generate and check the raw index**

Run: `npm run wiki:index`  
Then: `npm run wiki:index:check`  
Expected: index regenerated once, then check passes with no diff.

- [ ] **Step 5: Lint source records**

Run: `npm run wiki:lint`  
Expected at this stage: source records valid, every indexed source has an accepted quality tier, and no rejected candidate appears in the index; topic-page warnings may remain until migration.

- [ ] **Step 6: Commit the initial source corpus**

```powershell
git add skills/teochew-people-skill/raw skills/teochew-people-skill/wiki-log.md
git commit -m "content: add source-grounded Teochew raw corpus"
```

## Task 6: Research and resolve Issue #1 as the reference implementation

**Files:**
- Create: new raw source records under `skills/teochew-people-skill/raw/YYYY-MM-DD/`
- Create: `skills/teochew-people-skill/wiki/customs/拜老爷.md`
- Create: `skills/teochew-people-skill/wiki/customs/营老爷.md`
- Create or update: `skills/teochew-people-skill/wiki/customs/地方神明.md`
- Modify: related custom, festival and writing-guide pages
- Modify: `skills/teochew-people-skill/wiki-log.md`

- [ ] **Step 1: Run a deliberately broad and adversarial research pass**

Search these angles separately:

- `潮汕 拜老爷 地方志`
- `潮汕 民间信仰 老爷 学术`
- `潮州 营老爷 游神 官方`
- `汕头 拜老爷 民俗`
- `揭阳 老爷 民俗`
- `潮汕 拜老爷 现代变化`
- criticism or evidence against treating 拜老爷 as a uniform regional practice.

Prefer government, local chronicles, museums, academic publications and institutional records. Use media or community accounts only for dated lived-experience examples.

- [ ] **Step 2: Save selected sources before writing conclusions**

Each material claim in the three pages must cite at least one admitted raw source ID. Stable definitions and scope claims require one A source or two independent direct B sources. Claims about the breadth of a practice, historical origin or regional uniformity require deliberately searching for counterexamples and using an explicit `varies`/`unknown` label whenever the evidence does not converge.

- [ ] **Step 3: Write the three pages using the approved schema**

The `拜老爷` page must distinguish household/temple acts of respect from organized processions. The `营老爷` page must describe community procession and festival contexts without prescribing a route or ritual. `地方神明` must explain the local naming boundary without claiming a universal deity list.

- [ ] **Step 4: Add retrieval and safety links**

Link the pages to 春节元宵、家庭礼俗、祭祖、庙会、英歌、潮剧 and the writing guide. Add explicit warnings against unified offering lists, directions, incantations and taboo checklists.

- [ ] **Step 5: Run the first two behavior scenarios with the new pages**

Use fresh validation agents with only the updated skill and prompts. Expected GREEN: both prompts satisfy every `must` and none of the `must_not` properties.

- [ ] **Step 6: Run index and lint checks**

Run: `npm run wiki:index && npm run wiki:lint`  
Expected: no broken source or related-page link from the Issue #1 pages.

- [ ] **Step 7: Commit Issue #1 content**

```powershell
git add skills/teochew-people-skill/raw skills/teochew-people-skill/wiki skills/teochew-people-skill/wiki-log.md
git commit -m "content: add source-grounded 拜老爷 knowledge"
```

## Task 7: Migrate and expand the full topic wiki

**Files:**
- Create or rewrite pages under all `skills/teochew-people-skill/wiki/*/`
- Delete after migration: `skills/teochew-people-skill/references/`
- Regenerate: `skills/teochew-people-skill/wiki/index.md`
- Modify: `skills/teochew-people-skill/wiki-log.md`

- [ ] **Step 1: Create the durable concept and place pages**

Required pages:

```text
concepts/潮汕文化圈.md
concepts/潮州-潮汕-潮人.md
concepts/Teochew英文表达.md
places/汕头.md
places/潮州.md
places/揭阳.md
places/潮阳潮南.md
places/普宁惠来揭西.md
places/海外潮人社群.md
```

- [ ] **Step 2: Create customs and festival pages**

Required pages:

```text
customs/出花园.md
customs/拜老爷.md
customs/营老爷.md
customs/地方神明.md
customs/祭祖.md
customs/婚嫁.md
customs/家庭礼数.md
customs/春节与元宵.md
customs/七样羹.md
customs/行彩桥.md
customs/清明与冬至.md
```

- [ ] **Step 3: Create food, language, arts and architecture pages**

Required pages:

```text
food/工夫茶.md
food/潮汕菜与潮州菜.md
food/粿品.md
food/牛肉饮食.md
arts-language/潮汕话.md
arts-language/潮剧.md
arts-language/英歌.md
arts-language/潮州音乐与歌册.md
arts-language/工艺与建筑.md
```

- [ ] **Step 4: Create diaspora, organization and contemporary pages**

Required pages:

```text
society-diaspora/侨乡.md
society-diaspora/侨批.md
society-diaspora/善堂.md
society-diaspora/祠堂与宗亲.md
society-diaspora/当代潮汕.md
people-organizations/新加坡潮州八邑会馆.md
people-organizations/义安公司.md
```

- [ ] **Step 5: Rewrite guide pages**

Required pages:

```text
guides/事实与来源口径.md
guides/写作口径.md
guides/审校清单.md
guides/写作模板.md
guides/常用词库.md
guides/任务示例.md
```

Every cultural page follows the nine-section schema and cites raw source IDs. Guides may cite cultural pages instead of duplicating their facts.

- [ ] **Step 6: Migrate live 2026 cases into dated event pages**

Verify the event dates and current status live before writing. Keep the existing film case only if current sources remain accessible and mutually consistent. Add no more than three high-signal current cases; each must link to a durable topic and be clearly date-bounded.

- [ ] **Step 7: Delete the obsolete flat references only after coverage comparison**

Compare every heading and unique term from `references/00-09` against the new wiki. Record the coverage result in `wiki-log.md`, then delete the old directory in one commit. Do not delete the old files before the comparison passes.

- [ ] **Step 8: Generate indexes and run content lint**

Run: `npm run wiki:index && npm run wiki:index:check && npm run wiki:lint`  
Expected: zero missing source IDs, broken links, duplicate page IDs, stale unresolved event pages or orphaned knowledge pages.

- [ ] **Step 9: Commit the full migration**

```powershell
git add skills/teochew-people-skill
git commit -m "content: migrate Teochew knowledge into topic wiki"
```

## Task 8: Implement durable local personalization and safe installation

**Files:**
- Modify: `tests/wiki-tools.test.mjs`
- Modify: `skills/teochew-people-skill/scripts/wiki-lib.mjs`
- Modify: `skills/teochew-people-skill/scripts/init-vault.mjs`
- Modify: `scripts/install-skill.mjs`
- Modify: `skills/teochew-people-skill/operations/evolve.md`
- Modify: `.gitignore`

- [ ] **Step 1: Add failing installer and vault-upgrade tests**

Add tests for:

- global vault resolution from an explicit test directory.
- project overlay initialization.
- preserving a modified profile and local wiki page during forced skill reinstall.
- refusing to write outside the resolved target.
- printing a dry-run plan without creating directories.

Run: `npm run test:unit`  
Expected: FAIL on the new installer/vault requirements.

- [ ] **Step 2: Add installer flags**

Support:

```text
--init-vault              initialize the global user vault
--vault <dir>             choose another user vault directory
--init-project <dir>      initialize a project overlay
--no-vault                install only the public skill
```

The default installation remains skill-only unless `--init-vault` is passed. A forced skill reinstall replaces only the installed public skill directory, never the separately resolved vault.

- [ ] **Step 3: Add overlay ignore guidance**

Add `.teochew-people/` to the repository `.gitignore`. The initializer writes a local `.gitignore` that ignores all overlay content by default and contains a comment explaining how a user may intentionally version it.

- [ ] **Step 4: Make unit tests pass**

Run: `npm run test:unit`  
Expected: all index, lint, status, vault and installer tests PASS.

- [ ] **Step 5: Manually verify install safety in a temporary directory**

Run the installer with `--dest`, `--init-vault`, edit the resulting profile, reinstall with `--force`, and confirm the edit remains. Resolve and print the exact temporary paths before cleanup.

- [ ] **Step 6: Commit personalization support**

```powershell
git add .gitignore scripts/install-skill.mjs tests/wiki-tools.test.mjs skills/teochew-people-skill
git commit -m "feat: add safe personalized Teochew vaults"
```

## Task 9: Re-run the full behavior suite and close skill gaps

**Files:**
- Modify as needed: `skills/teochew-people-skill/SKILL.md`
- Modify as needed: `skills/teochew-people-skill/operations/*.md`
- Modify as needed: topic or guide pages
- Temporary evidence only: `tmp/behavior-green/`

- [ ] **Step 1: Run all six scenarios with fresh validation agents**

Do not show validators the expected answer or the baseline failures. Give only the installed updated skill and one scenario prompt.

- [ ] **Step 2: Score exact rubric properties**

Save response and rubric evidence under `tmp/behavior-green/`. Every `must` property must be present and every `must_not` property absent.

- [ ] **Step 3: Refactor only where a scenario exposes a genuine gap**

Prefer improving routing, schema or one relevant page. Do not add broad duplicated instructions to SKILL.md.

- [ ] **Step 4: Re-run failed scenarios until green**

Expected: 6/6 scenarios pass.

- [ ] **Step 5: Commit behavioral corrections**

```powershell
git add skills/teochew-people-skill tests/skill-scenarios.json
git commit -m "fix: harden Teochew wiki retrieval behavior"
```

Do not commit validation-agent transcripts unless the user explicitly asks for them.

## Task 10: Generate the new hero and rebuild the visual system

**Files:**
- Create: `assets/hero-background.png`
- Create: `assets/hero.svg`
- Replace: `assets/social-preview.png`
- Modify: `assets/case-demo.svg`

- [ ] **Step 1: Generate the text-free epic background**

Use the built-in image generation tool with this production prompt:

```text
Use case: ads-marketing
Asset type: GitHub repository hero background
Primary request: an epic but restrained cinematic landscape expressing the wider Teochew / Chaoshan cultural world
Scene/backdrop: the meeting of dark tidal sea, distant coastal mountains, layered traditional Chaoshan roof ridges, warm lights across a settlement, and a subtle sense of routes continuing overseas
Style/medium: premium cinematic editorial illustration with realistic architectural texture, atmospheric depth, and restrained historical gravitas
Composition/framing: 16:9 panoramic composition; large calm negative-space band through the center for one title; architecture and lights concentrated toward the lower and outer edges; readable when cropped to a GitHub social preview
Lighting/mood: pre-dawn blue hour moving toward warm horizon light; monumental, quiet, enduring, not fantasy spectacle
Color palette: deep tide blue, night-sea teal, mineral cinnabar accents, warm lamp gold, salt white
Text (verbatim): no text in the generated image
Constraints: represent a wider cultural landscape rather than one city; no logos; no watermark; no deity statue; no ritual altar; no tea set collage; no lion dance mascot; no flags; no UI labels
Avoid: tourist-poster collage, cyberpunk neon, generic Chinese palace architecture, excessive red and gold, busy central subjects, legible generated text
```

Inspect the output. If it violates a constraint, make one targeted iteration. Save the selected final as `assets/hero-background.png`.

- [ ] **Step 2: Compose exact typography in SVG**

Create a 1600×900 `assets/hero.svg` that references the background and applies a dark accessibility veil. The only visible text is:

```text
TEOCHEW PEOPLE
```

Use an oversized, widely tracked display treatment in salt white, centered optically. No subtitle, Chinese title, badge, icon, button or decorative copy.

- [ ] **Step 3: Export the social preview**

Render the SVG to a 1600×900 PNG using the bundled workspace rendering runtime. Save as `assets/social-preview.png`. Verify the raster contains the exact title and no other text.

- [ ] **Step 4: Restyle the case demo**

Update `assets/case-demo.svg` to the same palette and quieter typography. Keep its before/after instructional content, but remove decorative clutter and any visual treatment competing with the hero.

- [ ] **Step 5: Inspect all visual assets**

Use image inspection on the background and social preview. Render or screenshot the case demo. Check title spelling, contrast, mobile-scale readability, crop safety and absence of prohibited motifs.

- [ ] **Step 6: Commit the visual system**

```powershell
git add assets/hero-background.png assets/hero.svg assets/social-preview.png assets/case-demo.svg
git commit -m "design: introduce epic TEOCHEW PEOPLE identity"
```

## Task 11: Rewrite all product, contributor and package copy

**Files:**
- Rewrite: `README.md`
- Rewrite: `CONTRIBUTING.md`
- Rewrite: `skills/README.md`
- Rewrite: `examples/before-after.md`
- Modify: `docs/github-workflows.md`
- Modify: `docs/publishing.md`
- Modify: `skills/teochew-people-skill/agents/openai.yaml`
- Modify: `package.json`
- Modify: `package-lock.json`

- [ ] **Step 1: Rewrite README from the reader's perspective**

Use `assets/social-preview.png` as the opening image. Below it, use this exact section order:

1. one-paragraph product definition.
2. `为什么它不是普通资料合集`.
3. `它如何持续成长` with ingest/query/research/evolve/lint.
4. `知识如何保持全面和客观`.
5. `个性化如何工作`.
6. `快速安装`.
7. `使用示例`.
8. `知识结构`.
9. `贡献资料与主题页`.
10. `验证、版本与许可证`.

Do not repeat hero slogans or feature badges. Use real wiki filenames and current commands.

- [ ] **Step 2: Rewrite contributor guidance around source-first changes**

Require contributors to add or identify raw sources before changing a factual topic page; explain evidence states, local variation, current-event dating, copyright limits, index/lint commands and Issue #1 as a model contribution.

- [ ] **Step 3: Update examples and skill metadata**

Examples must include the 拜老爷/营老爷 distinction, a current-event verification example, and a local-personalization example. `agents/openai.yaml` must describe a source-grounded, evolving Teochew People wiki without claiming fully autonomous truth.

- [ ] **Step 4: Set the next feature version**

Set `package.json` and `package-lock.json` to `0.2.0`. Update the package description and keywords to include `llm-wiki`, `knowledge-base`, `潮汕文化`, `Teochew`, and `source-grounded`. Do not publish the version in this task.

- [ ] **Step 5: Update workflow and publishing docs**

Document `npm run wiki:index:check`, `npm run wiki:lint`, `npm test`, visual assets in the package, and the rule that publishing must never include a user's `~/.teochew-people` or project overlay.

- [ ] **Step 6: Commit documentation and metadata**

```powershell
git add README.md CONTRIBUTING.md skills/README.md examples docs package.json package-lock.json skills/teochew-people-skill/agents/openai.yaml
git commit -m "docs: relaunch Teochew People as an evolving LLM wiki"
```

## Task 12: Run full verification and prepare the GitHub issue update

**Files:**
- Modify only if verification finds defects
- No release or merge without a separate user instruction

- [ ] **Step 1: Run deterministic verification**

```powershell
npm run test:unit
npm run wiki:index:check
npm run wiki:lint
npm run validate
npm test
npm run pack:check
git diff --check origin/main...HEAD
```

Expected: every command exits `0`; dry-run package contains the public skill, raw corpus, wiki pages, operation docs, maintenance scripts and visual/docs assets, but no `.teochew-people` vault.

- [ ] **Step 2: Test both install targets in temporary directories**

Install with `--codex` equivalent custom destination and `--claude` equivalent custom destination. Verify SKILL.md, wiki, raw, operations and scripts are copied. Initialize a separate vault, modify it, force reinstall, and confirm no overwrite.

- [ ] **Step 3: Perform visual verification**

Inspect `assets/social-preview.png`, render `assets/case-demo.svg`, and verify README image links. Confirm the hero shows only `TEOCHEW PEOPLE`.

- [ ] **Step 4: Run a comprehensive code/content review**

Review source admission decisions, source trust boundaries, path confinement, installer overwrite safety, content objectivity, stale-event handling, link integrity, copyright exposure and public/private separation. Sample core claims and confirm their source tier and direct support. Fix all material findings and repeat relevant verification.

- [ ] **Step 5: Review branch history and working tree**

Run:

```powershell
git status --short --branch
git log --oneline --decorate origin/main..HEAD
git diff --stat origin/main...HEAD
```

Expected: clean working tree and intentional, reviewable commits.

- [ ] **Step 6: Draft the exact Issue #1 update without posting yet**

The draft must state:

- where `拜老爷.md`, `营老爷.md` and their raw sources live.
- how the concepts are distinguished.
- what validation was run.
- which branch/commit contains the change.
- that the wider repository was upgraded to a source-grounded LLM Wiki.

Restate the exact target `oOtiti/teochew-people-skill#1` to the user before posting or closing it. Do not push, open a PR, merge, publish npm, comment on the issue or close it without the corresponding user authorization.
