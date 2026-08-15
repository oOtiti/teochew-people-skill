# TEOCHEW PEOPLE Live Project Showcase Design

## Purpose

Replace the temporary `127.0.0.1:8765` direction sketch with a durable project page stored in the repository. The page must explain the product before showing examples: TEOCHEW PEOPLE is an evolving, personalized Teochew culture Skill and LLM Wiki for writing and video production.

## Chosen approach

Ship one dependency-free root `index.html` that reuses the repository's reviewed editorial assets. This is preferable to leaving a temporary visualization outside the repository, and lighter than introducing a frontend framework for a static project presentation.

The page is a visual companion to the four Markdown homepages, not a second factual corpus. Counts, links, rights labels, and product boundaries must stay aligned with the repository validators.

## Information architecture

1. Full-bleed Yingge hero with the single large lockup `TEOCHEW PEOPLE`, a short product definition, primary actions, language controls, and project badges.
2. Wiki overview with the current 55 raw sources, 50 topic pages, and 9 category indexes.
3. Knowledge atlas that explains raw evidence, topic indexes, current-event boundaries, and local personalization.
4. Epic Yingge showcase with a clear `editorial_original` disclaimer.
5. Illustrated 《给阿嬷的情书》 feature with the local hero, timeline, map, evidence diagram, article link, and video-script link.
6. Video-to-Wiki chain with ordered, rights-aware steps and a link to the worked example.
7. Controlled evolution and local personalization boundaries.
8. Installation commands and repository links.

## Visual direction

- Palette: ink `#090a0a`, paper `#f1eadc`, cinnabar `#b73226`, old gold `#cda45e`, sea green `#1f6d64`, quiet line `rgba(241,234,220,.18)`.
- Type: system grotesk for the monumental English lockup, Song/Ming system serif for cultural prose, condensed utility labels through letter spacing rather than an external font download.
- Layout: cinematic hero, then disciplined editorial bands with asymmetrical image/text splits. Avoid a dashboard-card look.
- Signature: the hero image is interrupted by an oversized outlined `PEOPLE` word that becomes solid as the page enters; this turns the crowd into the identity instead of treating the image as decoration.
- Motion: one restrained load sequence and small scroll reveals, disabled under `prefers-reduced-motion`.

## Localization

Provide Simplified Chinese, Traditional Chinese, English, and Japanese in the same page. Controls update visible copy, `lang`, document title, accessible labels, and persist only the language code in `localStorage`. The Chinese version is the default. Counts, commands, asset rights, paths, and proper nouns remain invariant.

## Accessibility and resilience

- Semantic landmarks and a skip link.
- Visible keyboard focus and `aria-pressed` on language controls.
- Meaningful alternative text for all images.
- No external font, framework, analytics, or tracking dependency.
- Content remains understandable if JavaScript is unavailable; Simplified Chinese stays visible.
- Responsive layouts at 1440 px, 1024 px, 768 px, and 390 px without horizontal overflow.

## Verification contract

Automated tests must require the four language controls, the three primary project counts, all seven badge meanings, the two major hero assets, film/video demo links, rights terminology, local-only preference storage, reduced-motion CSS, and package inclusion. Browser QA must cover desktop and mobile screenshots plus language switching and broken-resource checks.

