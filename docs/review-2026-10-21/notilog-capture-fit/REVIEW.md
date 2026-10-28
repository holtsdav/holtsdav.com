# NotiLog native capture fit — retain current page

Inspected the corrected NotiLog native PNG manifest, final review and package validation from source commit `164f3308438abbebbf0f532bde92466b24285355`. The captures are authentic shared native UI with synthetic review states, with explicitly bounded automation/geometry coverage. The light Capture Settings and Capture Check screens were inspected directly. The waiting-after-local-sample screen was the strongest candidate because it does not visually imply that real automation was validated.

Built an unlinked local comparison page from the existing compiled NotiLog page, adding only that unchanged raw PNG at a restrained maximum width of 330px and the caption “Development preview · synthetic data · automation not tested.” The existing “In development” status remained. No giant duplicate icon, feature panel or additional heading was introduced. Rendered the candidate and current page in a hidden IAB browser at **1440×900** and **390×844**, then visually inspected all four screenshots.

**Decision: keep the current compact page.** The image primarily adds setup/check instructions rather than showing the History/search/pinning experience. At restrained desktop scale its dense text is small; enlarging it makes a setup panel dominate the project page. On mobile it extends the page with more instructional text and a required caveat. The Duo’s side-mounted clock/status area also looks awkward when presented as a conventional phone screenshot. It is useful engineering evidence, but it does not materially improve this portfolio composition.

- [Desktop comparison](comparison-1440.png): current page left, candidate right.
- [Mobile comparison](comparison-390.png): current page left, candidate right.
- [Provenance and decision record](decision.json), including the verified source-image hash.
- `candidate.html` preserves the trial as a local review artifact with the PNG embedded; its stylesheet/icon URLs require the running loopback preview.

No product source or asset changed, and no incremental implementation commit was made. Reviewed portfolio commit `e984f63e23c785e45110edd2c99783952bf63e9b` remains unchanged. The unlinked candidate was removed from the running preview, the temporary browser tab was closed, and its viewport override was reset. No native foreground UI, Simulator, build, Library upload, publication or push occurred.

A future useful capture would show the real History/search interface with clearly synthetic demo notifications and accurately labelled development status, preferably in standard-phone geometry when a safe runtime is available. No runtime work is requested or required for this decision.
