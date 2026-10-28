# Portfolio and NotiLog draft re-verification

Checked 2026-10-20 12:03 UTC at David's request. No production source changes were made during this pass. The Glassdays app/share-card redesign remains separately assigned.

## Preview is running for David

**http://127.0.0.1:4326/** — bound to loopback only and deliberately kept available.

| Review view | Verified local URL |
| --- | --- |
| Portfolio | http://127.0.0.1:4326/ |
| Glassdays app/project page | http://127.0.0.1:4326/apps/glassdays-countdown/ |
| Equivalent Glassdays project route | http://127.0.0.1:4326/project/glassdays/ |
| Mute On Location | http://127.0.0.1:4326/apps/mute-on-location/ |
| Room Planner description | http://127.0.0.1:4326/apps/room-planner/ |
| NotiLog support draft | http://127.0.0.1:4326/support/notilog/ |
| NotiLog privacy draft | http://127.0.0.1:4326/drafts/notilog-privacy/ |
| Contact page | http://127.0.0.1:4326/contact/ |

All eight returned HTTP 200 with expected titles. The two NotiLog routes remain visibly unpublished review drafts and do not imply that the proposed public URLs are live. Contact delivery is not claimed verified; no form or email was sent, and the local preview does not start the contact worker.

**Ownership:** this task's retained exec session **74988**, listener Node PID **8053**, parent PID **7952**, user **holtsdav**. Verified listener CWD: `/Users/holtsdav/Documents/Codex/2026-10-20/task-2/holtsdav-portfolio-dock`. Started with `sh docs/review-2026-10-20/start-preview.sh`, which rebuilds before serving. [Process/ownership evidence](preview-process.json). The server is kept running under the explicit new request; do not infer teardown from older overnight reports.

The verification itself used separate temporary headless browser profiles, then closed them. After the parent confirmed foreground AllKeyShop work was finished and authorized opening the preview, a new Safari tab was opened in the existing review window. The same window UUID and the existing five tabs were preserved; Safari now shows six tabs and the portfolio at `http://127.0.0.1:4326/`. [Opening confirmation](safari-opening.json).

## Checks

- Fresh Astro build: **31 pages**, passed; [preview/build log](preview.log).
- Frontend TypeScript and contact-worker TypeScript: passed; [frontend](frontend-types.log), [worker](worker-types.log).
- Existing mocked contact tests: **22 passed**; [log](contact-tests.log). No real message was sent.
- Portfolio browser suite: **13 passed**; [log](browser-qa.log), [JSON](browser-qa.json). Covers painted hero bounds at 320/390/620/621/700/701/768/800/801/900/901/1024/1440 px, filters, direct hidden-project reveal, dock anchors/state, 71 sequential keyboard targets, skip/focus, copy feedback, local routes, corrected release copy, aliases, images, text contrast, reduced motion and no-JavaScript use.
- NotiLog draft browser suite: **9 passed**; [log](notilog-draft-qa.log), [JSON](notilog-draft-qa.json). Covers draft notices/noindex, headings/labels, local links, 320–1440 px text bounds, contrast, keyboard/anchor clearance, reduced motion and no-JavaScript content.
- [Eight exact HTTP routes](http-routes.json) returned 200.
- `git diff --check`: passed; [log](diff-check.log).

The existing suites were copied into this evidence directory with only their output destination changed. Their production source/test originals were not edited. External browser requests remained blocked during QA. This is focused software/browser verification, not hardware acceptance or a comprehensive accessibility certification.

## Preservation and current source

Worktree: `/Users/holtsdav/Documents/Codex/2026-10-20/task-2/holtsdav-portfolio-dock`. Branch `codex/portfolio-dock-20261020`, HEAD `b9069c2c2578d162102d416d877af5042afa33b6`. Feature implementation remains uncommitted as packaged.

- All seven original dirty website files still match the initial hashes; the original checkout's status still matches the original record.
- The existing website T3 checkout remains clean.
- All 31 packaged feature-file hashes still match the packaged patches.
- All 22 original screenshot hashes remain unchanged. New screenshots are in this directory's `screenshots/` subdirectory and do not overwrite overnight evidence.
- All **98 recorded package checksums** match. [Package integrity](package-integrity.json), [preservation record](preservation.json).
- NotiLog main remains clean at `d9d851f202c964f7f8c4610245ac48404d5b7c13`. Draft publication, release-build selection and retention-safety-fix integration still need the review described in the existing handoff.

The adoption manifest remains its packaging-time status snapshot. This pass adds only separate verification evidence; it does not rewrite that package or its checksums. Original checkout, app repositories, credentials, user sessions and production are untouched.

No execution blocker remains. The localhost preview remains available for David. No publishing, deployment, purchases, spending or quota resets occurred.
