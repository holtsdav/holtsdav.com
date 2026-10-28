> Historical version 1 record. The homepage was redesigned after owner feedback. See [PORTFOLIO_V2_REVIEW.md](PORTFOLIO_V2_REVIEW.md) for the current preview, motion evidence and fresh adoption patch. Version 1 packages remain preserved for comparison.

# Adoption manifest — breakfast handoff

The review package is ready. **No adoption was performed in an original checkout.** This manifest separates pre-existing owner work, newly authored portfolio changes, and the unpublished NotiLog drafts.

## Exact state

- **Website original:** `/Users/holtsdav/Documents/Dev/holtsdav.com`
- **Original branch/head:** `main` / `b9069c2c2578d162102d416d877af5042afa33b6`
- **Isolated worktree:** `/Users/holtsdav/Documents/Codex/2026-10-20/task-2/holtsdav-portfolio-dock`
- **Worktree branch/head:** `codex/portfolio-dock-20261020` / `b9069c2c2578d162102d416d877af5042afa33b6`
- **Worktree status:** 17 modified tracked paths, 82 untracked paths including review evidence, **0 staged**. These counts are expanded paths, not the compact directory counts from default git status.
- **All implementation remains uncommitted.** HEAD is the starting commit, not a new feature commit. Do not treat this branch's HEAD as a fix commit to cherry-pick.

[Exact porcelain status](docs/review-2026-10-20/adoption/git-status-porcelain.txt) · [Every changed path and its ownership](docs/review-2026-10-20/adoption/changed-files.json) · [Machine-readable manifest](docs/review-2026-10-20/adoption/adoption-manifest.json).

## 1. Pre-existing owner baseline

The seven original dirty tracked files were copied into the isolated worktree before any portfolio edits. Their initial hashes still match the original checkout. This is preserved owner work, **not newly authored overnight implementation**:

- `DESIGN.md` — copied owner work only; excluded from our fix patch.
- `src/components/Header.astro` — copied owner work only; excluded from our fix patch.
- `src/components/ParticleWordmark.astro` — copied owner work only; excluded from our fix patch.
- `src/layouts/BaseLayout.astro` — owner changes plus our additional portfolio delta.
- `src/pages/contact.astro` — copied owner work only; excluded from our fix patch.
- `src/scripts/particle-wordmark.ts` — copied owner work only; excluded from our fix patch.
- `src/styles/global.css` — copied owner work only; excluded from our fix patch.

[Copied owner baseline patch](docs/review-2026-10-20/copied-local-baseline.patch) · [Initial inventory and hashes](docs/review-2026-10-20/baseline-inventory.json).

The current original checkout already contains these owner edits. **Do not apply the copied-baseline patch to it again.** That patch is only for reconstructing this baseline in a separate checkout of `b9069c2c2578d162102d416d877af5042afa33b6`. Untracked `.claude/` and `.codex/` settings and ignored credentials were not copied into either patch or the reconstruction.

## 2. Portfolio fix-only patch

**[portfolio-fixes.patch](docs/review-2026-10-20/adoption/portfolio-fixes.patch)** — 20,005,085 bytes, 26 paths, real Git binary patch with the four existing app screenshots and the original Room Planner SVG included. It is the delta **after the copied owner baseline**, including the independently requested P2 fixes and safe legacy aliases. It excludes the NotiLog document drafts and owner-only dirty changes.

- `Assets/app-icons/room-planner.svg`
- `Assets/glassdays-screenshots/create-dark.png`
- `Assets/glassdays-screenshots/folders.png`
- `Assets/glassdays-screenshots/home-light.png`
- `Assets/glassdays-screenshots/widgets.png`
- `docs/review-2026-10-20/start-preview.sh`
- `public/_redirects`
- `scripts/verify-portfolio.mjs`
- `src/components/GlassdaysPage.astro`
- `src/components/PortfolioDock.astro`
- `src/components/PortfolioHome.astro`
- `src/layouts/BaseLayout.astro`
- `src/middleware.ts`
- `src/pages/Glassdays.astro`
- `src/pages/MuteOnLocation.astro`
- `src/pages/NotiLog.astro`
- `src/pages/RogueColor.astro`
- `src/pages/apps/glassdays-countdown.astro`
- `src/pages/apps/mute-on-location.astro`
- `src/pages/apps/room-planner.astro`
- `src/pages/index.astro`
- `src/pages/project/[slug].astro`
- `src/pages/project/glassdays.astro`
- `src/scripts/portfolio.ts`
- `src/styles/glassdays-case.css`
- `src/styles/portfolio.css`

The startup helper always rebuilds current source before serving, so an older `dist/` cannot display stale content after adoption. This is the only packaging-time behavior adjustment; no product feature was added in the packaging pass.

## 3. Unpublished NotiLog draft patch

**[notilog-drafts.patch](docs/review-2026-10-20/adoption/notilog-drafts.patch)** — 30,709 bytes, 5 additive paths. It was checked against the reconstructed portfolio state and leaves existing privacy routes, native app code and URL configuration alone:

- `scripts/verify-notilog-drafts.mjs`
- `src/components/DraftDocument.astro`
- `src/pages/drafts/notilog-privacy.astro`
- `src/pages/support/notilog.astro`
- `src/styles/document-draft.css`

Local routes: `/support/notilog/` and `/drafts/notilog-privacy/`. These are visibly marked drafts, not verified public URLs. See [NotiLog source evidence and review questions](NOTILOG_DRAFT_REVIEW.md). The proposed final privacy route `/privacy/notilog/` remains unchanged.

The supported package order in another isolated checkout is: documented owner baseline, portfolio fix patch, then optional NotiLog draft patch. No patch was applied to the actual original checkout.

## Non-mutating apply checks

| Check | Result |
| --- | --- |
| Copied owner baseline patch against a disposable archive of the clean starting HEAD | `git apply --check`, exit 0 |
| Portfolio fix patch against the **actual original dirty checkout** | `git apply --check`, exit 0; no files written |
| Portfolio fix patch against a second reconstructed owner baseline | `git apply --check`, exit 0 |
| NotiLog draft patch after portfolio in the disposable reconstruction | `git apply --check`, exit 0 |
| Every reconstructed feature file, including binary assets | Exact content hashes match this worktree |

[Commands, results and hashes](docs/review-2026-10-20/adoption/adoption-manifest.json). `git apply --check` on the actual checkout was read-only. The only real patch applications and fixture commits were inside owned disposable directories, which were removed after verification.

The direct check can be repeated without applying anything:

```sh
git -C /Users/holtsdav/Documents/Dev/holtsdav.com apply --check \
  /Users/holtsdav/Documents/Codex/2026-10-20/task-2/holtsdav-portfolio-dock/docs/review-2026-10-20/adoption/portfolio-fixes.patch
```

If the original HEAD or baseline hashes have changed since this record, review a newly reconstructed baseline; do not force the patch over newer user work. The earlier `implementation-only.diff` is a human-readable comparison, not the recommended adoption patch. The two `.patch` files above are the complete, binary-capable adoption artifacts.

## Clean startup and preview verification

Current delivered worktree, using its already available local dependencies:

```sh
cd /Users/holtsdav/Documents/Codex/2026-10-20/task-2/holtsdav-portfolio-dock
sh docs/review-2026-10-20/start-preview.sh
```

Open `http://127.0.0.1:4326/`. The script selects an existing Node 24 installation for this process, rebuilds, then serves the review. It changes no shell/profile settings. If dependencies are missing in a future checkout, use Node 24 and the retained lockfile with `npm ci` first; the helper does not install anything automatically. To choose a different free loopback port, set `PORTFOLIO_PORT` for that command.

Verification used a disposable checkout assembled **only from the original commit, the recorded owner baseline and these two patches**. It began with **no `dist/`, `.astro/`, or dependency build caches**. Existing dependencies were copied locally; no package installation or remote service was used. Running the delivered helper built **31 pages**, then served on `127.0.0.1:4348`:

- Homepage, Glassdays project page, Mute landing page, NotiLog support draft and NotiLog privacy draft all returned **HTTP 200** with the expected titles.
- **18 local CSS/image resources** returned 200 and matched the fresh build bytes.
- Only this owned preview was stopped afterwards. Existing sessions were not interrupted. Both disposable fixture directories were removed.

[Fresh startup/build log](docs/review-2026-10-20/adoption/fresh-startup.log) · [Route and asset checks](docs/review-2026-10-20/adoption/fresh-preview-check.json).

## Preserved evidence and review scope

- All **22 existing screenshots** retain their hashes: [screenshot checksum list](docs/review-2026-10-20/adoption/screenshots-sha256.txt).
- The original seven dirty source hashes, original HEAD and original status are unchanged. The existing website T3 checkout remains clean.
- Native app source and existing privacy documents were not changed by packaging. No original checkout was reset, stashed, merged, cherry-picked or patched.
- Existing verification remains available: [portfolio/P2 findings and screenshots](PORTFOLIO_FIXES.md), [full portfolio handoff](PORTFOLIO_REVIEW.md), [NotiLog draft handoff](NOTILOG_DRAFT_REVIEW.md).
- [Package/change checksums](docs/review-2026-10-20/adoption/package-sha256.txt) cover the recorded changed files except the checksum file itself. Supporting reports/logs/screenshots are review evidence; they are not all included in the feature patches and do not become public site assets.

No remaining packaging blocker. Local adoption is still an explicit later step; independent review acceptance and NotiLog publication decisions remain separate. No push, publication, production change, purchase, spending or quota reset occurred.
