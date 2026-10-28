> Historical version 1 record. The homepage was redesigned after owner feedback. See [PORTFOLIO_V2_REVIEW.md](PORTFOLIO_V2_REVIEW.md) for the current preview, motion evidence and fresh adoption patch. Version 1 packages remain preserved for comparison.

# Portfolio review — 20 October 2026

A working local portfolio redesign is ready in this separate worktree. The four P2 findings from the independent review have been addressed; see [the exact fixes and re-review evidence](PORTFOLIO_FIXES.md). Independent re-review is pending. It includes a section dock, a complete homepage, and a complete Glassdays project page with real existing app screenshots. No publishing is required to review it.

## Open the preview

```sh
cd /Users/holtsdav/Documents/Codex/2026-10-20/task-2/holtsdav-portfolio-dock
sh docs/review-2026-10-20/start-preview.sh
```

Then open **http://127.0.0.1:4326/**. Glassdays is at **http://127.0.0.1:4326/project/glassdays/** and **http://127.0.0.1:4326/apps/glassdays-countdown/**. The shared canonical URL remains `/apps/glassdays-countdown/`.

The script selects an existing Node 24 installation for this process, rebuilds current source, and serves the built site. Stop it with Ctrl-C. To edit with live refresh, select Node 24 and run `npm run dev -- --host 127.0.0.1 --port 4326`. Port 4326 was chosen after inventorying existing listeners; none of the user's existing sessions was stopped. The QA preview owned by this task is stopped after screenshots are captured.

## Screenshots

| View | Homepage | Glassdays |
| --- | --- | --- |
| Desktop, 1440 px | [Full page](docs/review-2026-10-20/screenshots/desktop-home.png) · [First viewport](docs/review-2026-10-20/screenshots/desktop-home-viewport.png) | [Full page](docs/review-2026-10-20/screenshots/desktop-glassdays.png) |
| Mobile, 390 px | [Full page](docs/review-2026-10-20/screenshots/mobile-home.png) · [First viewport](docs/review-2026-10-20/screenshots/mobile-home-viewport.png) | [Full page](docs/review-2026-10-20/screenshots/mobile-glassdays.png) |

[Mobile without JavaScript](docs/review-2026-10-20/screenshots/mobile-no-javascript.png) also keeps all three projects and native dock links available.

## Repo, inspiration and preserved work

- **Actual repository:** `/Users/holtsdav/Documents/Dev/holtsdav.com`
- **Origin:** `https://github.com/holtsdav/holtsdav.com.git`
- **Starting commit:** `b9069c2c2578d162102d416d877af5042afa33b6` (`main`, “Simplify local development site while preserving production”).
- **New worktree:** `/Users/holtsdav/Documents/Codex/2026-10-20/task-2/holtsdav-portfolio-dock`
- **New local branch:** `codex/portfolio-dock-20261020`
- **Existing website T3 worktree:** `/Users/holtsdav/.t3/worktrees/holtsdav.com/t3-18579d59`, branch `t3/trim-site-development`, clean at the same starting commit.
- Read `AGENTS.md`, `PRODUCT.md`, `DESIGN.md`, package scripts and the existing app pages before implementation. The static Astro/TypeScript/npm stack and English language are retained.

**Exact Obsidian reference:** `/Users/holtsdav/Library/Mobile Documents/com~apple~CloudDocs/Vault/holtsdav.com/Resources.md`. The note names [Cindy Ly](https://www.cindyly.design/) for a dock for specific sections, creativity and a beautiful landing page, while explicitly disliking forced scroll animation. It also names [Mac Stats](https://mac-stats.com/) for the scrolling header, [T3 Code](https://t3.codes/) for floating provider icons, and [WisprFlow](https://wisprflow.ai/notetaker) for a human-crafted feel.

The implementation interprets those principles: a compact frosted section dock, small app objects, editorial type, warm paper, and natural scrolling. No reference-site source, artwork, font files or assets were copied.

The main checkout already had **seven modified tracked files**: `DESIGN.md`, `Header.astro`, `ParticleWordmark.astro`, `BaseLayout.astro`, `contact.astro`, `particle-wordmark.ts` and `global.css`. Those changes were copied into the new worktree before implementation. The untracked `.claude/` and `.codex/` directories were left alone and were not copied. Dependencies were locally cloned into this worktree; the package manifest and lockfile were not changed.

- [Exact copied baseline patch](docs/review-2026-10-20/copied-local-baseline.patch)
- [Initial hashes, status, and all T3 worktree inventories](docs/review-2026-10-20/baseline-inventory.json)
- [Final source preservation verification](docs/review-2026-10-20/preservation-check.json)
- [Implementation diff relative to the copied baseline](docs/review-2026-10-20/implementation-only.diff)

All seven original dirty files still match their initial SHA-256 hashes. The original checkout status matches its initial status and the existing website T3 worktree is still clean. All website edits are confined to the named new worktree. Changes are left uncommitted for review. Native app repositories were not edited.

## What changed

1. **A complete homepage:** clear introduction, actual app work, useful links, a concise about section and direct contact options. Glassdays, Mute On Location and Room Planner use authentic existing names, screenshots, descriptions and destinations. Unfinished placeholder projects are not promoted as shipped work.
2. **The section dock:** visible labels, large touch targets, active-section feedback and keyboard focus. Native anchors work without JavaScript. The script observes scrolling and does not intercept wheel/touch events or lock the viewport.
3. **Working project filters:** All work, Apple apps and Web tools. Counts announce changes. Direct links to a hidden project reveal it before navigation. With JavaScript disabled, filtering controls are omitted and every project stays visible.
4. **Glassdays project depth:** the placeholder `/project/glassdays/` and the existing app landing route share a complete page covering personal countdowns, collections, widgets, repeats/reminders, account-free use and the optional one-time Pro unlock. Store, app support and privacy links remain available. Source CTAs for unavailable public repositories were removed after independent review; the verified public Room Planner source link remains. The page describes the product; it does not invent a design process, outcomes, testimonials or usage metrics.
5. **Still, optimized imagery:** four existing Glassdays captures were copied unchanged from `/Users/holtsdav/Documents/Dev/GlassdaysScreenshots/Assets/`. Astro optimizes them for the web. The new homepage and Glassdays page do not autoplay the existing GIF. [Source paths and hashes](docs/review-2026-10-20/screenshot-provenance.json).
6. **Reviewable local development:** the stripped development homepage and development redirects were removed in this worktree so the portfolio and its links can be reviewed locally. Existing privacy routes, contact worker implementation and legal content remain in place. The skip link now targets a focusable main element.

Main implementation files: `PortfolioHome.astro`, `PortfolioDock.astro`, `GlassdaysPage.astro`, `portfolio.ts`, `portfolio.css`, `glassdays-case.css`, the homepage and Glassdays routes, `BaseLayout.astro`, and `middleware.ts`. Existing copied work is distinguished in the baseline patch and the implementation-only diff.

## Validation

| Check | Result | Evidence |
| --- | --- | --- |
| Initial copied-baseline build | Passed, 28 pages | [Log](docs/review-2026-10-20/baseline-build.log) |
| Portfolio/P2 Astro build, Node 24 | Passed, 29 pages, including legacy redirects | [Log](docs/review-2026-10-20/portfolio-build.log) |
| Repository `npm run check` | Passed, including local Wrangler types and worker TypeScript | [Log](docs/review-2026-10-20/typecheck.log) |
| Frontend TypeScript after final interaction edit | Passed | [Log](docs/review-2026-10-20/frontend-types.log) |
| Existing contact tests | **22 passed**; all email delivery and verification mocked | [Log](docs/review-2026-10-20/contact-tests.log) |
| Browser QA | **13 checks passed**, including 71 sequential keyboard targets | [JSON](docs/review-2026-10-20/browser-qa.json) · [Log](docs/review-2026-10-20/browser-qa.log) |
| Whitespace/diff check | Passed | [Log](docs/review-2026-10-20/diff-check.log) |

Browser checks cover 320, 390, 620, 621, 700, 701, 768, 800, 801, 900, 901, 1024 and 1440 px widths and painted hero-element bounds; local route resolution; image decoding; filters; active dock state; reduced motion; keyboard skip/focus; clipboard feedback; no-JavaScript access; and absence of browser JavaScript exceptions. A computed text contrast check passes on the two new page designs. This is targeted QA, not a claim of a comprehensive accessibility certification. External requests were blocked during browser checks and no contact form was submitted.

The sandbox initially prevented a preview port, browser launch, and Wrangler's temporary local type-generation listener. These completed through approved local execution. No production deployment command was run. The browser checks use an isolated headless profile, not the user's running browser session.

To repeat the browser checks with the already installed test runtime:

```sh
PLAYWRIGHT_MODULE=/Users/holtsdav/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs \
PORTFOLIO_CHROMIUM_PATH='/Users/holtsdav/.cache/puppeteer/chrome/mac_arm-152.0.7977.75/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing' \
/Users/holtsdav/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node scripts/verify-portfolio.mjs
```

Start the local preview first. The script only accepts loopback hosts. It does not add a dependency to the project.

## Evidence and sensible follow-ups

- Glassdays capabilities are grounded in the existing app page and [David's App Store listing](https://apps.apple.com/de/app/glassdays-countdown/id6785538729), read on 20 October. Price amounts, ratings and revenue are deliberately absent. Calendar integration is described without promising an unverified import workflow.
- The copied screenshots are authentic existing repository assets, **not fresh captures of the current app build**. They show older example countdown dates and imagery. Before any later publication, replace them with current, neutral app captures if David prefers; no app code needs to change for this portfolio review.
- The independent review verified the exact [Mute On Location Mac App Store listing](https://apps.apple.com/de/app/mute-on-location/id6790398791?l=en-GB&mt=12) as publicly available for purchase. Its landing page now says “Available on the Mac App Store” and offers the verified link, without a hard-coded price. The earlier unresolved-status note is superseded by that evidence.
- [Room Planner's live page](https://holtsdav.com/RoomPlanner) was read only to confirm the floor-plan/object interaction and on-device plan description. It was not changed.
- Recruiter-facing employment history, biography, contribution details and outcomes still need David's own facts if he wants to add them. The new copy does not fill those gaps with invented achievements.
- Empty capitalized aliases and legacy placeholder project URLs now redirect to complete pages. Room Planner has a concise local product page grounded in its existing interface; the unfinished NotiLog aliases temporarily return to the work collection without making a release claim. Privacy/support URLs are preserved. See the alias table in [the fixes report](PORTFOLIO_FIXES.md).
- No push, deploy, publish, DNS change, credential change, purchase, paid service or quota reset occurred. No game development occurred.

No execution blocker remains for reviewing the local result. Independent re-review of the focused fixes is pending. Publication is intentionally outside this task's scope.

## NotiLog release-document draft follow-up

Two additional local-only drafts are now prepared: `/support/notilog/` and `/drafts/notilog-privacy/`. The latest build includes 31 pages. No existing policy route was replaced and no URL was published or configured in the app. See [the separate source-backed NotiLog review](NOTILOG_DRAFT_REVIEW.md) for exact intended routes, current-source versus retention-candidate distinctions, screenshots, validation and questions for David.

## Final adoption package

[The adoption manifest](ADOPTION_MANIFEST.md) separates copied owner changes, portfolio work and unpublished NotiLog drafts, and links binary-capable fix-only patches, read-only apply checks and clean reconstruction/startup evidence. Nothing was adopted into the original checkout.
