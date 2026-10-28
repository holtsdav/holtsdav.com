# Bounded outbound link audit — 21 October 2026

**No confirmed wrong-project or broken destination found.** Reviewed implementation commit `e984f63e23c785e45110edd2c99783952bf63e9b` is preserved; no product edits or replacement URLs are proposed. One profile remains identity-unverified because LinkedIn gates it behind sign-in.

Extracted the actual rendered outbound anchors from the local reviewed build, including project pages, utility pages, support and legal/privacy pages. There are **38 unique outbound destinations: 16 HTTPS URLs and 22 mailto URLs**. Repeated destinations were deduplicated. No internal-route/Safari retest or external-site crawl was performed. See [complete inventory with labels/routes](inventory.json) and [structured audit](audit.json).

| Displayed destination | Read-only result |
| --- | --- |
| [Glassdays App Store](https://apps.apple.com/de/app/glassdays-countdown/id6785538729) | Redirects to [Countdown - Glassdays](https://apps.apple.com/de/app/countdown-glassdays/id6785538729), retaining app ID `6785538729`. Listing names David Holtschke and matches countdowns/widgets. Harmless title-slug redirect; existing URL works. |
| [Mute On Location Mac App Store](https://apps.apple.com/de/app/mute-on-location/id6790398791?l=en-GB&mt=12) | Exact URL opened in background browser. Listing names Mute On Location, David Holtschke, Mac and location-based audio muting. Web-reader access failure was a tool limit, not a broken link. |
| [GitHub profile](https://github.com/holtsdav) | Public holtsdav / David Holtschke profile. |
| [PDF Editor GitHub](https://github.com/holtsdav/PDF-Editor) | Public owner/repository match; describes an Obsidian PDF forms/ink plugin. |
| [Room Planner GitHub](https://github.com/holtsdav/RoomPlanner) | Public owner/repository match; describes the 2D room planner. |
| [Room Planner tool](https://holtsdav.com/RoomPlanner) | Destination identifies Room Planner and exposes room dimensions, object library and plan canvas. No tool actions performed. |
| [Rogue Color itch.io](https://holtsdav.itch.io/rouge-color) | Public page identifies **Rogue Color by holtsdav** and its color-switching survival mechanics. The existing `rouge-color` URL spelling is intentional and resolves correctly; do not “correct” it by guessing. No game was run or downloaded. |
| [LinkedIn profile](https://www.linkedin.com/in/david-holtschke) | **Login-gated; identity not independently confirmed.** Web reader returned 999; background browser redirected to LinkedIn’s Join/Sign in authwall carrying the requested profile URL. No login attempted. This is not evidence of a 404 or different person; no replacement URL is justified. |
| [Existing NotiLog shortcut](https://www.icloud.com/shortcuts/150326e49cfb495dbd292fc1c7ab2f07) | Public Shortcuts page loaded with heading **NotiLog** after its initial loading state. No add/install/run action or action-body verification. This validates destination identity only, not notification capture or real automation. |
| [Cloudflare privacy](https://www.cloudflare.com/privacypolicy/) | Cloudflare’s Privacy Policy, matching legal link label. |
| [Hourglass Bold source](https://api.iconify.design/solar/hourglass-bold.svg) | Exact URL renders the bold hourglass SVG. The official Glassdays listing independently includes this same Solar/Iconify attribution URL. Not a placeholder or missing asset. |
| [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) | Attribution 4.0 International license deed, matching attribution label. |
| [Apple privacy](https://www.apple.com/legal/privacy/) | Apple Customer Privacy Policy destination and topic selector loaded. Its full JavaScript-driven policy body was not comprehensively audited. |
| [Apple App Privacy guidance](https://developer.apple.com/help/app-store-connect/manage-app-information/manage-app-privacy/) | Apple Developer’s Manage app privacy / App Store Connect Help page. |
| [TelemetryDeck privacy](https://telemetrydeck.com/privacy/) | TelemetryDeck Privacy Policy, matching all three translated link labels. |
| [RevenueCat privacy](https://www.revenuecat.com/privacy/) | Redirects to [the slashless privacy URL](https://www.revenuecat.com/privacy); RevenueCat Privacy Policy. Harmless canonicalization, no correction needed. |

All **22 mailto destinations** decode to the single expected `contact@holtsdav.com` recipient. Project/support subjects match the displayed project names; only the expected subject parameter is present, with no CR/LF injection. [Checks](mailto-checks.json). No mail client was opened and no message was sent, so mailbox ownership, deliverability and response handling are not certified.

Retrieval used the web reader, with one hidden background-browser visit for reader-inaccessible Mute On Location, NotiLog, LinkedIn and Iconify, plus Apple’s dynamic privacy destination. Browser evidence is saved alongside this report. The temporary tab was closed. No sign-in, form submission, contact, install, external download, Library write, publication or push occurred.

“Verified” here means the destination content matched the displayed identity at this check. It is not an HTTP uptime guarantee, a destination functional test or approval of privacy-policy contents. The web reader may use cached pages; no precise numeric HTTP status is claimed unless exposed by its tool result. Existing five owner-only tracked modifications remain unstaged; the Git index is empty.
