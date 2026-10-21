# Independent dock finding closure

21 October 2026. The P1 all-open dock clipping finding from [second-review.md](second-review.md) is **closed on the repaired local build served at port 4330**. The original failure screenshots and measurements in `independent-second/` remain unchanged.

I repeated the same independent reproduction, using real Tab focus from Home through all ten project links and ten close buttons at **320, 390 and 1440px**. The resulting **60 observations contain zero clipped focus targets/rings and zero offscreen targets**. This checks the scroll strip’s actual clipping rectangle, including the complete outline spread, rather than accepting viewport visibility alone.

I visually inspected the repaired first and middle targets at 320px, the final target at 390px, the desktop ring and More on mobile. Each focused target is now brought fully into the strip and the whole focus ring is visible. Partially visible neighboring items are expected in the scroll strip; the focused item is complete.

- [320px first item](independent-focus-closure/dock-focus-320-0.png)
- [320px middle item](independent-focus-closure/dock-focus-320-6.png)
- [390px last item](independent-focus-closure/dock-focus-390-18.png)
- [1440px complete ring](independent-focus-closure/dock-focus-1440-0.png)
- [All 60 observations](independent-focus-closure/focused-qa.json)

Additional live checks at 320 and 390px passed: Tab/Enter switches to the focused project; closing the active project returns Home and removes its item; reopening adds it exactly once; closing an inactive project returns focus to Home; More closes with Escape and returns focus to its invoker; switching to NotiLog arrives with `scrollY=0`; no browser JavaScript exceptions occurred. [State checks](independent-focus-closure/state-closure.json) and [reproduction source](independent-focus-closure/state-check.mjs).

No new server/build, foreground UI or native app was started. Product/original sources were not edited. Only the separate independent browser sessions and review evidence were created, and all browser sessions were closed.

No blocking finding remains from this independent review scope. The second review’s minor suggestion to hide “Pause animation” when WebGL is unavailable is a nonblocking fallback-presentation refinement. The parent’s complete stable-build suite, physical touch/foreground Safari checks, and David’s aesthetic acceptance remain distinct; this focused closure does not claim owner approval or production readiness.
