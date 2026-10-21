# Light portfolio prototype · 21 October 2026

Working preview: **http://127.0.0.1:4330/**. Alternative directions: **http://127.0.0.1:4330/directions/**. The reviewed implementation is saved in a local commit on the isolated branch; exact hash and scope verification are recorded in `docs/review-2026-10-21/local-commit.json`. Five copied owner-only files remain unstaged. Gallery is the provisional design choice following independent visual review; David has not approved its appearance.

## Exact checkout and inspiration

- Original website: `/Users/holtsdav/Documents/Dev/holtsdav.com`.
- New isolated worktree: `/Users/holtsdav/Documents/Codex/2026-10-20/task-2/holtsdav-portfolio-workspace`.
- Branch: `codex/portfolio-workspace-20261021`, starting at `b9069c2c2578d162102d416d877af5042afa33b6`.
- Inspiration note: `/Users/holtsdav/Library/Mobile Documents/com~apple~CloudDocs/Vault/holtsdav.com/Resources.md`. Its Cindy Ly entry praises the dock, creativity and landing page, and rejects forced scroll animation. The prototype uses these principles with David’s own content and artwork. No reference-site code, images or fonts were copied.
- Prior rejected work stays in `../holtsdav-portfolio-dock`. Existing ports 4326/4327 were left running. The seven existing T3 checkouts and their dirty state were inventoried before editing: [baseline inventory](docs/review-2026-10-21/baseline-inventory.json).

Seven dirty tracked owner files were copied before implementation: `DESIGN.md`, `Header.astro`, `ParticleWordmark.astro`, `BaseLayout.astro`, `contact.astro`, `particle-wordmark.ts`, and `global.css`. Their exact original contents remain in [the copied-owner baseline patch](docs/review-2026-10-21/copied-owner-baseline.patch). Private local `.claude`/`.codex` settings were not copied. Final verification found the original checkout’s HEAD, full status and all seven file hashes unchanged, and the website T3 checkout still clean. [Preservation evidence](docs/review-2026-10-21/final-preservation.json). Native projects were only read for existing facts/assets; no native source, simulator, foreground app or running release session was changed by this work.

## Implemented result

The light home uses the original animated wordmark and a gallery of actual product captures. Project names/platforms now lead each image, clear of the landing dock; first-row spacing keeps the following captions beyond the initial fold. Short landscape puts the caption and controls beside the original particle element. Text is limited to identity, project names, platforms and short useful descriptions. Three functioning early directions are retained: Workspace, Gallery and App shelf. Independent review rejected Workspace’s icon orbit as too close to the rejected design, selected Gallery, and kept the shelf idea in the project index/folder. [First directions](docs/review-2026-10-21/FIRST_DIRECTIONS.md), [first independent review](docs/review-2026-10-21/independent-first-review.md).

The persistent dock follows **Home → opened project icons → Projects → More**. Opening a project adds one icon; switching or returning Home preserves opened pages; closing removes the intended item. The opened strip scrolls on narrow screens while Home, Projects and More remain reachable. Keyboard focus scrolls the whole icon/close group and its outline into view. The Projects folder contains all ten projects in exactly three visual rows and four columns, with native dialog behavior, arrow navigation, focus containment, Escape, outside-click dismissal and touch targets. Native links provide a complete project index without JavaScript. More contains About, Support, Privacy and Impressum.

All ten projects have complete routes with verified status, existing artwork where available and concise source-backed text. The five projects without verified captures now have one header icon, a project-colored title, a short natural description and real links. There is no repeated-icon panel, generic feature-label grid or fake application UI:

| Project | Route | Verified presentation |
|---|---|---|
| Glassdays | `/projects/glassdays/` | Existing icon, four genuine product captures, existing App Store link |
| NotiLog | `/projects/notilog/` | Existing icon, Shortcuts/history/local-storage profile; in development |
| SaveShelf | `/projects/saveshelf/` | Existing visible icon layers, collection/discovery/Steam profile; in development |
| Mute On Location | `/projects/mute-on-location/` | Existing icon and capture, existing Mac App Store link |
| ReviewBar | `/projects/reviewbar/` | Existing icon, releases/reviews/analytics profile; in development |
| PDF Editor | `/projects/pdf-editor/` | Existing repository demo capture, public GitHub link; desktop beta |
| Room Planner | `/projects/room-planner/` | Existing capture, project navigation icon, public tool and GitHub links |
| AuxJam | `/projects/auxjam/` | Verified shared-music-queue prototype profile |
| Rogue Color | `/projects/rogue-color/` | Existing icon/gameplay capture and itch.io link; portfolio listing only |
| Glassdays JSON Editor | `/projects/glassdays-catalog/` | Existing favicon, private catalog-tool profile; no private endpoint exposed |

Utility, legacy and legal routes share the light layout. Old project URLs lead to their corresponding new pages. Contact is a working email link; the unused form is not presented. Existing legal prose was retained with factual changes for the actual contact/session-storage behavior. NotiLog privacy remains a visibly marked **unpublished, noindex draft**, not an approved policy. Existing empty project-policy routes now give a truthful status and email destination.

## Original animation preserved

The genuine original is the **Git HEAD** version of `src/scripts/particle-wordmark.ts`; the owner’s dirty working version changes more than colors. Exact original component/script copies are saved in [original-dark-source](docs/review-2026-10-21/original-dark-source/). The light module changes only two shader color literals and multiplies point coverage by 1.5 for contrast. After normalizing these three permitted changes, **all other source bytes match**. Sampling, particle pairing/counts, pointer physics, structure and timing remain original: 3500ms hold, 1600ms morph, 10.2-second full cycle, split full name on mobile.

Actual forward and reverse animation frames were captured at 390px and 1440px against the unchanged dark reference: **56 frames**, with measured elapsed times, paired contact sheets and pointer recovery evidence. [Motion report](docs/review-2026-10-21/motion/motion-qa.json). Pause/Play, persistent manual preference, live reduced-motion changes and a readable WebGL-unavailable fallback work outside the unchanged animation module. The static identity fits narrow screens. Touch can scroll the page over the canvas.

## Validation and visual review

| Check | Result / evidence |
|---|---|
| Production static build | Pass; 47 built HTML pages · [latest build log](docs/review-2026-10-21/refinement-build.log) |
| `npm run check` on Node 24 | Pass; local TypeScript/worker-type checks only · [log](docs/review-2026-10-21/repository-check.log) |
| Existing mocked contact tests | 22 passed; no email delivered · [log](docs/review-2026-10-21/contact-tests.log) |
| Full browser regression after caption/compact-page refinement | 14 checks passed, zero JS exceptions, 81 route/width combinations and 298 sequential focus observations · [report](docs/review-2026-10-21/qa/browser-qa.json) |
| All-ten-open dock | 60 target/ring checks at 320/390/1440px passed · [report](docs/review-2026-10-21/dock-focus-fix/focus-qa.json) |
| Independent reproduction of dock repair | 60 observations, zero clipped/offscreen targets or rings; switch/close/reopen/More/arrival-scroll passed · [closure](docs/review-2026-10-21/focused-review-closure.md) |
| Touch, short screens, resize, routes | Real CDP touch swipe/taps, 320×568 and 844×390 folder, live split/single-name resize, all 47 built HTML routes passed · [report](docs/review-2026-10-21/final-extra/final-extra-qa.json) |
| Reduced motion / no JS / WebGL unavailable | Readable identity and useful navigation passed; no dead Projects button |
| Text contrast | Passed tested page/folder/More text against computed backgrounds; not a certification for every image/blurred pixel |

Two independent reviews and a separate repair verification led to actual changes: removed the rejected orbit from the default, replaced giant no-image logo panels with compact factual profiles, balanced the Glassdays screenshots, repaired clipped dock focus rings, fixed modal focus escape, corrected mobile popover placement and page-arrival scroll, and strengthened muted text contrast. Failure evidence remains in `independent-second/`; it was not overwritten with passing screenshots. [Second review](docs/review-2026-10-21/second-review.md).

After direct parent inspection of the initial Library images, a further iteration fixed landing-caption obstruction and removed the no-capture project panels. The full 14-check regression was rerun after these changes. A subsequent short-height CSS correction and intermediate-width first-row spacing were checked separately across 18 viewport pairs, plus 15 compact project/width cases: [refinement checks](docs/review-2026-10-21/refinement/refinement-qa.json). All ten project routes are included in the final [contrast report](docs/review-2026-10-21/qa/contrast-qa.json). Original animation/dock implementation code did not change. [Independent refinement review](docs/review-2026-10-21/refinement-review.md) confirms the two requested refinements. Its additional landscape finding is **closed** by [28 fresh observations across 16 states](docs/review-2026-10-21/landscape-closure.md), including live animation/full-name hold, transition, reduced motion, empty/full docks and intermediate portrait widths. Raw concurrent capture limitations and successful serial rechecks are explicitly retained. The identical short-landscape layout was also extended from a 600px to a 500px minimum width, with a bounded [568×320 live/reduced all-open check](docs/review-2026-10-21/refinement/small-landscape-qa.json).

## Screenshots and Library inspection

Final captures: [desktop Home](docs/review-2026-10-21/final/home-desktop-live.png), [mobile Home](docs/review-2026-10-21/final/home-mobile-live.png), [desktop folder](docs/review-2026-10-21/final/folder-desktop.png), [mobile folder](docs/review-2026-10-21/final/folder-mobile.png), [project with three opened pages](docs/review-2026-10-21/final/notilog-three-open-desktop.png), [Glassdays full desktop page](docs/review-2026-10-21/final/glassdays-desktop-full.png), [mobile reduced motion](docs/review-2026-10-21/final/home-mobile-reduced.png). Every project and the utility pages also have captures in `docs/review-2026-10-21/qa/screenshots/`.

The parent-requested intermediate review boundary was uploaded successfully to Library, before final completion:

- `Portfolio_Gallery_Home_Original_Particles_1440x900.png` — `libfile_dad6f57a87208191ba35fab36f9f57d1`
- `Portfolio_Projects_Folder_Ten_Projects_390x844.png` — `libfile_5fd261f161488191929473dd092a1869`
- `Portfolio_NotiLog_Project_Three_Opened_Dock_1440x900.png` — `libfile_5e11455a4cd08191bec1230c9d9a9146`

[Exact Library receipts](docs/review-2026-10-21/library-review/library-upload.json). These images have clear state/viewport names and contain no private data. Uploading them did not publish the website.

**The Library items above still contain the first review versions.** The parent inspected them and requested the refinements described here. The revised Home and NotiLog images plus a new desktop folder image are ready locally, but automatic approval review **denied** that batch of Library replacements/creation before execution. No alternate upload route was attempted. [Exact blocked action and approval needed](docs/review-2026-10-21/LIBRARY_UPDATE_BLOCKED.md). The local `library-review/` Home/NotiLog paths now contain the pending revised bytes; their original uploaded PNGs are preserved in `library-review/round1-original/`. Do not mistake the pending local edits for confirmed saved Library versions.

Fresh requested views: [Home with captions above cards](docs/review-2026-10-21/refinement/home-1440x900.png), [compact NotiLog with three opened pages](docs/review-2026-10-21/refinement/notilog-three-open-desktop-1440x900.png), [desktop Projects folder, three rows](docs/review-2026-10-21/refinement/projects-folder-desktop-1440x900.png), [short landscape correction](docs/review-2026-10-21/refinement/home-844x390.png). These are local review evidence and imply no aesthetic approval.

## Restart and adoption

The current loopback-only Python preview serves `dist/` at port **4330**, with its owned PID recorded in [preview-process.json](docs/review-2026-10-21/preview-process.json). It remains available for review. Existing unrelated servers were preserved.

To rebuild and start a separate Astro preview without colliding with that server:

```sh
cd /Users/holtsdav/Documents/Codex/2026-10-20/task-2/holtsdav-portfolio-workspace
./docs/review-2026-10-21/start-preview.sh
# Opens http://127.0.0.1:4332/; Ctrl-C stops this new preview.
```

The helper selects installed Node 24, disables Astro telemetry, builds locally and binds loopback only. Set `PORTFOLIO_NODE` or `PORTFOLIO_PORT` if needed. Existing dependencies are present; nothing is installed by the helper. Its shell syntax was checked. Development: use Node 24 and `npm run dev -- --host 127.0.0.1 --port 4333`.

[Committed product source](docs/review-2026-10-21/portfolio-committed-source.tar.gz) and [implementation commit patch](docs/review-2026-10-21/portfolio-implementation-commit.patch) contain the saved implementation without the five copied owner-only changes. A clean candidate built from the original HEAD plus only the allowlisted code built all 47 pages and produced **24/24 pixel-identical captures** against the reviewed preview: [comparison](docs/review-2026-10-21/clean-commit/comparison.json). The active portfolio stylesheet supplies its own light palette/legal styling, so it does not depend on unstaged owner legacy styles.

The separate [full working product source archive](docs/review-2026-10-21/portfolio-product-source.tar.gz) retains the documented copied owner baseline as well. Both archives exclude dependencies, build output, secret files, private settings and review captures. [Package manifest and hashes](docs/review-2026-10-21/source-package-manifest.json). The existing [improvement patch](docs/review-2026-10-21/portfolio-improvement-from-owner-baseline.patch) remains relative to starting HEAD **plus the separately saved owner-baseline patch**; `git apply --check` passed in a disposable fixture built from that exact baseline. It was never applied to the original checkout. Do not blindly apply either patch to a different dirty branch. See [commit scope](docs/review-2026-10-21/COMMIT_SCOPE.md) and the exact allowlist for included files and deliberately local evidence. Nothing was pushed.

## Remaining limits and useful follow-up

Five projects have genuine stored captures. A bounded audit of six existing native result bundles found no usable full-app NotiLog, ReviewBar or SaveShelf screenshots; debug/component review shells were deliberately excluded. This is not a ban on demo data: actual rendered product screens with safe demo content are acceptable when clearly identified as development previews. [Audit](docs/review-2026-10-21/asset-candidates/ASSET_AUDIT.md). A further [official App Store/product-page and repository check](docs/review-2026-10-21/official-marketing-check.md) reconfirmed Glassdays/Mute On Location but supplied no verified NotiLog marketing capture. Glassdays’ stated Solar icon attribution is linked in About. WorktreeLens and Fehlerblatt are absent from the inventory. AuxJam and the private JSON tool also lack approved usable captures. SaveShelf uses its genuine visible icon layers; PDF Editor and AuxJam use neutral navigation glyphs because no dedicated official icon was verified. [Asset provenance](docs/review-2026-10-21/asset-provenance.json). Fresh app screenshots require a coordinated simulator/device slot with the native release work; this task did not occupy one.

All automated browser evidence is isolated headless Chromium, including touch emulation. Foreground Safari, physical touch, VoiceOver and GPU behavior on an actual device remain unverified. A background-tab attempt stayed `visibilityState: visible` in headless Chrome, so it does **not** prove a real hidden-tab suspension/resume. The application remained readable after tab return and live resize. Owner aesthetic review remains open; three directions and direct Library images are ready for that decision.

Before any separately authorized future publication: review the final appearance, add approved missing app captures/icons if desired, confirm project release statuses/links and review existing legal text. Local review routes (`/directions/`, `/review/original-animation/`) and draft routes should be considered explicitly then; all are noindex now. No push, deployment, publication, DNS/credential change, service purchase, payment use or banked quota reset occurred.
