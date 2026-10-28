# Portfolio revision 2 — local design review

Current preview: **http://127.0.0.1:4327/**. Previous rejected version: **http://127.0.0.1:4326/**. Both are loopback-only static previews, not public deployments. The new homepage is ready for owner visual review. Browser QA confirms behavior; aesthetic acceptance remains David’s decision.

## Source and direction

Actual website: `/Users/holtsdav/Documents/Dev/holtsdav.com`.

Actual inspiration note: `/Users/holtsdav/Library/Mobile Documents/com~apple~CloudDocs/Vault/holtsdav.com/Resources.md`.

The note links [Cindy Ly](https://www.cindyly.design/) with “Dock for specific Sections, Creativity, Beautiful landing page” and “Hate the forced scroll animation”. I reopened the actual reference and inspected desktop screenshots before this revision. Its compact object dock, personal central element and visual work hierarchy informed this version. No reference artwork, fonts, CSS or animations were copied. [Reference capture](docs/review-2026-10-20/design-revision-20261020/reference-cindy-top.png).

The new homepage uses a white canvas, direct factual text, a project index and real screenshots of Glassdays, Mute On Location and Room Planner. The labeled three-object dock contains an original folder SVG, David’s existing mark, and an original envelope SVG. Native anchor scrolling remains unlocked. The previous orbit composition, large italic slogans and decorative biography treatment were removed from the homepage. Existing app detail pages remain available; this pass concentrates on the portfolio homepage and requested name animation. Their older presentation is not claimed as a newly completed redesign.

## Name animation and actual visual review

The first heading reads **David Holtschke**. “id” and “chke” fade; the remaining fragments travel on separate vertical paths, reverse order, then join as **holtsdav**. Muted navy and green distinguish the surname and first-name parts. It plays once and has a Replay name button. With reduced motion or JavaScript disabled, the full name and persistent derivation remain readable. The accessible heading name is stable throughout.

I inspected actual captured source, extraction, moving and joined frames on desktop and mobile. This caught overlapping fragments in the first attempt; their paths were corrected. I also found and corrected the Contact dock indicator at the bottom of the document. The final screenshots include every decoded project image, rather than a blank lazy image placeholder.

- [Desktop full page](docs/review-2026-10-20/design-revision-20261020/desktop-page.png)
- [Mobile full page](docs/review-2026-10-20/design-revision-20261020/mobile-page.png)
- [Desktop full name](docs/review-2026-10-20/design-revision-20261020/desktop-name-100.png)
- [Desktop extraction](docs/review-2026-10-20/design-revision-20261020/desktop-name-1500.png)
- [Desktop movement](docs/review-2026-10-20/design-revision-20261020/desktop-name-2450.png)
- [Desktop joining](docs/review-2026-10-20/design-revision-20261020/desktop-name-2700.png)
- [Desktop joined name](docs/review-2026-10-20/design-revision-20261020/desktop-name-3700.png)
- [Mobile movement](docs/review-2026-10-20/design-revision-20261020/mobile-name-2450.png)
- [320px reduced motion](docs/review-2026-10-20/design-revision-20261020/name-reduced-320.png)
- [Actual elapsed-time phases](docs/review-2026-10-20/design-revision-20261020/actual-animation-phases.json)

These are background Chromium captures. Safari was deliberately left undisturbed because another task may be using it. Parent can open the new URL when browser coordination permits.

## Checks

- Astro production build: **31 pages**.
- Frontend and contact worker TypeScript: pass.
- Contact tests: **22 passed**, mocked; no emails sent.
- Portfolio browser checks: **13 passed**, including 13 viewport widths from 320 to 1440px, filtering and direct hidden-project links, native dock links and indicators, keyboard skip/focus and dock clearance, copy email, local routes/aliases, image decoding, text contrast, no-JavaScript content and no browser exceptions.
- Name motion: actual text bounds sampled during replay at **320 / 390 / 768 / 1440px**; checks cover bounds, fragment separation, stable accessible name, live reduced-motion preference, resizing mid-animation and no exceptions. Bounds allow up to 3px for normal typographic side bearings; visibly overlapping blocks are not accepted.
- Existing NotiLog website drafts: **9 passed**. They remain local drafts with noindex, no public canonical and visible draft notices; native NotiLog was not modified.

[Portfolio report](docs/review-2026-10-20/design-revision-20261020/browser-qa.json), [animation report](docs/review-2026-10-20/design-revision-20261020/name-animation-qa.json), [draft regression report](docs/review-2026-10-20/design-revision-20261020/notilog-draft-qa.json), [build log](docs/review-2026-10-20/design-revision-20261020/v2-build.log), [contact test log](docs/review-2026-10-20/design-revision-20261020/contact-tests.log).

## Isolation, preservation and adoption

Worktree: `/Users/holtsdav/Documents/Codex/2026-10-20/task-2/holtsdav-portfolio-dock`

Branch: `codex/portfolio-dock-20261020`. Starting HEAD: `b9069c2c2578d162102d416d877af5042afa33b6`. All implementation remains uncommitted and unstaged. No feature commit exists to cherry-pick.

The seven original dirty tracked files were copied before implementation; original hashes still match the initial inventory. Original `.claude/` and `.codex/` settings were not copied. The existing website T3 worktree remains clean. [Initial inventory](docs/review-2026-10-20/baseline-inventory.json), [copied owner baseline patch](docs/review-2026-10-20/copied-local-baseline.patch), [final preservation evidence](docs/review-2026-10-20/design-revision-20261020/final-preservation.json).

The rejected version is preserved as a [source archive](docs/review-2026-10-20/design-revision-20261020/v1-rejected-source.tar.gz) and separate frozen public build in `docs/review-2026-10-20/design-revision-20261020/v1-public-dist/`. Its archive hash is verified in the final preservation record. The old version-1 reports and patches are historical comparison artifacts.

**Current full adoption patch:** [revision-2 portfolio-fixes.patch](docs/review-2026-10-20/design-revision-20261020/adoption-v2/portfolio-fixes.patch), 31 paths, including binary app captures. This is the complete portfolio delta after the recorded owner dirty baseline, not a patch to stack on top of the old portfolio patch. It excludes owner-only dirty files and the separate NotiLog draft patch. [Fresh manifest and apply checks](docs/review-2026-10-20/design-revision-20261020/adoption-v2/adoption-manifest.json).

Patch checks passed against the actual original dirty checkout without applying anything there, and against a disposable reconstruction. Reconstructed feature hashes match current files. The NotiLog draft patch was also checked after the reconstructed portfolio patch. The old adoption package was not overwritten.

No push, deployment, publication, DNS/credential change, purchase, quota reset or original-checkout adoption occurred. PDF-Editor, SaveShelf, NotiLog and MuteOnLocation native sources were not edited. No game work was done.

## Startup

The current detached Python servers own PID **22082** on port **4327** (current `dist/`) and PID **18897** on port **4326** (frozen v1). Their metadata and logs are in the revision evidence directory. Preserve unrelated listeners. The static new preview reflects source changes after a new build.

For another free local preview without stopping either comparison server:

```sh
cd /Users/holtsdav/Documents/Codex/2026-10-20/task-2/holtsdav-portfolio-dock
PORTFOLIO_PORT=4328 sh docs/review-2026-10-20/start-preview.sh
```

Open `http://127.0.0.1:4328/`. The helper selects an available Node 24 runtime, rebuilds source and starts Astro’s local preview. Existing dependencies and lockfile are retained. No services or network setup are required.

Browser checks use the already installed Playwright and Chrome for Testing via `PLAYWRIGHT_MODULE` and `PORTFOLIO_CHROMIUM_PATH`; run `scripts/verify-portfolio-v2.mjs` and `scripts/verify-name-reveal-v2.mjs` against port 4327, or set `PORTFOLIO_PREVIEW_URL` to another loopback preview.

## Suggested follow-up

Review the actual animation through Replay name, then the Work/About/Contact dock on phone and desktop. If this direction is accepted, extend the same restrained visual language to the app detail pages in a separate scoped pass, and replace historical app captures with new release captures when available. Any adoption or publication remains a later explicit action. There is no remaining implementation blocker for this local review.
