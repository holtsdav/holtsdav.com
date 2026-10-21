# Local portfolio implementation commit scope

Branch: `codex/portfolio-workspace-20261021`. Starting commit: `b9069c2c2578d162102d416d877af5042afa33b6`.
The implementation commit is local only. David's aesthetic acceptance remains open.
Exact final commit identity and the matching Git tree are saved after the commit in `local-commit.json`.

## Exact allowlist

`commit-allowlist.json` lists all **92 exact paths** selected for staging. No broad `git add .` or `git add -A` is used in the implementation worktree. The preexisting index was verified empty before staging. Source/assets, local verification helpers, authored review records and six representative PNGs are included. Worker/production configuration, credential files, dependencies, old worktrees and native app sources are excluded.

## Copied owner work excluded

These five files are unchanged from the copied owner baseline, and are deliberately left unstaged:

- `DESIGN.md` — SHA-256 `3f6accb525926178b9569516829c67a5ff8e22e3e080b5ab6a06b8c864c0d2d5`
- `src/components/Header.astro` — SHA-256 `5cde86394ec21e6c44750fdf583f80b993498364596e3437e4853636ad7a64d6`
- `src/components/ParticleWordmark.astro` — SHA-256 `e4ff1002f42033fe137b949901c2ee48815e026f93a81acc3f50432f2e421b69`
- `src/scripts/particle-wordmark.ts` — SHA-256 `50be43f53cb89e7f396f3277b1d604d6c826605667be86cb352a420baf69d7ee`
- `src/styles/global.css` — SHA-256 `06f9cf39fc12e23d4a81e54f6ed808fb209334acefca666189dbbeecf3e6e217`

`BaseLayout.astro` and `contact.astro` were also originally copied, but their current small implementations wholly replace the old layout/form and are reviewed portfolio changes. Their prior owner bytes remain in the separately saved, untracked `copied-owner-baseline.patch`. Original checkout hashes and status were verified unchanged; no original index or branch was switched.

## Review and checks

The exact staged path set must equal the allowlist, and each staged blob must equal its reviewed working file. The staged binary diff is preserved locally outside the commit as `staged-reviewed.patch`, with its hash in `local-commit.json`. The diff was reviewed for route/alias consistency, actual project content and artwork provenance, motion source parity, keyboard/touch/reduced-motion handling, explicit privacy-draft status, and absence of production/credential/native changes.

The clean candidate uses starting HEAD plus only allowlisted product files, excluding all five copied owner-only files. It builds all 47 HTML pages. Its 24 desktop/mobile Home/project/utility/legal comparisons have matching computed layout/styles and **24/24 pixel-identical captures** against the reviewed 4330 preview; zero browser exceptions. `clean-commit/comparison.json` and the separate local `clean-commit-build.log` record that check. The active stylesheet owns its light palette and used legal styles independently of copied legacy styles. The larger browser/motion/independent checks are documented in the root review deliverable; their scope and physical-device limits are unchanged.

## Deliberately local artifacts

Bulk raw captures, native-result attachment exports, process logs/PIDs, archives and patches, post-commit hashes/manifests, pending Library uploads and Library operation receipts remain local outside this commit. Selected review documents can refer to that complete local evidence tree; the commit does not pretend to include every raw attachment. The separate source exports are regenerated after the commit. The exact commit product archive excludes the copied owner-only files; the full working archive retains the documented owner baseline. No Library write or retry is part of this commit task.

Git commit hooks and signing are disabled for this one local command to avoid invoking unrelated installed automation or signing credentials. The previously required safe checks have been run explicitly. This does not modify repository/global Git configuration, run a remote operation, publish the website or grant sharing access.
