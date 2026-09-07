---
target: holtsdav website homepage
total_score: 16
max_score: 28
na_heuristics: 7,9,10
p0_count: 0
p1_count: 2
target_identity: "file:/Users/holtsdav/Documents/Dev/holtsdav.com/src/pages/index.astro"
target_fingerprint: "sha256:a66cbd1c264d0eb0f33ce725fb0f4c8007d9afaa7a248a40fd039f0ea682513c"
target_path: /Users/holtsdav/Documents/Dev/holtsdav.com/src/pages/index.astro
timestamp: 2026-09-06T14-13-48Z
slug: src-pages-index-astro
---
Method: dual-agent (A: /root/design_review · B: /root/design_evidence)

Target: src/pages/index.astro. Homepage assessed at desktop 1280×800 and mobile 390×844. Experience mode, evaluated against the recruiter audience in PRODUCT.md.

Design specificity: The particle name and real app icons give the site a recognizable signature. The dark card gallery is more conventional. The biggest opportunity is to make David’s work and contribution as distinctive as the wordmark.

| Heuristic | Score | Main finding |
|---|---:|---|
| System status | 2 | Project availability is inconsistent. |
| Real-world language | 2 | Plain project copy, but placeholder biography. |
| User control | 3 | Standard links; no clear project jump. |
| Consistency | 3 | Consistent cards; GitHub destinations differ in purpose. |
| Error prevention | 2 | Disabled store controls create uncertain expectations. |
| Recognition | 2 | Hero icons lack persistent visible names. |
| Efficiency | n/a | Expert accelerators unnecessary for this portfolio. |
| Aesthetic/minimalism | 2 | Oversized opening delays substantive evidence. |
| Error recovery | n/a | No transactional recovery flow assessed. |
| Help/documentation | n/a | Not required for basic portfolio browsing. |
| Total | 16/28 (57%, Acceptable) | Content and orientation need improvement. |

Strengths: The particle wordmark is memorable. Real app/game previews make the work tangible. Readable card headings, short descriptions and consistent actions are easy to scan. Email and LinkedIn are directly available; project actions are at least 44px tall, with semantic sections, accessible names and reduced-motion treatment in source.

Priority issues:
1. P1 — Replace the placeholder About section with an owner-confirmed introduction and relevant background. It currently announces unfinished work immediately after the opening spectacle. Omit placeholder portrait treatment until a real asset exists. Command: impeccable clarify.
2. P1 — Establish a clear first-screen purpose and route to projects. Add a readable role/introduction and View projects anchor, and shorten the mobile hero. Its 776px height pushes the project section to approximately y=1446px. Preserve the particle signature. Command: impeccable distill.
3. P2 — Clarify project maturity and link purposes. Replace unavailable App Store-shaped controls with verified status text. Distinguish source code, support repositories and profile links. Label hero icons and distinguish the noninteractive coming-soon tile. Command: impeccable clarify.
4. P2 — Give the strongest work more emphasis than planned entries. Room Planner and NotiLog share logo artwork and equal card treatment with demonstrated products. Add a real Room Planner preview and verified purpose, and present planned work more compactly. Command: impeccable layout.

Cognitive load and emotional journey: The opening offers four social/contact links and four app links without a primary recruiter path. Card-level choices are manageable; missing context is the greater burden. Curiosity peaks at the wordmark, drops at the placeholder biography, recovers with actual previews, then weakens at generic/planned entries.

Persona red flags: A first-time visitor cannot immediately identify the profession or next step. A skeptical recruiter encounters placeholders and inconsistent repository destinations. A distracted mobile visitor scrolls too far before substantive content; header social targets are 40px rather than the skill’s 44px target. The mobile gallery fits correctly.

Deterministic evidence: CLI scan of index.astro returned zero findings. Rendered browser scan found 12 rule occurrences in 9 desktop groups, and 13 in 10 mobile groups: five radial-spotlight-glow, four dark-glow (one page-level duplicate), two kicker-above-heading, one codex-grid-background, plus a mobile clipped-overflow-container advisory. Locations: gallery previews (index.astro:137/global.css:1066), About card (index.astro:89/global.css:902), logo placeholders (global.css:1106), labels (index.astro:95,128), hero grid (global.css:212), hero overflow (global.css:201). Style detections are not accessibility failures or proof of AI authorship. Mobile clipping did not demonstrate a lost control. Keep glow reduction secondary to content and navigation improvements.

Minor observations: Existing image alt text calls actual-looking previews placeholders. The particle heading is opacity zero by default; verify visible fallback when JavaScript/WebGL fails. Redundant section labels add little. Room Planner has one exact link to https://holtsdav.com/RoomPlaner, a 327px mobile card, and no observed overflow.

Questions for the next pass: What should recruiters know about David before opening a project? Which projects best demonstrate the work he wants to do next?
