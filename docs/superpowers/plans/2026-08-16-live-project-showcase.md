# TEOCHEW PEOPLE Live Project Showcase Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the temporary local direction sketch with a durable, responsive, four-language TEOCHEW PEOPLE project showcase stored in the repository.

**Architecture:** Add one dependency-free root `index.html` that reuses reviewed assets and contains a small localization dictionary. Protect its public contract with a Node test, include it in the npm package, then serve the repository root on the existing local preview port for browser QA.

**Tech Stack:** Semantic HTML, modern CSS, vanilla JavaScript, Node.js built-in test runner, Python static HTTP server, Playwright CLI.

---

### Task 1: Define the showcase contract

**Files:**
- Create: `tests/project-page.test.mjs`
- Modify: `package.json`

- [ ] **Step 1: Write the failing test**

Create a test that reads `index.html` and asserts four language buttons; 55/50/9; seven badge labels; `assets/yingge-epic.png`; `assets/letter-to-grandma-hero.png`; film article, video script, and video-to-Wiki links; `editorial_original`, `link_only`, `localStorage`, `prefers-reduced-motion`, a skip link, and a non-empty localized dictionary.

- [ ] **Step 2: Run test to verify it fails**

Run: `node --test tests/project-page.test.mjs`

Expected: FAIL because root `index.html` does not exist.

- [ ] **Step 3: Add package inclusion contract**

Add `index.html` to the `files` array in `package.json`; keep the package version unchanged because this branch is a reviewable feature, not a release publication.

### Task 2: Build the project page

**Files:**
- Create: `index.html`

- [ ] **Step 1: Implement semantic content and visual system**

Build the sections defined in the design: hero, Wiki overview, knowledge atlas, Yingge feature, film feature, video pipeline, evolution/privacy, install, and footer. Reuse repository assets and repository-relative links.

- [ ] **Step 2: Implement localization**

Use `data-i18n` keys and a four-language dictionary. Set `document.documentElement.lang`, title, `aria-pressed`, and persist only `teochewPeopleLanguage` in local storage.

- [ ] **Step 3: Implement responsive and accessible behavior**

Add a skip link, visible focus states, meaningful alt text, mobile layouts, and reduced-motion behavior. Do not add external fonts, analytics, or remote script dependencies.

- [ ] **Step 4: Run the targeted test**

Run: `node --test tests/project-page.test.mjs`

Expected: PASS.

### Task 3: Make the page publishable

**Files:**
- Modify: `README.md`
- Modify: `scripts/validate-skill.ps1`

- [ ] **Step 1: Link the visual showcase**

Add a visible `Project Showcase` link near the README's language navigation so visitors can find the page without replacing the GitHub README experience.

- [ ] **Step 2: Extend release validation**

Require `index.html` and its core artifact links in the repository validator so future content or packaging edits cannot silently remove the presentation.

- [ ] **Step 3: Run validation and package checks**

Run: `npm test` and `npm run pack:check`.

Expected: all tests pass; the tarball includes `index.html` and all four README files.

### Task 4: Browser QA and publication handoff

**Files:**
- No repository file changes expected after QA fixes.

- [ ] **Step 1: Switch the preview server**

Stop only the known Python server bound to port 8765, then start a hidden Python server rooted at this worktree. Open `http://127.0.0.1:8765/`.

- [ ] **Step 2: Inspect desktop and mobile rendering**

Use Playwright snapshots/screenshots at desktop and 390 px mobile width. Confirm no horizontal overflow, missing images, console errors, or obscured text.

- [ ] **Step 3: Test language controls**

Switch to Traditional Chinese, English, and Japanese; confirm title, hero copy, button state, and persisted preference update.

- [ ] **Step 4: Run the complete verification suite**

Run `npm test`, `npm run wiki:status`, local-link audit, badge endpoint audit, `npm run pack:check`, `git diff --check`, and `git status --short`.

- [ ] **Step 5: Commit, push, and open a Draft PR**

Commit the showcase as one intentional feature commit, push `codex/letter-to-grandma-wiki`, and open a Draft PR to `main` describing the multimedia Wiki, four-language home, rights boundaries, browser showcase, and verification evidence.
