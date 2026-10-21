# Independent first design review

Reviewed 21 October 2026. Scope: supplied desktop Workspace/Gallery/Shelf, mobile Workspace, and desktop/mobile folder screenshots; accompanying workspace source. This is an independent design recommendation, not David’s acceptance and not a completed interaction/route audit. No product source, original checkout, app or running session was changed.

## Recommendation

**Refine B / Gallery as the primary portfolio direction.** It puts real product UI in front of a visitor immediately, with little text and a clear route into the functional dock/folder. C / App shelf is a coherent secondary index, but largely duplicates the Projects folder. A / Workspace should not be the primary direction: the six detached app icons still form an orbit around the name and look recognizably like the previously rejected constellation. Changing their exact positions and reducing the copy does not remove that composition. On mobile the spacing between the two upper icons, central name and lower icons makes the orbit resemblance especially explicit.

B is not yet distinctive enough to call finished. Its same-size rounded pastel capture frames are a familiar gallery pattern; polish should come from the genuine screenshots, deliberate image scale/crops and consistent icon/dock materials. Avoid adding slogans, badges or decorative headings to compensate. Keep the particle identity compact enough that actual work remains visible on the first desktop screen.

## Observed visual findings

1. **Particle legibility needs refinement.** The supplied animated Workspace capture is much fainter and more perforated than the static fallback. Whole glyph strokes are weak at normal viewing size. Increasing contrast/point coverage is justified under the allowed particle-detail adaptation; preserve pairing, sampling, original timeline and movement mechanics. The source read already shows a 1.5× point-size-only adjustment underway, so the first screenshot is evidence of the earlier state rather than a judgment of that unrendered adjustment.
2. **A repeats the rejected hierarchy.** The app orbit is still the main supporting composition. Do not sink more polish into A without a new owner preference for it.
3. **B provides actual portfolio substance.** Existing Glassdays, Mute, PDF, Room Planner and Rogue Color captures let the work speak. Missing screenshots should not become fabricated app previews. The full verified set can remain accessible through Projects; a featured home gallery need not repeat every no-image item as a placeholder card.
4. **C is orderly but redundant.** All ten projects are discoverable and the icon hierarchy is consistent. As a home screen, it presents the same collection already available in the folder. Use it for the explicit project index or as an alternative retained for owner review.
5. **Folder material is promising.** Desktop and mobile share a credible restrained window treatment, genuine names and ten clear icon targets. The visual source is column-major (three items per column), leaving the last column mostly empty. This is not a functional defect, but confirm the intended reading/order against a familiar folder grid. Do not switch CSS flow without updating arrow-key calculations.
6. **Small labels require real-size QA.** Mobile folder labels are 9px under 420px. Their targets appear generously spaced, but names such as Mute On Location/Glassdays Catalog must be assessed at 320px and browser text zoom. Readable text must not be traded away merely to retain a fixed miniature desktop.

## Concrete source concerns to verify/fix

- `src/styles/workspace.css`: `.workspace-more` is fixed at `right:24px` on desktop, while its invoking button is in a centered dock. This places the menu far away from the control. Anchor it to More, including when the dock grows.
- `src/scripts/workspace.ts:13`: render updates the dock but not `[data-folder-project]` links. Open/current project states are absent from the folder. Add restrained opened/current indicators and accessible state names without introducing extra copy.
- `src/scripts/workspace.ts:29`: external manual pause is independent of the original element’s motion-preference handler. Reproduction to test: Pause → change OS preference to reduce → change it back to no-preference. The original element can restart while the external button still says Play animation and `aria-pressed=true`. A manual pause must persist through those preference changes.
- `src/pages/projects/[slug].astro:12`: no-image entries render a 420px repeated-icon panel. It is truthful but risks looking like an unfinished placeholder. Inspect every such rendered page and use an intentional compact arrangement if no useful real artifact exists. Do not claim an app demo was reviewed for those entries.
- `src/styles/workspace.css`: dock close buttons are 22px on mobile and the opened strip clips overflow. Check actual all-ten-open keyboard focus rings, close targets and touch access; their presence alone does not establish usability.
- `src/scripts/workspace.ts:24`: initialize expanded state and give every folder trigger the same popup/controls semantics, not only the dock button.

## Provenance and limits

`src/scripts/original-wordmark-light.ts` is the correct active implementation to compare with original Git HEAD. The separate retained `src/scripts/particle-wordmark.ts` remains copied owner dirty work and should not be used to evaluate the new effect. The active file currently differs by two color literals and a point-size multiplier; no timeline or pairing change was observed in that comparison.

PDF Editor and AuxJam use neutral newly drawn navigation glyphs, not verified original app logos. SaveShelf’s icon is reconstructed from its original layered icon source. Preserve those distinctions in the handoff; do not describe all icons as unchanged original assets.

Still pending for independent acceptance: actual normal/reduced-motion animation frames after contrast refinements, every project route and link, More, legal/contact continuity, live preference changes, no-JS/WebGL fallback, all-open dock states, 320px/medium-height screens, keyboard and touch. Build success is not substituted for those observations.
