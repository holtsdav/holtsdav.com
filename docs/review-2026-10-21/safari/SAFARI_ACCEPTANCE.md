# Actual Safari acceptance — 21 October 2026

The bounded native Safari check passed without a demonstrated product defect. Reviewed implementation commit `e984f63e23c785e45110edd2c99783952bf63e9b` remains unchanged. David’s aesthetic acceptance is still open.

Tested the running local prototype at `http://127.0.0.1:4330/` in **Safari 27.0.1 (22625.1.29.11.28)** using native accessibility and ordinary mouse/keyboard input. No WebDriver, browser JavaScript injection, security/automation preference change, or permission acceptance was used.

## Observed behavior

- **Original particle sequence:** 202 native PNG observations over 13.54 seconds show holtsdav holding, morphing into David Holtschke, holding, and reversing into holtsdav. The light colors remain legible. See [motion contact sheet](motion-contact-sheet.png), [timestamps](motion-observations.json), and the full `motion-*.png` sequence. Capture elapsed time is not a precise animation-clock measurement or a frame-rate benchmark.
- **Projects:** all ten icons and names appear in three rows and four columns, with no clipped items at desktop or the half-width native window. Close receives visible focus; Option-Tab enters links; Right then Down moved Glassdays to ReviewBar as expected. Escape returned focus to the dock Projects invoker; Return reopened the folder.
- **Dynamic dock:** opening Glassdays and NotiLog added both icons; switching to Glassdays retained both. Closing active Glassdays returned Home and retained NotiLog. All ten project routes were subsequently opened through the address bar and appeared once each in the dock. Each route’s title, real content and URL were observed in native Safari; see [route log](native-route-log.json).
- **Overflow and keyboard:** in the native half-width window, Home/Projects/More remained visible while the opened-project strip scrolled. Option-Shift-Tab moved focus from the last project to the first, revealing NotiLog with its focus ring fully visible. Option-Tab then Return closed inactive NotiLog while retaining the current Glassdays JSON Editor route. See [overflow focus](narrow-overflow-keyboard.png) and [close result](inactive-close-ax.txt).
- **More:** About, Support, Privacy and Impressum were each opened through the menu and their destination content verified. Escape closed More and restored its button focus. No external links, mail links, forms or sharing controls were activated.
- **Narrow composition:** Home wordmark, controls and first-row captions remained legible above the dock; folder labels wrapped without clipping. Screenshots: [Home](narrow-home.png), [folder](narrow-folder.png), [ten opened projects](narrow-ten-open-dock.png). The native capture narrowed from 3024×1726 to 1512×1726 physical pixels using Window → Move & Resize → Left. This is a desktop Safari window check, not an iPhone device test.

Safari’s existing keyboard preference skipped links with ordinary Tab. Its standard Option-Tab navigation reached links and the application’s arrow navigation/focus behavior worked. No preference was changed.

## Preservation and coordination

PDF, SaveShelf and NotiLog confirmed foreground holds; the parent explicitly confirmed Glassdays had released all UI/runtime/build work. Only a new Safari test window was used. That window was closed, and the pre-existing Start Page window was preserved. Explicit release messages were sent to all four workers immediately after the UI checks. No Simulator, production, publishing or Library action occurred.

[Final verification](final-verification.json) confirms the implementation commit, original checkout HEAD/status, all seven original dirty-file hashes and the five owner-only baseline copies remain unchanged; the index is empty. Safari evidence is local and uncommitted so the reviewed implementation commit is preserved. The existing 4330 preview server remains untouched. A redundant shell HTTP spot check was prevented by the restricted network sandbox; the actual Safari route loads succeeded immediately before closing the test window.

## Remaining limits

This supersedes the earlier blanket “Safari unverified” caveat for the interactions above. Physical iPhone/iPad Safari, touch behavior, VoiceOver and Safari under the OS reduced-motion preference remain unverified. No OS setting was changed for this check. Existing Chromium reduced-motion/WebGL-fallback evidence remains separately documented and is not represented as Safari coverage. Smoothness, battery use and animation frame pacing have not been benchmarked. The earlier Library upload denial remains in force; no new upload was attempted.
