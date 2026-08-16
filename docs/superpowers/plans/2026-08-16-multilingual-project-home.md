# TEOCHEW PEOPLE Multilingual Project Home Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a clearer badge-led project homepage and complete Traditional Chinese, English, and Japanese README entrypoints without weakening evidence or privacy boundaries.

**Architecture:** Keep `README.md` as the canonical Simplified Chinese page and create three human-readable localized siblings that reuse the same public assets and links. Extend the existing PowerShell release validator and npm allowlist so translation drift or missing entrypoints fails closed.

**Tech Stack:** GitHub-flavored Markdown, Shields.io/GitHub Actions badges, PowerShell validation, npm package allowlist.

---

### Task 1: Define the release contract

**Files:**
- Modify: `scripts/validate-skill.ps1`
- Modify: `package.json`

- [ ] Add four README paths, required language-switch links, CI/npm/Node/license/wiki/language badges and localized product terms to the validator.
- [ ] Run `npm run validate` and confirm RED because localized README files do not exist.
- [ ] Add the three localized README files to `package.json#files`.

### Task 2: Upgrade the Simplified Chinese homepage

**Files:**
- Modify: `README.md`

- [ ] Rewrite the lead as an evolving, personalized Skill plus LLM Wiki.
- [ ] Add real badges and a four-language switch directly below the lead.
- [ ] Add a four-part WIKI overview covering public knowledge, controlled evolution, local personalization and writing/video outputs.
- [ ] Preserve the existing ten H2 sections, hero images, installation commands and evidence boundaries.

### Task 3: Add localized homepages

**Files:**
- Create: `README.zh-Hant.md`
- Create: `README.en.md`
- Create: `README.ja.md`

- [ ] Create complete, natural-language pages with the same product definition, badges, language switch, Wiki overview, showcase, operating model, installation, structure, contribution and license guidance.
- [ ] Keep all four pages on the same `55 sources / 50 topics / 9 categories`, installation commands and media-rights statements.

### Task 4: Verify and commit

**Files:**
- Verify: `README.md`, `README.zh-Hant.md`, `README.en.md`, `README.ja.md`, `scripts/validate-skill.ps1`, `package.json`

- [ ] Run a local relative-link audit across all four README files.
- [ ] Run `npm run validate`, `npm test`, `npm pack --dry-run --json` and `git diff --check`.
- [ ] Confirm the tarball contains four README files and excludes `docs/superpowers`, private vaults and copied media.
- [ ] Commit with `docs: add multilingual project home`.
