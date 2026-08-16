<p align="center">
  <img src="assets/social-preview.png" alt="TEOCHEW PEOPLE: a Teochew culture LLM Wiki" width="100%">
</p>

<h1 align="center">TEOCHEW PEOPLE</h1>

<p align="center">
  <strong>An evolving, personalized Teochew culture Skill and LLM Wiki</strong><br>
  Carefully selected sources become traceable topics and production-ready detail for writing, narration, and video.
</p>

<p align="center">
  <a href="https://github.com/oOtiti/teochew-people-skill/actions/workflows/ci.yml"><img alt="CI" src="https://github.com/oOtiti/teochew-people-skill/actions/workflows/ci.yml/badge.svg"></a>
  <a href="https://www.npmjs.com/package/teochew-people-skill"><img alt="npm" src="https://img.shields.io/npm/v/teochew-people-skill?logo=npm&label=npm"></a>
  <img alt="Node.js >=18" src="https://img.shields.io/badge/Node.js-%3E%3D18-339933?logo=nodedotjs&logoColor=white">
  <a href="LICENSE"><img alt="License MIT" src="https://img.shields.io/badge/License-MIT-f0a000.svg"></a>
  <img alt="Wiki 55 sources" src="https://img.shields.io/badge/Wiki-55_sources-136f63">
  <img alt="Topics 50" src="https://img.shields.io/badge/Topics-50-8f2d1e">
  <img alt="Categories 9" src="https://img.shields.io/badge/Categories-9-c79434">
  <img alt="Languages 4" src="https://img.shields.io/badge/Languages-4-3949ab">
</p>

<p align="center">
  <a href="README.md">简体中文</a> · <a href="README.zh-Hant.md">繁體中文</a> · <strong><a href="README.en.md">English</a></strong> · <a href="README.ja.md">日本語</a>
</p>

<p align="center">
  <a href="skills/teochew-people-skill/wiki/index.md"><strong>Explore the public Wiki</strong></a> ·
  <a href="examples/letter-to-grandma-feature.md">Read the illustrated feature</a> ·
  <a href="examples/letter-to-grandma-video-scripts.md">Open the video scripts</a> ·
  <a href="#install">Install</a>
</p>

## What it is

The public knowledge base contains 55 traceable raw sources, 50 topic pages, and 9 category indexes. Reviewed evidence makes the Wiki grow; audiences, family language, and editorial preferences improve personalization only with explicit consent—so it becomes more useful with use without turning a one-off answer or private experience into public truth.

This is not a static encyclopedia that dumps a whole folder into a model. [`raw/`](skills/teochew-people-skill/raw/index.md) records who published a source, its evidence tier, what it can support, production details, and limitations. [`wiki/`](skills/teochew-people-skill/wiki/index.md) turns admitted evidence into navigable topic pages while preserving place, period, family variation, and unknowns.

| Layer | Main content | How it improves with use |
| --- | --- | --- |
| Public Wiki | Geography, language, customs, food, arts, diaspora, organizations, and current events | New evidence is reviewed before entering raw and topic pages |
| Controlled evolution | `research → ingest → evolve → lint` | Only confirmed, reusable changes persist; ordinary conversations are not learned automatically |
| Personalization | Project and user local vaults | Explicitly approved audiences, examples, family usage, and tone refine output without replacing public facts |
| Production | Writing and video production, narration, shot lists, image/sound/action/object/space details, and timecodes | One evidence chain can drive drafting, editing, storyboarding, and review |

![An original editorial Yingge panorama](assets/yingge-epic.png)

<p align="center"><sub>Original editorial visual, not a specific performance. Costume, face paint, and movement do not represent one troupe or a universal ritual.</sub></p>

## Why raw and topic layers are separate

- `raw/` answers: who published this, when, and how far can the claim travel?
- `wiki/` answers: which topic should an agent read first, where does practice vary, and what remains unknown?
- Stable core claims need one direct A source or two independent, direct B sources.
- Wikipedia, Baidu Baike, and search snippets are research leads, not automatic core evidence.
- `verified`, `synthesis`, `varies`, and `unknown` are kept distinct.
- One city, village, troupe, or family is never silently generalized to all Teochew people.

That is why [拜老爷](skills/teochew-people-skill/wiki/customs/拜老爷.md) and [营老爷](skills/teochew-people-skill/wiki/customs/营老爷.md) are separate topics, and why the [Chaozhou historic-city World Heritage status](skills/teochew-people-skill/wiki/current-events/潮州古城申遗边界-2026.md) does not turn “advancing an application” into “inscribed.”

## How it evolves

Six operations form an auditable maintenance chain:

| Operation | Use | Boundary |
| --- | --- | --- |
| [ingest](skills/teochew-people-skill/operations/ingest.md) | Admit a candidate source | Verify identity, independence, and claim scope first |
| [media ingest](skills/teochew-people-skill/operations/media-ingest.md) | Handle video, audio, images, or family media | Rights first, then necessary timecodes; public access is not reuse permission |
| [query](skills/teochew-people-skill/operations/query.md) | Answer, write, edit, or produce | Start from indexes and open raw only as needed |
| [research](skills/teochew-people-skill/operations/research.md) | Resolve gaps, conflicts, and current facts | Recheck live status at publication time |
| [evolve](skills/teochew-people-skill/operations/evolve.md) | Persist reusable updates | Keep public facts and local knowledge separate |
| [lint](skills/teochew-people-skill/operations/lint.md) | Validate before release | Check fields, evidence, links, freshness, and deterministic indexes |

“Evolving” does not mean automatic truth. Human-reviewable source and scope decisions remain essential; deterministic tools build indexes and enforce structure.

## Writing and video showcase

![Original editorial illustration of two generations, a blank letter, and two shores](assets/letter-to-grandma-hero.png)

<p align="center"><sub>Not a historical photograph, film still, or replica of a real qiaopi document.</sub></p>

The *Letter to Grandma* showcase separates film registration and circulation, creator statements, qiaopi archives, Teochew-language variation, and Malaysia/Singapore screenings. Seven local visuals are `editorial_original`; no film stills, clips, dialogue, or music are copied.

- [Long-form illustrated feature: “A Letter Across the Sea”](examples/letter-to-grandma-feature.md): roughly 4,100 Chinese characters and 6 visual units.
- [60-second and ~3-minute video scripts](examples/letter-to-grandma-video-scripts.md): narration, timecodes, shots, sound, sources, rights, and local-review items.
- [Xinhua video-to-Wiki walkthrough](examples/video-to-wiki-demo.md): stores a URL, necessary timecodes, and verified paraphrases—never the MP4 or a full transcript.
- [Media manifest](assets/media-manifest.json): local visuals are original editorial assets; external film, news, archive, and interview media stay `link_only`.

## Personalization without contaminating facts

Knowledge resolves in this order: `<project>/.teochew-people` → `~/.teochew-people` → bundled public wiki.

- Project layer: audience, examples, and editorial constraints for one project.
- User layer: explicitly approved tone, family usage, and authorized local material.
- Public layer: publishable, source-grounded shared facts.

A local layer may prefer Jieyang examples or a family's own form of address, but it cannot silently overwrite public evidence. Family photographs, letters, recordings, and videos stay in the local overlay until every item has a clear choice: public, anonymous, internal review only, or do not retain.

## Install

Codex:

```bash
npx teochew-people-skill --codex --no-vault
```

Claude Code:

```bash
npx teochew-people-skill --claude --no-vault
```

Custom skills parent directory:

```bash
npx teochew-people-skill --dest /path/to/skills --no-vault
```

Only after explicitly choosing personalization:

```bash
npx teochew-people-skill --codex --init-vault
npx teochew-people-skill --codex --init-project /path/to/project
```

If the npm registry does not yet contain this release, install from GitHub: `npx github:oOtiti/teochew-people-skill --codex --no-vault`.

## Usage

```text
Use $teochew-people-skill to explain the difference between 拜老爷 and 营老爷, then write a 60-second narration. Cite topic/raw IDs, do not generalize local examples, and label shots as source_detail or editorial_structure.
```

```text
Use $teochew-people-skill to write about gongfu tea for a Jieyang family audience. Verify public facts through topic/raw; keep this family's usage in the local layer.
```

See [Before / After](examples/before-after.md) for more editing examples.

## Knowledge structure

```text
skills/teochew-people-skill/
├── SKILL.md                 # Thin router
├── raw/                     # 55 admitted sources and review ledger
├── wiki/                    # 50 topics in 9 categories
├── operations/              # ingest/media-ingest/query/research/evolve/lint
├── scripts/                 # Index, lint, status, and vault tools
├── assets/vault-template/   # Private-layer template, no user data
├── wiki-purpose.md
├── wiki-schema.md
└── wiki-log.md
```

## Contributing, verification, and license

Contributions are source-first: record the candidate and the admit/reject rationale in `raw/source-review.md`, create an admitted raw card, then update topics. Read [CONTRIBUTING.md](CONTRIBUTING.md) and run:

```bash
npm run wiki:index:check
npm run wiki:lint
npm run media:check
npm test
npm run readme:render:check
npm run pack:check
```

Code and project content use the [MIT License](LICENSE). External sources, images, films, music, performances, and family media retain their own rights and permissions. Private vaults, project overlays, pressure-test evidence, and copied media are excluded from the npm package.
