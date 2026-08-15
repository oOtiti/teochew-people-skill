# 《给阿嬷的情书》研究与 Review 包 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 建立《给阿嬷的情书》专题的 Skill 行为基线、媒体证据契约和来源／样稿 review 包，让用户在最终 raw、topic、图文和视频脚本写入前核对真实背景。

**Architecture:** 本计划是两期实施中的第一期。行为场景和媒体字段先走 RED—GREEN；文化资料则先在独立研究包中完成 canonical、独立性、直接性、权利状态和论断边界审查，不提前进入公共 raw/topic。用户 review 后另写第二期计划，届时已知最终来源 ID、topic 和资产清单，可以给出完全确定的文件级实施步骤。

**Tech Stack:** Markdown、JSON、Node.js 18+、`node:test`、零依赖 Wiki 工具、PowerShell、Git、实时网页核验。

---

## File structure

### Create

- `docs/superpowers/evidence/2026-08-15-letter-to-grandma-skill-baseline.md`：保存现有 Skill 在电影图文与视频入库任务上的原始行为、评分和具体缺口。
- `docs/superpowers/research/2026-08-15-letter-to-grandma-source-dossier.md`：候选来源、准入建议、权利状态、可支持／不可支持论断及媒体时间码清单。
- `docs/superpowers/research/2026-08-15-letter-to-grandma-review-draft.md`：文章大纲、关键段落样稿、视觉清单、60 秒与约 3 分钟视频梗概，以及需要用户核对的真实背景问题。

### Modify

- `tests/skill-scenarios.json`：增加电影多媒体写作和视频转 Wiki 两个行为场景。
- `scripts/validate-scenarios.mjs`：从固定七场景升级为至少九场景，并锁定两个新场景 ID。
- `tests/wiki-tools.test.mjs`：增加媒体 source 字段的失败用例。
- `skills/teochew-people-skill/scripts/wiki-lib.mjs`：校验媒体类型、权利状态、转录状态、时长和时间码范围。
- `skills/teochew-people-skill/wiki-schema.md`：文档化与实现一致的媒体 source 可选字段。

### Deliberately unchanged in Phase 1

- `skills/teochew-people-skill/SKILL.md`
- `skills/teochew-people-skill/raw/`
- `skills/teochew-people-skill/wiki/`
- `README.md`
- `examples/`
- `assets/`

这些文件在用户 review 后进入第二期，保证 Skill 的 GREEN 修改、公共事实、演示文稿和视觉资产都基于已确认的研究输入。

## Task 1: Capture the current Skill’s RED behavior

**Files:**

- Create: `docs/superpowers/evidence/2026-08-15-letter-to-grandma-skill-baseline.md`
- Read: `skills/teochew-people-skill/SKILL.md`
- Read: `skills/teochew-people-skill/wiki/current-events/给阿嬷的情书-2026.md`
- Read: `skills/teochew-people-skill/operations/ingest.md`

- [ ] **Step 1: Record the unmodified commit**

Run:

```powershell
git rev-parse HEAD
git status --short
```

Expected: the commit is the Phase 1 plan commit and the worktree is clean. Save the commit hash in the evidence file so the baseline can be reproduced.

- [ ] **Step 2: Run the film-feature pressure scenario without changing the Skill**

Use a fresh validation agent with only the public skill path and this task prompt:

```text
使用 D:/code/Project/潮汕人/.worktrees/llm-wiki-implementation/skills/teochew-people-skill，写一篇《给阿嬷的情书》图文专题的详细提纲，并说明每幅图应从哪里来。把电影事实、潮汕历史事实、主创说法和创意图像分开；如果资料不足也请直接完成，不要向用户追问。
```

Do not provide the design spec, intended fixes or expected answer. Capture the response verbatim.

- [ ] **Step 3: Run the video-ingest pressure scenario without changing the Skill**

Use a second fresh validation agent with only the public skill path and this task prompt:

```text
使用 D:/code/Project/潮汕人/.worktrees/llm-wiki-implementation/skills/teochew-people-skill，把一条官方发布的《给阿嬷的情书》公开视频转成 Wiki 来源，并派生 60 秒脚本。请自行说明要保存哪些视频、转录和时间码信息，以及版权不清楚时怎么处理。
```

Again, capture the response verbatim and do not reveal the desired workflow.

- [ ] **Step 4: Score the baseline against a fixed rubric**

The evidence file must contain the two prompts, full outputs and a table with these ten binary checks:

```markdown
| Check | Feature output | Video-ingest output |
| --- | --- | --- |
| Distinguishes film facts from historical facts | pass/fail | pass/fail |
| Attributes creator statements | pass/fail | pass/fail |
| Separates licensed, link-only and original visuals | pass/fail | pass/fail |
| Avoids copying film stills, dialogue and music | pass/fail | pass/fail |
| Preserves unknown and asks for local review | pass/fail | pass/fail |
| Records publisher, URL and publication date | pass/fail | pass/fail |
| Records media type and rights status | pass/fail | pass/fail |
| Uses speaker plus timecode for video claims | pass/fail | pass/fail |
| Treats frame observation as limited evidence | pass/fail | pass/fail |
| Avoids full transcript retention without permission | pass/fail | pass/fail |
```

Each failed row must quote the exact omission or rationalization. This is the required RED evidence for later editing `SKILL.md`; do not change the Skill in Phase 1.

- [ ] **Step 5: Commit the baseline evidence**

Run:

```powershell
git add -- docs/superpowers/evidence/2026-08-15-letter-to-grandma-skill-baseline.md
git diff --cached --check
git commit -m "test: capture multimedia skill baseline"
```

Expected: one evidence file is committed; no public Skill or Wiki file changes.

## Task 2: Add multimedia behavior scenario contracts

**Files:**

- Modify: `tests/skill-scenarios.json`
- Modify: `scripts/validate-scenarios.mjs`

- [ ] **Step 1: Add the two scenario fixtures first**

Append these exact objects to `tests/skill-scenarios.json`:

```json
{
  "id": "letter-to-grandma-multimedia-feature",
  "prompt": "使用这个 skill，为《给阿嬷的情书》准备一篇图文专题。电影公开事实、主创说法、侨批历史和创意图片必须分开，并列出需要我核对的家庭背景。",
  "must": [
    "区分电影事实与历史事实",
    "主创说法明确归因",
    "图片标注授权或原创示意",
    "保留用户背景 review 项",
    "关键内容可回溯 topic 和 raw"
  ],
  "must_not": [
    "把剧情当档案",
    "未经授权复制电影剧照台词或音乐",
    "把家庭经验自动写入公共 wiki"
  ]
},
{
  "id": "video-source-to-wiki",
  "prompt": "把一条潮汕文化公开视频转为 Wiki 来源，再派生短视频脚本。说明时间码、说话者、画面观察、版权和未知内容怎么记录。",
  "must": [
    "登记发布者 URL 日期和媒体类型",
    "记录权利状态",
    "事实绑定说话者或时间码",
    "画面观察不外推为普遍事实",
    "完整转录仅在许可允许时保存"
  ],
  "must_not": [
    "下载并提交权利不明原视频",
    "把自动转录直接写成稳定事实",
    "用无时间码画面支撑历史结论"
  ]
}
```

- [ ] **Step 2: Run the validator and verify RED**

Run:

```powershell
npm run test:scenarios
```

Expected: FAIL with `exactly seven scenarios are required`. If it passes, the new fixtures were not loaded and the test setup must be corrected before continuing.

- [ ] **Step 3: Make the minimal validator change**

Replace the fixed-count assertion in `scripts/validate-scenarios.mjs`:

```js
assert.ok(fixture.scenarios.length >= 9, 'at least nine scenarios are required');
```

After the existing loop, add:

```js
for (const requiredId of [
  'letter-to-grandma-multimedia-feature',
  'video-source-to-wiki',
]) {
  assert.ok(ids.has(requiredId), `missing required multimedia scenario: ${requiredId}`);
}
```

- [ ] **Step 4: Run the validator and verify GREEN**

Run:

```powershell
npm run test:scenarios
```

Expected: `Behavior scenarios valid: 9`.

- [ ] **Step 5: Commit the scenario contract**

Run:

```powershell
git add -- tests/skill-scenarios.json scripts/validate-scenarios.mjs
git diff --cached --check
git commit -m "test: define multimedia wiki scenarios"
```

## Task 3: Add media-source metadata validation with TDD

**Files:**

- Modify: `tests/wiki-tools.test.mjs`
- Modify: `skills/teochew-people-skill/scripts/wiki-lib.mjs`
- Modify: `skills/teochew-people-skill/wiki-schema.md`

- [ ] **Step 1: Let the source fixture accept additional frontmatter**

Change the `sourcePage` helper signature in `tests/wiki-tools.test.mjs` to:

```js
function sourcePage({
  id,
  title,
  tier = "A",
  url = "https://example.test/source",
  status = "",
  extra = "",
}) {
  const statusLine = status ? `source_status: ${status}\n` : "";
  return `---\nid: ${id}\ntitle: ${title}\npage_type: source\nsource_tier: ${tier}\nsource_url: ${url}\npublisher: Example Publisher\naccessed: 2026-08-01\n${statusLine}${extra}---\nSource notes.\n`;
}
```

- [ ] **Step 2: Write the failing media-source test**

Add this test immediately after the existing lint test:

```js
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
  const codes = new Set(result.issues.map(({ code }) => code));

  for (const code of [
    "missing-media-metadata",
    "invalid-media-type",
    "invalid-rights-status",
    "invalid-transcript-status",
    "invalid-timecode-scope",
  ]) {
    assert.equal(codes.has(code), true, `expected lint issue ${code}`);
  }
  assert.equal(result.issues.some(({ file }) => file.endsWith("valid-video.md")), false);
});
```

- [ ] **Step 3: Run the focused test and verify RED**

Run:

```powershell
node --test --test-name-pattern="media source evidence" tests/wiki-tools.test.mjs
```

Expected: FAIL at `expected lint issue missing-media-metadata` because the linter does not yet implement the media contract.

- [ ] **Step 4: Add controlled media values**

Add these constants beside `SOURCE_TIERS` in `wiki-lib.mjs`:

```js
const MEDIA_TYPES = new Set(["video", "audio", "image"]);
const RIGHTS_STATUSES = new Set(["official_or_licensed", "link_only", "editorial_original"]);
const TRANSCRIPT_STATUSES = new Set(["verified_excerpt", "partial", "unavailable"]);
const MEDIA_DURATION_PATTERN = /^\d{2}:\d{2}:\d{2}$/;
const TIMECODE_SCOPE_PATTERN = /^\d{2}:\d{2}:\d{2}-\d{2}:\d{2}:\d{2}$/;
```

- [ ] **Step 5: Add source-record validation**

Inside the `record.pageType === "source"` branch, after `source_status` validation and before `continue`, add:

```js
if (record.media_type !== undefined) {
  const missing = requiredFields(record, ["rights_status"]);
  if (["video", "audio"].includes(record.media_type)) {
    missing.push(...requiredFields(record, ["media_duration", "transcript_status"]));
  }
  if (record.transcript_status && record.transcript_status !== "unavailable") {
    missing.push(...requiredFields(record, ["timecode_scope"]));
  }
  if (missing.length) {
    issues.push(issue("missing-media-metadata", record.relative, `Missing: ${[...new Set(missing)].join(", ")}`));
  }
  if (!MEDIA_TYPES.has(record.media_type)) {
    issues.push(issue("invalid-media-type", record.relative, `Media type must be video, audio, or image; received '${record.media_type}'`));
  }
  if (!RIGHTS_STATUSES.has(record.rights_status)) {
    issues.push(issue("invalid-rights-status", record.relative, `Unknown rights status '${record.rights_status}'`));
  }
  if (record.transcript_status && !TRANSCRIPT_STATUSES.has(record.transcript_status)) {
    issues.push(issue("invalid-transcript-status", record.relative, `Unknown transcript status '${record.transcript_status}'`));
  }
  if (record.media_duration && !MEDIA_DURATION_PATTERN.test(record.media_duration)) {
    issues.push(issue("invalid-media-duration", record.relative, `Invalid media duration '${record.media_duration}'`));
  }
  if (record.timecode_scope && !TIMECODE_SCOPE_PATTERN.test(record.timecode_scope)) {
    issues.push(issue("invalid-timecode-scope", record.relative, `Invalid timecode scope '${record.timecode_scope}'`));
  }
}
```

The invalid fixture omits `media_duration`, so the same record must report both `missing-media-metadata` and the four invalid-value codes asserted by the test.

- [ ] **Step 6: Run focused and full unit tests**

Run:

```powershell
node --test --test-name-pattern="media source evidence" tests/wiki-tools.test.mjs
npm run test:unit
```

Expected: focused test PASS; full unit suite PASS with one additional test.

- [ ] **Step 7: Document the exact schema**

Add a `## 媒体来源字段` section to `wiki-schema.md` with this contract:

```markdown
## 媒体来源字段

来源页指向视频、音频或图片时增加 `media_type`，值为 `video`、`audio` 或 `image`，并必须设置 `rights_status`：

- `official_or_licensed`：原发布者明确许可，或项目已取得可随仓库分发的授权。
- `link_only`：只保存 URL、必要摘要与证据定位，不复制媒体文件。
- `editorial_original`：项目原创或 AI 辅助生成的示意，不得标成历史照片、电影剧照或现场记录。

视频和音频另需 `media_duration` 与 `transcript_status`。时长使用 `HH:MM:SS`；转录状态只允许 `verified_excerpt`、`partial`、`unavailable`。凡保留必要转录或准确转述，使用 `timecode_scope: HH:MM:SS-HH:MM:SS` 标出实际核验范围。完整转录只有在许可明确允许时才能进入公共仓库。

画面观察只能证明该媒体在相应时间码呈现了什么，不能单独证明起源、普遍性、人物身份或历史真实性。自动转录中的潮语、人名、地名和专有名词必须人工回听后才能进入稳定 topic。
```

- [ ] **Step 8: Run Wiki validation and commit**

Run:

```powershell
npm run test:unit
npm run wiki:lint
git diff --check
git add -- tests/wiki-tools.test.mjs skills/teochew-people-skill/scripts/wiki-lib.mjs skills/teochew-people-skill/wiki-schema.md
git commit -m "feat: validate media source evidence"
```

Expected: all commands PASS; commit contains only the three declared files.

## Task 4: Research and select the source dossier

**Files:**

- Create: `docs/superpowers/research/2026-08-15-letter-to-grandma-source-dossier.md`
- Read: `skills/teochew-people-skill/raw/source-review.md`
- Read: `skills/teochew-people-skill/raw/2026-08-15/national-film-letter-to-grandma-2026.md`
- Read: `skills/teochew-people-skill/raw/2026-08-15/yangcheng-letter-to-grandma-2026.md`
- Read: existing raw pages linked from `侨批.md`, `潮汕话.md`, `侨乡.md` and `海外潮人社群.md`

- [ ] **Step 1: Establish the evidence matrix before browsing**

At the top of the dossier, create rows for these seven evidence needs:

1. Film release, exhibition, symposium and production timeline.
2. Attributed creator research and artistic choices.
3. Qiaopi as archival and historical material.
4. Teochew language and local accent boundaries.
5. Shantou, Chaozhou, Jieyang and Southeast Asia geographic links.
6. Current reception, distribution and subsequent events with date cutoffs.
7. One replayable official video suitable for the media-ingest demonstration.

For each row state the acceptance rule before searching: one direct A or two independent direct B sources for stable facts; attributed creator statements can use a direct official record but remain attributed; current status requires same-day verification.

- [ ] **Step 2: Search in source-priority order**

For every evidence need, search in this order:

1. Film regulator, producer/distributor or named creator canonical page.
2. Archive, museum, government cultural institution or original collection catalogue.
3. Peer-reviewed paper or university repository containing the original paper.
4. Named, edited first-hand reporting.
5. Video on the original publisher’s account or site.

Use Wikipedia, Baidu, search snippets, aggregators and reposts only to discover canonical sources. Record them under Reject/defer when they materially influenced the search, but do not use them as evidence.

- [ ] **Step 3: Verify every candidate live**

Open each candidate page rather than relying on a search result. Record:

```markdown
| Candidate ID | Canonical URL | Publisher / creator | Published / event date | A/B/C/Reject | Independent of | Directly supports | Does not support | Media rights | Replay status | Decision reason |
```

Use final ASCII kebab-case IDs immediately for candidates recommended for admission. Do not create public raw files yet.

- [ ] **Step 4: Audit film-material rights**

For posters, stills, trailers, interviews and music, separately record:

- who owns or published the material;
- whether the page grants reuse or only viewing;
- whether embedding, downloading, cropping or redistribution is allowed;
- whether the repository should use `official_or_licensed` or `link_only`;
- what original editorial visual can replace it when reuse is unclear.

Absence of a copyright notice is not permission. Keep film assets `link_only` unless the right is explicit.

- [ ] **Step 5: Select one video candidate**

The video must have a clear original publisher, stable URL, publication date, visible duration and enough replayable content to identify at least three claims or observations. Record the exact timecode ranges, speakers, transcript confidence, language, and whether the material supports film facts, creator statements or only frame observations.

If no candidate meets all requirements, record a defer decision and recommend an official non-film cultural video for the method demonstration; do not lower the rights or replayability threshold.

- [ ] **Step 6: Write the decision summary**

End the dossier with:

- the recommended Admit set;
- the Reject/defer set and exact reasons;
- existing raw records that remain sufficient;
- claims still `unknown`;
- the exact user-background questions that sources cannot answer;
- the proposed final raw IDs, topic updates and visual units for Phase 2.

- [ ] **Step 7: Check links and internal consistency**

Reopen all recommended canonical URLs, ensure each proposed raw ID is unique against `raw/index.md`, and confirm no “A” classification is based only on a government host carrying a third-party article.

- [ ] **Step 8: Commit the source dossier**

Run:

```powershell
git add -- docs/superpowers/research/2026-08-15-letter-to-grandma-source-dossier.md
git diff --cached --check
git commit -m "research: select Letter to Grandma sources"
```

Expected: one research dossier is committed; public raw and topic counts remain unchanged.

## Task 5: Build the user-facing review draft

**Files:**

- Create: `docs/superpowers/research/2026-08-15-letter-to-grandma-review-draft.md`
- Read: `docs/superpowers/research/2026-08-15-letter-to-grandma-source-dossier.md`
- Read: `docs/superpowers/specs/2026-08-15-letter-to-grandma-multimedia-wiki-design.md`

- [ ] **Step 1: Write the article architecture**

Use these exact H2 sections:

```markdown
## 一封信，为何从阿嬷开始
## 侨批不是电影道具
## 家如何成为一种声音
## 三座城市与一条跨海路线
## 电影如何重构真实
## 仍需当地人回答的部分
```

Under each section, list the proposed argument, supporting source IDs, visual unit, evidence state and boundary. Do not include a factual sentence without naming its source ID in the same subsection.

- [ ] **Step 2: Draft four reviewable passages**

Write polished sample prose for:

1. The opening, using only verified film nodes and an explicitly editorial hook.
2. The qiaopi section, distinguishing archive from film device.
3. The language section, retaining local-accent limits.
4. The final “local people must answer” section, listing specific questions rather than manufacturing authenticity.

Every paragraph must end with source IDs or an evidence label. Do not quote more than 25 words from any one non-user source in the entire review draft.

- [ ] **Step 3: Specify the visual review board**

Create a table with 6—8 visual units and columns:

```markdown
| Unit | Narrative purpose | Proposed image | Evidence / source | Rights status | Alt text | User check |
```

The first unit is an original editorial hero; the remaining set must include a timeline, map, qiaopi object graphic, film/history/unknown layer diagram and cultural reference visuals. Film posters and stills stay `link_only` unless the dossier documents permission.

- [ ] **Step 4: Draft the 60-second structure**

Provide six timed blocks: `00:00–00:06`, `00:06–00:18`, `00:18–00:32`, `00:32–00:46`, `00:46–00:55`, `00:55–01:00`. Each row includes narration goal, shot, source ID, evidence label and rights status.

- [ ] **Step 5: Draft the three-minute structure**

Provide 8—10 blocks with narration purpose, map/archive/voice layer, source IDs, sound plan and rights status. Do not prescribe unlicensed film audio or simulated religious/family activity.

- [ ] **Step 6: Add a compact background-review questionnaire**

Ask only questions the public sources cannot resolve, grouped under:

- 家庭称谓与“阿嬷”的实际使用语境；
- 哪一地、哪一代和哪一条迁移路线；
- 影片呈现与生活经验相符／不符的细节；
- 可公开、需匿名、只用于内部校对的用户材料；
- 用户是否拥有可授权照片、信件、录音或视频。

State that unanswered questions remain `unknown`; they do not block the public-source portions.

- [ ] **Step 7: Run an evidence audit**

Search the draft for absolute language and replace unsupported forms:

```powershell
rg -n "潮汕人都|一定|唯一|真正的潮汕|完全真实|历史证明|家家户户|原汁原味" docs/superpowers/research/2026-08-15-letter-to-grandma-review-draft.md
```

Expected: no unqualified match. Any match inside a warning or quotation must be explicitly labelled and justified.

- [ ] **Step 8: Commit the review draft**

Run:

```powershell
git add -- docs/superpowers/research/2026-08-15-letter-to-grandma-review-draft.md
git diff --cached --check
git commit -m "docs: draft Letter to Grandma review package"
```

## Task 6: Verify Phase 1 and hand off the review package

**Files:**

- Verify: all Phase 1 files
- Do not modify: public raw, topic, Skill, README, examples or assets

- [ ] **Step 1: Run the complete repository suite**

Run:

```powershell
npm run wiki:index:check
npm run wiki:lint
npm test
npm run pack:check
git diff --check
git status --short --branch
```

Expected:

- indexes remain current;
- Wiki lint passes;
- nine behavior fixtures validate;
- the unit suite includes and passes the new media-source test;
- the package still excludes `docs/superpowers/` research and evidence files;
- worktree is clean.

- [ ] **Step 2: Audit Phase 1 scope**

Run:

```powershell
git diff --name-status de6b019..HEAD
```

Expected paths are limited to:

```text
docs/superpowers/evidence/2026-08-15-letter-to-grandma-skill-baseline.md
docs/superpowers/plans/2026-08-15-letter-to-grandma-research-review.md
docs/superpowers/research/2026-08-15-letter-to-grandma-source-dossier.md
docs/superpowers/research/2026-08-15-letter-to-grandma-review-draft.md
scripts/validate-scenarios.mjs
skills/teochew-people-skill/scripts/wiki-lib.mjs
skills/teochew-people-skill/wiki-schema.md
tests/skill-scenarios.json
tests/wiki-tools.test.mjs
```

- [ ] **Step 3: Present the review package**

Give the user direct links to the source dossier and review draft, then summarize:

- admitted and rejected source recommendations;
- the four sample passages;
- the 6—8 visual units;
- the two video structures;
- the exact background questions needing user knowledge.

Stop before changing public raw/topic/SKILL/README/examples/assets. The next user response supplies or confirms background; then create the second implementation plan with final source IDs and asset paths.

## Plan self-review

- **Spec coverage:** Phase 1 covers source selection, rights classification, video candidate selection, Skill RED evidence, media schema and the full user review package. The spec’s final raw/topic/SKILL/article/video/visual/homepage integration is intentionally deferred to Phase 2 after the mandated user review.
- **No placeholders:** Research outputs require actual canonical URLs, final candidate IDs, exact timecodes and actual decisions; the plan forbids placeholder rows and does not invent raw filenames before selection.
- **Type consistency:** `media_type`, `rights_status`, `media_duration`, `transcript_status` and `timecode_scope` use the same names and controlled values in the test, linter and schema steps.
- **TDD order:** scenario fixtures fail before validator changes; media lint test fails before implementation; existing Skill behavior is captured before any Skill edit.
