# Second independent review

21 October 2026. The Gallery direction is now a coherent light portfolio prototype. This is an independent implementation/visual assessment, **not owner design approval**. One concrete keyboard defect remains open below.

## Actual inspection

I viewed the three named Home/Folder/NotiLog Library captures, all ten `qa/screenshots/desktop-project-*` pages, the supplied mobile project captures, full dock at 320/390/1440, More at desktop/phone, folder at 320/390/768, and About, Support, Contact, Privacy and Impressum. I also viewed all four paired desktop/mobile forward/reverse motion contact sheets, pointer before/during/recovery, reduced-motion and unavailable-WebGL captures.

The home now gives real product UI a useful place without orbit decoration or filler headings. Project titles, status, screenshots and the restrained dock belong to the same light visual language. The compact factual profiles are a material improvement over repeated empty icon panels. They state useful project details honestly when no real product screenshot exists. More is visibly anchored to its actual dock button, and the folder now distinguishes opened/current projects.

The light particle text has substantially better whole-glyph coverage than the first iteration. Both settled names remain readable; the original spatial morph, mobile split name and pointer disturbance/recovery remain recognizable through the captured frames. An independent source comparison found the active `original-wordmark-light.ts` identical to the original dark Git source after normalizing only the two palette literals and the 1.5× point-size multiplier. Hashes match the motion report: original `e25857389d53ea36d5df75708dc0f0662864de789f3a9d5d58782ed455467921`; light `cebccdbe6aa5798a0aadf815de8dd0b43b6dafc2a9975b18b8d4ce08fe843adc`.

These observations support the current direction and source continuity. They do not imply that the icon-only entries have real app-screen captures, that neutral PDF/AuxJam navigation glyphs are official logos, or that every project is publicly released.

## Open P1: all-open dock clips keyboard-focused targets

I ran a separate focused headless check against the existing stable preview `http://127.0.0.1:4330/`, without a build or new server. For each of 320, 390 and 1440px, all ten verified projects were added to that isolated browser session. From Home I used real Tab navigation through all 20 project links/close buttons. No application/source state outside this isolated browser was changed.

**At 320px, the actual focused target is partially hidden, not merely its outline.** After focusing Home then pressing Tab, Glassdays has `x=36..95`, while the opened-project strip clips at `x=76..176`. Most of its icon and name are hidden underneath the Home area. Tabbing to Mute On Location produces `x=140..199`, with the right side clipped behind Projects. At 390px, focus also clips at the strip edges. At 1440px, the targets fit but their top/bottom focus outlines are cut by the scroll container. All 60 sampled observations have some ring clipping; none has a whole bounding box outside the viewport. This distinction explains why a viewport-only assertion or `inDock || !overlap` does not catch it.

Evidence:

- [320px first project focused](independent-second/dock-focus-320-0.png)
- [320px middle project focused](independent-second/dock-focus-320-6.png)
- [390px last project focused](independent-second/dock-focus-390-18.png)
- [Desktop clipped focus ring](independent-second/dock-focus-1440-0.png)
- [All 60 measured observations](independent-second/focused-qa.json)
- [Focused check source](independent-second/focus-check.mjs)

The strip currently has a smaller padding gutter than the 8px outline extent. Fix both problems: on any strip focus, ensure the focused project/close control lies completely inside the strip’s real clipping rectangle, with space for its ring; provide enough padding or an intentional inset outline. Keep scrolling contained to the strip so the page does not arrive vertically scrolled. Use measured rectangles rather than assuming `offsetLeft` is relative to the strip. Recheck normal Tab as well as the explicit arrow handlers.

## Minor presentation observation

The unavailable-WebGL capture has a readable static identity, which is correct, but still offers “Pause animation” despite no running renderer. Hiding or relabeling that control when no animation is available would be clearer. This is a minor fallback-state issue, not a reason to restart the design.

## Limits and next boundary

The parent’s in-progress exhaustive run was interrupted by rebuilding/image decode timing; I do not classify that as a product image failure. Fresh stable main-suite results remain the parent’s responsibility. This pass independently checks the reported clipping with a live browser and inspects the supplied actual route/motion evidence; it does not duplicate the complete suite or claim physical touch/foreground Safari verification.

No foreground UI, simulator, native app source, production resource, original website checkout or product source was changed. Only this review and its independent evidence were written. After the dock focus fix, a focused verification of the same 60 targets should close the concrete review blocker. Aesthetic acceptance remains David’s decision.
