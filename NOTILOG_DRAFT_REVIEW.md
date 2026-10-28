# NotiLog support and privacy drafts — local review only

Prepared 20 October 2026 in the existing isolated website worktree:

`/Users/holtsdav/Documents/Codex/2026-10-20/task-2/holtsdav-portfolio-dock`

**Result:** the missing website content now has reviewable local drafts. No public URL was published or configured in the app. Existing policies, including the empty `/privacy/notilog/` route, were not replaced.

## Routes and review

Start the existing [preview script](docs/review-2026-10-20/start-preview.sh), then use:

| Content | Local preview | Intended final destination, subject to approval |
| --- | --- | --- |
| Support draft | `http://127.0.0.1:4326/support/notilog/` | `https://holtsdav.com/support/notilog/` |
| Separate privacy draft | `http://127.0.0.1:4326/drafts/notilog-privacy/` | `https://holtsdav.com/privacy/notilog/` |

The HTTPS destinations above are **proposals, not verified live pages**. The privacy draft deliberately lives separately from the existing policy route. Both draft pages have a visible “Local draft · Not published” notice, marked review points, `noindex, nofollow`, and no canonical URL suggesting a live approved policy. They are not promoted as a released app on the homepage. No download, price or App Store release claim was added.

The preview is stopped after QA. To restart:

```sh
cd /Users/holtsdav/Documents/Codex/2026-10-20/task-2/holtsdav-portfolio-dock
sh docs/review-2026-10-20/start-preview.sh
```

## Gap found

The app's main repository already contains `docs/SUPPORT.md`, `docs/PRIVACY.md`, native capture help and a native privacy view. Its release checklist explicitly leaves public support/privacy URLs pending, and `SupportDestinations.swift` hides invalid/unset URLs. The website's generated NotiLog privacy page has no policy body and no dedicated support route existed.

The new pages adapt those existing drafts, verify their technical statements against source, and make unresolved release/privacy decisions visible. The app's Info.plist URL keys and existing public-policy generator were not edited.

## Source baseline versus a released build

| Source | Reviewed state | Interpretation |
| --- | --- | --- |
| `/Users/holtsdav/Documents/Dev/NotiLog` | Clean `main`, `d9d851f202c964f7f8c4610245ac48404d5b7c13` | Current main source; not proof of an App Store release or of a particular installed build. |
| `/Users/holtsdav/Documents/Codex/2026-10-20/task/worktrees/notilog-history` | Clean `codex/overnight-20261020-notilog-history`, `ad651a1c4d54196f2973acb511f67ea4a637a322` | Separately reviewed retention safety fix; integration and release are not established. |

Read the app worker's `task/SECOND_PASS_REPORT.md` and the independent `task-6/INDEPENDENT_SAFETY_REVIEW.md`. The former documents the captured dirty baseline that had mapped Forever to 90 Days. The reviewed fix restores Forever and preserves valid current/legacy preference intent; malformed current settings cannot reactivate a legacy finite choice. It does not recover data already deleted.

Main already has 7 Days, 30 Days, 90 Days and Forever. The new drafts describe that reviewed source behavior, while explicitly marking the safety fix as not established as shipped. Neither native branch, a real notification archive, user preferences nor a physical device was modified or accessed for these drafts.

## Technical content and evidence

Code paths in the table are relative to the main repo’s `NotiLog/` source directory; docs and project configuration paths are relative to the repo root. [The evidence manifest](docs/review-2026-10-20/notilog-source-evidence.json) records exact source paths, SHA-256 hashes, commit IDs, source status, all app module imports, and existing-policy preservation hashes.

| Statement in the drafts | Source backing / limit |
| --- | --- |
| Selected-app Shortcuts automation passes new notification fields to Archive Notification; no historical Notification Center recovery | `Intents/ArchiveNotificationIntent.swift`, `Features/Setup/ShortcutsIntegration.swift`, `docs/SHORTCUTS_SETUP.md`, `docs/SUPPORT.md`. Capture reliability while locked, terminated or after reboot remains a hardware acceptance question, not a promise. |
| iPhone/iPad source targets iOS/iPadOS 27+ | `project.yml` deployment target; the final release build and supported versions still require confirmation. |
| Local notification title/subtitle/body, source app IDs/names, dates/repeated occurrences, time-sensitive status and pins | `Services/Backup/ArchivedNotificationDTO.swift`, `NotificationOccurrenceDTO.swift`, and the capture intent. No real notification content or backup was read. |
| Local SwiftData storage; CloudKit disabled | `Persistence/NotiLogPersistence.swift`, `Resources/NotiLog.entitlements`; `cloudKitDatabase: .none`, empty entitlements. Distinguish app sync from user-selected Files storage and OS backups. |
| Four retention choices; finite cleanup uses latest capture and excludes pins | `Services/Retention/RetentionPeriod.swift`, `RetentionSettings.swift`, `Persistence/NotificationStore.swift`; main and candidate distinctions noted above. |
| Removal preview/confirmation/export-first when eligible entries would be deleted; no promise of a confirmation when none qualify | `Features/Settings/SettingsView.swift`, `Services/Retention/RetentionChange.swift`. |
| Manual backup contains readable JSON, not app-encrypted export | `Services/Backup/BackupService.swift`, `NotiLogBackupDocument.swift`, DTOs; Files destination is user-selected and separate providers have their own terms. CryptoKit is used elsewhere in the app and does not turn this JSON exporter into encrypted backup storage. |
| Optional interface lock uses system biometric/passcode authentication; it does not encrypt exports or disable the capture intent | `Services/Authentication/AuthenticationService.swift`, `ArchiveNotificationIntent.swift`, native policy/support docs. Hardware acceptance still pending. |
| Apple lookup sends source-app bundle ID and storefront; notification text is not in that request | `Services/AppIcons/AppStoreMetadataService.swift`, request builder and country fallback. The draft explicitly says this reveals the queried app identifier/storefront to Apple. |
| Artwork fetches and local caching | `Services/AppIcons/AppIconService.swift`; follows the artwork URL returned by metadata lookup. |
| Shared shortcut uses Apple's iCloud Shortcuts service | Existing `ShortcutsIntegration.swift` URL; the draft links the existing source destination but does not install, modify or run a shortcut. |
| No account/custom backend/cloud sync or third-party ads/analytics/purchase/crash-reporting integration found in reviewed source/config | `README.md`, `project.yml`, project configuration, app imports and URLSession call sites. This is scoped source evidence, not a claim about Apple diagnostics, support providers or a future build. |
| Public URL configuration remains pending | `Utilities/SupportDestinations.swift`, `Resources/Info.plist`, release checklist; no app URL key was set by this task. |

The privacy draft links [Apple's privacy information](https://www.apple.com/legal/privacy/) for its services. Apple's [current App Privacy guidance](https://developer.apple.com/help/app-store-connect/manage-app-information/manage-app-privacy/) calls for privacy answers to match the app's actual practices, including integrated third-party partners, and to remain current. The draft does not declare final App Store labels, promise legal compliance or infer “no network use” from a manifest or SDK scan.

## Questions for David before publication

1. **Which exact build will ship?** Is the reviewed retention safety fix integrated, and do its settings/upgrade behavior match the approved copy? Main source, the preserved dirty branch and the proposed fix must not be conflated with a released app.
2. **Capture and authentication acceptance:** Are the setup labels and iOS/iPadOS minimums final? Have repeated capture, locked/terminated/rebooted device cases, multiple apps and App Lock/passcode flows passed on hardware?
3. **Public URLs and contact:** Are the proposed support/privacy destinations and `contact@holtsdav.com` approved for NotiLog? Publication and app/store URL configuration remain separate later actions.
4. **Data outside the app:** Which support email provider, retention period and request-handling process apply? What Apple diagnostics/App Store metrics or other tools are used outside source code? Confirm operator/contact details and any applicable policy requirements before approval.
5. **Final consistency:** Do the shipping privacy manifest, native policy, website policy and App Store privacy answers agree? Have all marked uncertainties been resolved before removing the draft banner?

These questions are recorded for review; no answers or approval were assumed.

## Checks and screenshots

- **Build:** 31 pages, passed. [Log](docs/review-2026-10-20/notilog-draft-build.log).
- **Frontend TypeScript:** passed. [Log](docs/review-2026-10-20/notilog-draft-types.log).
- **Draft browser QA:** 9 checks passed, with external browser requests blocked. [Log](docs/review-2026-10-20/notilog-draft-qa.log) · [JSON](docs/review-2026-10-20/notilog-draft-qa.json).
- **Responsive painted bounds:** 320, 390, 621, 768, 1024 and 1440 px for each draft.
- **Accessibility:** one H1/main, valid section labels, unique IDs, usable TOC anchors, skip-link focus, visible keyboard focus, heading clearance below the fixed header, reduced-motion behavior, computed text contrast and no-JavaScript content checked. This is targeted QA, not a comprehensive certification.
- **Links:** both local draft routes and their relative destinations return 200; TOC targets resolve; mailto links use the existing public mailbox; outgoing links use HTTPS. No external shortcut was installed or executed and no email/contact form was sent. Public support/privacy HTTPS URLs are not asserted live.
- **Preservation:** existing privacy source/layout files match the original repo byte for byte; native main and proposed safety-fix worktree remain clean. See [source/policy evidence](docs/review-2026-10-20/notilog-source-evidence.json).
- **Sensitive-data boundary:** no private archive, user notification, credential, private source URL or local source path was placed into either served draft. Browser checks verify no `/Users/` path or credential marker in the document.

| Draft | Desktop | Mobile |
| --- | --- | --- |
| Support | [Screenshot](docs/review-2026-10-20/screenshots/desktop-notilog-support.png) | [Screenshot](docs/review-2026-10-20/screenshots/mobile-notilog-support.png) |
| Privacy | [Screenshot](docs/review-2026-10-20/screenshots/desktop-notilog-privacy-draft.png) | [Screenshot](docs/review-2026-10-20/screenshots/mobile-notilog-privacy-draft.png) |

Implementation: `src/pages/support/notilog.astro`, `src/pages/drafts/notilog-privacy.astro`, `src/components/DraftDocument.astro`, `src/styles/document-draft.css`. Reproducible checks: `scripts/verify-notilog-drafts.mjs` with the same bundled Playwright/Chromium environment as the main portfolio QA script.

No remaining execution blocker for local review. Owner decisions and final-build verification remain before any publication. No app changes, pushes, production changes, purchases, spending or quota resets occurred.
