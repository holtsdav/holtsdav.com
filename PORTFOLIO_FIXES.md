> Historical version 1 record. The homepage was redesigned after owner feedback. See [PORTFOLIO_V2_REVIEW.md](PORTFOLIO_V2_REVIEW.md) for the current preview, motion evidence and fresh adoption patch. Version 1 packages remain preserved for comparison.

# Independent review fixes — ready for re-review

All four P2 findings in `/Users/holtsdav/Documents/Codex/2026-10-20/task-5/review/PORTFOLIO_INDEPENDENT_REVIEW.md` are addressed in the existing isolated worktree:

`/Users/holtsdav/Documents/Codex/2026-10-20/task-2/holtsdav-portfolio-dock`

Branch: `codex/portfolio-dock-20261020`. Changes remain uncommitted. This report records implementation verification; independent re-review is still pending.

## 1. Public source CTAs

- Removed the Glassdays and Mute On Location GitHub source destinations from the featured homepage and the shared Glassdays page. Neither private/unavailable repository is exposed or promised as public source.
- Replaced the homepage's secondary actions with the existing verified App Store destinations. Glassdays' secondary project-page action is now app support through the existing public mailbox.
- Retained Room Planner's independently verified public GitHub destination and the owner's public profile links. About copy now explicitly refers to public projects.
- The old placeholder generator was removed, so it no longer emits those broken source destinations on alternate project routes.

Files: `src/components/PortfolioHome.astro`, `src/components/GlassdaysPage.astro`, `src/pages/project/[slug].astro`.

Evidence: the browser check “Public destinations, truthful Mute release copy and legacy aliases” passes. A source and built-HTML scan finds no `github.com/holtsdav/Glassdays` or `github.com/holtsdav/MuteOnLocation` destinations in the served pages. Public availability evidence for the removed destinations remains in the independent review; this task did not change repository visibility.

## 2. Keyboard focus clears the fixed dock

The scroll container now reserves **112 px plus the safe-area inset** when a dock is present. Links and buttons also have 16 px scroll margins. This lets normal browser keyboard scrolling place controls above the dock and leave room for the focus ring; no wheel/touch interception or focus-driven custom scrolling was added.

Files: `src/styles/portfolio.css`, regression coverage in `scripts/verify-portfolio.mjs`.

Sequential Tab navigation checked **71 visible focus targets** across **390 × 844** and **1440 × 844** viewports. Every target outside the dock clears the dock's rectangle:

| Target | Focused control | Dock | Result |
| --- | --- | --- | --- |
| Mobile Mute “Explore the app” | y=672.03–716.03 | y=760–830 | Clear, including focus outline |
| Desktop Copy email | y=672.17–716.17 | y=749–822 | Clear, including focus outline |

Evidence: [all sequential focus geometry](docs/review-2026-10-20/keyboard-clearance.json), [mobile Mute focus](docs/review-2026-10-20/screenshots/keyboard-mobile-mute.png), [desktop Copy email focus](docs/review-2026-10-20/screenshots/keyboard-desktop-copy.png).

## 3. Intermediate responsive widths

- Hero grid tracks now use `minmax(0, …)` and children can shrink.
- Removed the fixed 360 px stage's grid contribution in the narrower two-column rule.
- Between **621 and 900 px**, the hero uses a deliberate one-column composition with a centered, bounded app stage. The compact mobile composition remains at 620 px and below.
- QA now checks the **painted rectangles** of hero anchors, app images, the Room Planner object, stage note and hero footer. It does not rely only on document `scrollWidth`, which could conceal cropping behind `overflow: clip`.

Files: `src/styles/portfolio.css`, `scripts/verify-portfolio.mjs`.

Passing widths: **320, 390, 620, 621, 700, 701, 768, 800, 801, 900, 901, 1024, 1440 px**.

Evidence: [621 px](docs/review-2026-10-20/screenshots/home-621.png), [700 px](docs/review-2026-10-20/screenshots/home-700.png), [701 px](docs/review-2026-10-20/screenshots/home-701.png), [801 px](docs/review-2026-10-20/screenshots/home-801.png). Each also has a `-viewport.png` capture in the same directory.

## 4. Mute On Location release copy and CTA

The independent review's saved App Store text and response records resolve the earlier uncertainty: [Mute On Location's recorded listing](https://apps.apple.com/de/app/mute-on-location/id6790398791?l=en-GB&mt=12) is available for Mac.

- Changed the landing page status to “Available on the Mac App Store.”
- Replaced “in development / not yet available” with accurate availability copy.
- Supplied the existing AppLanding primary action, “View on the Mac App Store,” in both its hero and closing section using that exact destination.
- Replaced the animated GIF with the existing still product preview.
- Did not add a price, ratings, revenue, testimonials or unverified capabilities.

File: `src/pages/apps/mute-on-location.astro`.

Evidence: [updated mobile page](docs/review-2026-10-20/screenshots/mobile-mute.png); browser assertions verify the App Store link, correct status and absence of the old unavailable copy. External verification is the independent review's `evidence/mute-app-store.txt`, `supplemental-check.json` and `reference-mute-app-store.png`; these were read, not modified.

## 5. Empty/placeholder route cleanup

Legacy aliases now lead to complete content, using static Astro redirects plus matching entries in `public/_redirects` for the existing hosting configuration:

| Old URL | Destination | Status |
| --- | --- | --- |
| `/Glassdays/` | `/apps/glassdays-countdown/` | 301 |
| `/MuteOnLocation/` | `/apps/mute-on-location/` | 301 |
| `/RogueColor/` | `/apps/rogue-color/` | 301 |
| `/NotiLog/` | `/#projects` | 302 |
| `/project/mute-on-location/` | `/apps/mute-on-location/` | 301 |
| `/project/rogue-color/` | `/apps/rogue-color/` | 301 |
| `/project/RoomPlanner/` | `/apps/room-planner/` | 301 |
| `/project/notilog/` | `/#projects` | 302 |

`/project/glassdays/` remains the complete shared Glassdays page, with the app landing URL as canonical. Existing app privacy and support destinations are preserved. The unfinished NotiLog aliases return to the work collection without suggesting that the project is released.

The Room Planner destination is a concise page for the existing tool, with its real screenshot, measured room/object/local-plan description, verified live tool and public source links. Its small cube icon is an original SVG matching the homepage's existing drawing. No new product or game development was introduced, and the complete pre-existing Rogue Color page was not rewritten.

Files: the four capitalized alias pages, `src/pages/project/[slug].astro`, `src/pages/apps/room-planner.astro`, `Assets/app-icons/room-planner.svg`, `public/_redirects`.

The browser test visits all eight aliases and verifies the final local destination and substantive H1. A served-HTML scan no longer finds the “More Info coming soon” placeholder text.

## Verification and preservation

| Check rerun after the fixes | Result |
| --- | --- |
| `npm run build`, Node 24 | Passed, 29 pages including aliases |
| `npm run check`, local Wrangler generation and TypeScript | Passed |
| Frontend and worker TypeScript separately | Passed |
| `npm run test:contact` | 22 passed; delivery and verification mocked |
| Expanded browser QA | 13 checks passed |
| `git diff --check` | Passed |
| Original dirty-file hashes and checkout status | Match initial baseline |
| Existing website T3 worktree | Still clean |

Evidence: [build](docs/review-2026-10-20/portfolio-build.log), [full type check](docs/review-2026-10-20/typecheck.log), [frontend types](docs/review-2026-10-20/frontend-types.log), [worker types](docs/review-2026-10-20/worker-types.log), [contact tests](docs/review-2026-10-20/contact-tests.log), [browser log](docs/review-2026-10-20/browser-qa.log), [browser JSON](docs/review-2026-10-20/browser-qa.json), [preservation hashes](docs/review-2026-10-20/preservation-check.json).

Refreshed screenshots also include [desktop homepage](docs/review-2026-10-20/screenshots/desktop-home.png), [mobile homepage](docs/review-2026-10-20/screenshots/mobile-home.png), [desktop Glassdays](docs/review-2026-10-20/screenshots/desktop-glassdays.png), [mobile Glassdays](docs/review-2026-10-20/screenshots/mobile-glassdays.png), and [mobile without JavaScript](docs/review-2026-10-20/screenshots/mobile-no-javascript.png).

All browser requests during implementation QA were restricted to the local loopback preview. No contact form was submitted. The owned preview is stopped after capture; use the existing startup script in [the main handoff](PORTFOLIO_REVIEW.md) for re-review.

No original dirty source was altered. No native app repository was edited. No push, publication, production change, purchase, service spending, credential change or quota reset occurred. Awaiting independent re-review.
