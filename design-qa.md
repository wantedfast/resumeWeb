# Hero Design QA

## Evidence

- Motion reference: `C:\Users\wangf\Downloads\SaveTik.co_7643096942432247793.mp4`
- Motion-reference contact sheet: `tmp/reference-motion/reference-contact-sheet.jpg`
- User-reported misalignment: `C:\Users\wangf\AppData\Local\Temp\codex-clipboard-4731d797-24a5-481b-81fd-513276c1bbfd.png`
- Final centering comparison: `tmp/qa-final-centering-comparison.png`
- Continuous-motion comparison: `tmp/qa-motion-comparison.png`
- Revised final state: `tmp/qa-captures/hero-final-centered-1442x711.png`
- Revised one-wheel state: `tmp/qa-captures/hero-motion-after-wheel-1442x711.png`
- Standard timeline start: `tmp/qa-captures/hero-standard-start.jpg`
- Standard timeline one-wheel state: `tmp/qa-captures/hero-standard-one-wheel.jpg`
- Standard timeline final state: `tmp/qa-captures/hero-standard-final.jpg`
- Standard motion comparison: `tmp/qa-standard-motion-comparison.png`
- Standard final-centering comparison: `tmp/qa-standard-final-comparison.png`
- Current QA viewport override: 1442 × 711 CSS px. The in-app capture surface produced 1427 × 704 pixels; the 1378 × 709 user source and implementation were normalized to the same 1378 × 709 comparison size in `tmp/qa-final-centering-comparison.png`.
- Source visual truth: `tmp/hero-chapter-contact-sheet.jpg`
- Final combined comparison: `tmp/qa-comparison-final.jpg`
- Desktop implementation states: `tmp/qa-captures/hero-1.png` through `hero-6.png`
- Lanyard states: `tmp/qa-captures/lanyard-front.png` and `lanyard-back.png`
- Responsive evidence: `tmp/qa-mobile500-final.jpg`
- Desktop capture: 1440 × 900 output pixels, 960 × 600 CSS viewport at system density 1.5.
- Responsive capture: 500 × 844 output pixels and CSS viewport, density 1.
- States: all six settled Hero chapters; Lanyard front and back; desktop and narrow layout.

## Required Fidelity Surfaces

- Fonts and typography: Archivo and IBM Plex Mono are retained from the original site. Display copy uses the existing thin editorial hierarchy; long right-aligned headings were reduced to prevent clipping.
- Spacing and layout rhythm: chapter copy follows the visual openings in each source frame. The final chapter is positioned inside the black laptop screen. Existing header and all content below Hero are preserved.
- Colors and tokens: the original black, paper, muted, and burgundy palette is retained. A restrained black gradient improves text contrast without changing the source imagery.
- Image quality: all six states use the approved 2560 × 1440 frame sequence. No placeholder, CSS-drawn, or approximate imagery is used.
- Copy and content: all six agreed English chapters are present. Numeric Hero labels were removed. The two named live products and Microsoft open-source/global-work statement are included.

## Interaction and Runtime Checks

- Native scrolling is no longer intercepted or converted into chapter-sized jumps.
- Scroll distance maps continuously across all 362 frames. A GSAP `power2.out` scrub tween follows each new scroll target over 1.28 seconds.
- A real-browser 180px wheel test stayed in `IDENTITY` while the canvas advanced gradually through frames 1, 7, 12, 14, 16, and 17; it did not jump to `THE QUESTION`.
- Reverse scrolling moved the canvas through frames 11, 3, and 0 and returned cleanly to the Hero start.
- Chapter starts are independent timeline markers at 0%, 15%, 30%, 46%, 62%, and 80%.
- The camera reaches frame 361 at 88% and remains on frame 361 through 100%, leaving 12% of scroll travel for the final copy and CTA.
- The Hero travel distance is 6 viewports, making the complete sequence 1.25× faster while preserving all chapter percentages and the final hold.
- The final `ABOUT ME` state settles on the laptop-screen frame and remains stable.
- Front and back Lanyard states render as one physical card; the card remains on one cord.
- Real pointer testing confirmed the drop animation, click-to-flip state, drag click-suppression, and elastic return.
- About Me opens the Lanyard; `VIEW FULL PROFILE` closes it and lands the existing `#about` section at the viewport top.
- Reduced-motion rules remain in place.
- Vite production compilation succeeds. The repository's pre-existing Sites post-build script still expects `dist/client/index.html`; that unrelated packaging step was not changed.
- No application JavaScript errors were observed in the local capture run. Chrome emitted only host USB/PWA-install diagnostics.

## Comparison History

1. P2: long right-aligned chapter headings wrapped too aggressively and approached the viewport edge.
   - Fix: increased the right chapter measure and reduced its display size.
   - Post-fix evidence: `tmp/qa-captures/hero-2.png` through `hero-4.png`.
2. P1: an asynchronous initial-frame callback could redraw frame one after a later chapter frame had already been selected.
   - Fix: the preload completion now redraws `frameRef.current`, not a hard-coded first frame.
   - Post-fix evidence: `tmp/qa-comparison-final.jpg` shows all six distinct source-aligned frames.
3. P2: narrow-layout headings were oversized.
   - Fix: added a bounded mobile type scale and narrower paragraph measure.
   - Post-fix evidence: `tmp/qa-mobile500-final.jpg`.
4. P1: flipping the card caused the open-animation effect to rerun and immediately reset the card to its front face.
   - Cause: the inline `onClose` callback changed identity on every render and retriggered the Lanyard effect.
   - Fix: stabilized the close callback with `useCallback`.
   - Post-fix evidence: browser state retains `.identity-card__flip.is-flipped`, exposes the back face, and completes the full-profile jump.
5. P1: a single mouse-wheel action advanced a complete chapter, making the camera feel like a frame swap instead of a dolly move.
   - Cause: the wheel handler prevented native scrolling and tweened the document by one full viewport per wheel event.
   - Fix: removed wheel interception and chapter snapping; native scroll now feeds a continuous GSAP scrub proxy with a 1.6-second eased follow.
   - Post-fix evidence: `tmp/qa-motion-comparison.png` and the measured browser progress samples above.
6. P1: the final About Me copy was anchored to the right column and overflowed the perceived laptop-screen center.
   - Fix: anchored the content at the source screen's measured center, constrained it to a 640px / 48vw measure, and balanced the display heading.
   - Post-fix evidence: `tmp/qa-final-centering-comparison.png` shows the reported state and corrected state together.
7. P2: the initial continuous implementation still coupled text timing to equal-sized chapter interpolation and only exposed the final CTA near the very end.
   - Fix: separated camera progress from content progress, assigned six explicit narrative windows, completed the camera at 88%, and reserved the remaining 12% for the final state.
   - Post-fix evidence: browser data proves frame 361 at both 88% and 100%; `tmp/qa-standard-final-comparison.png` and `tmp/qa-standard-motion-comparison.png` show the final visual states.
8. P3: the approved standard motion felt slightly too slow.
   - Fix: shortened Hero travel from 7.5 to 6 viewports and reduced the GSAP scrub from 1.6 to 1.28 seconds, producing a uniform 1.25× speed increase.
   - Post-fix evidence: a 180px wheel now settles at frame 17 while remaining in `IDENTITY`; `tmp/qa-speed125-motion-comparison.png` shows the start and settled one-wheel states.

## Residual Polish Check

- The functional wheel, GSAP scrub, and drag paths are verified. Trackpad momentum can still receive a subjective feel check on the user's own hardware; this is not a visual or functional blocker.

final result: passed

---

# Portfolio Work Index and Project Detail QA

## Evidence

- Source visual truth:
  - `C:\Users\wangf\AppData\Local\Temp\codex-clipboard-7009b16b-f143-4e06-a3c3-e4632b3b1b46.png`
  - `C:\Users\wangf\AppData\Local\Temp\codex-clipboard-5fd768ec-9a9a-4660-baa9-581c3bdac4bf.png`
  - `C:\Users\wangf\Documents\王欣隆简历\audit\design-qa-v2\employee-card-portrait-reference-clean.png`
- Browser-rendered implementation:
  - `C:\Users\wangf\Documents\王欣隆简历\audit\design-qa-v2\implementation-selected-work.png`
  - `C:\Users\wangf\Documents\王欣隆简历\audit\design-qa-v2\implementation-work-experience.png`
  - `C:\Users\wangf\Documents\王欣隆简历\audit\design-qa-v2\implementation-about-portrait-final.png`
  - `C:\Users\wangf\Documents\王欣隆简历\audit\design-qa-v2\implementation-project-detail.png`
- Combined comparisons:
  - `C:\Users\wangf\Documents\王欣隆简历\audit\design-qa-v2\comparison-selected-work.png`
  - `C:\Users\wangf\Documents\王欣隆简历\audit\design-qa-v2\comparison-work-experience.png`
  - `C:\Users\wangf\Documents\王欣隆简历\audit\design-qa-v2\comparison-portrait.png`
- Browser viewport: 1280 x 720 CSS pixels. Browser screenshots are 1264 x 720 pixels because the visible vertical scrollbar occupies the remaining width. Device density is 1.
- Source pixels: Selected Work 1759 x 703; Work Experience 1718 x 344; portrait reference 155 x 387. Final portrait asset is 1122 x 1402 and renders at an effective 4:5 ratio.
- State: centered headings, automatic carousel, manual next control, About portrait, AI-KANOJO detail route, all seven direct project routes, unknown route, and return navigation.

## Required Fidelity Surfaces

- Fonts and typography: the existing Archivo and IBM Plex Mono system is preserved. `Work experience` and `Selected work` use the same computed 121.6px size, 104.576px line height, -8.7552px letter spacing, and centered alignment at the QA viewport. The requested kickers and periods are absent.
- Spacing and layout rhythm: both section headings use the same centered spacing system. The work viewport retains approximately three visible cards, a compact counter, and right-aligned controls. Detail pages use a fixed left project index and a wide editorial reading column.
- Colors and visual tokens: the existing warm black, burgundy, paper, and beige tokens remain consistent. The project detail surface uses the site's established warm beige rather than introducing a new palette.
- Image quality and asset fidelity: the final portrait is a true generated outpaint from the employee-card portrait reference, with centered framing, black shirt, beige background, no card border, and no text. Existing project covers remain real raster assets; project detail pages do not introduce fake screenshots.
- Copy and content: seven projects have distinct context, problem, workflow, capabilities, technical decisions, contribution, limitations, status, stack, and links. AI Trading Helper explicitly avoids investment-advice or return claims. No under-review publication was added.

## Interaction and Runtime Checks

- The card transforms moved approximately 44 pixels left over 1.2 seconds, matching the intended 36px/s automatic motion without wheel or vertical-scroll input.
- The next button advances from the currently visible project and the loop resumes automatically after the transition.
- Hover/focus selectors expose the glare and summary layer; pointer position updates the spotlight coordinates. Reduced-motion disables continuous looping and the glare while retaining the horizontal list and controls.
- All seven `/projects/:slug` routes were opened directly. Each rendered eight content sections and the correct active left-sidebar entry.
- `BACK TO SELECTED WORK` returned to `/#work`. An unknown project slug rendered the dedicated project-not-found state.
- Browser logs contained Vite connection messages and the React development notice only; no application errors were observed.
- `npm run build` and `git diff --check` pass.

## Comparison History

1. P2: the first manual-next implementation used a stale loop index after autoplay and could jump from the visible fourth card to the second card.
   - Fix: the loop now synchronizes its current index to the nearest timeline label on every update, and arrows target the current visual index.
   - Post-fix evidence: browser retest advanced `01 / 07` to `02 / 07`, then confirmed the transforms continued changing after the transition.
2. P2: the first outpaint used the full employee-card image as reference and drifted farther from the embedded portrait.
   - Fix: isolated the employee-card portrait as a reference-only crop and regenerated the 4:5 outpaint with explicit identity invariants.
   - Post-fix evidence: `comparison-portrait.png` and `implementation-about-portrait-final.png`.

## Residual Polish

- The continuous carousel and card effects are tuned for desktop, as requested. Narrow layouts remain accessible and avoid page-level overflow but were not treated as a separate mobile art direction.

final result: passed

---

# Burgundy Lanyard and Site Palette QA

## Evidence

- Selected visual reference: `C:\Users\wangf\AppData\Local\Temp\codex-clipboard-506970c7-89a5-430a-bb5b-71d7ef33fd71.png`
- Exact portrait crop used by the card: `public/assets/wang-xinlong-card-reference.png`
- Final front state: `tmp/qa-captures/lanyard-burgundy-front-final.jpg`
- Final back state: `tmp/qa-captures/lanyard-burgundy-back-final.jpg`
- Reference and implementation at the same 1280 x 720 size: `tmp/qa-captures/lanyard-burgundy-comparison.png`
- Final Hero start: `tmp/qa-captures/hero-burgundy-fresh.jpg`
- Final NOW section: `tmp/qa-captures/now-burgundy-final.jpg`
- QA viewport: 1280 x 720 CSS pixels.

## Visual Decisions and Checks

- The selected asymmetric card composition is retained: stacked name at left, narrow portrait at right, burgundy upper field, warm-red footer, milk-white type and cord.
- The portrait is cropped directly from the user-selected reference instead of being regenerated, preserving the approved face, lighting, and crop.
- At the shared 1280 x 720 comparison size, the implementation card is 360 x 530 pixels and closely matches the reference card's scale and center position.
- Site colors now use warm black, deep wine burgundy, warm red, milk-white, and warm ivory. Section hierarchy remains intact; red is used as an anchor rather than as a uniform full-site fill.
- The Hero display scale was reduced while preserving the existing six-chapter camera timeline and source imagery.
- No black-and-white identity-card treatment remains.

## Interaction and Runtime Checks

- About Me opens one physical lanyard card.
- Clicking the card adds `.identity-card__flip.is-flipped` and exposes the complete profile back.
- `VIEW FULL PROFILE` closes the overlay and lands `#about` at the viewport top.
- Existing drag, elastic return, close, reduced-motion, and Hero scroll code paths were preserved.
- Vite compilation succeeds. The repository's pre-existing `prepare-sites-build.mjs` still expects `dist/client/index.html`; that unrelated Sites packaging step was not changed.

## Comparison History

1. P2: the first burgundy implementation was visibly smaller than the selected reference and sat too high.
   - Fix: increased the desktop card from 340 x 510 to 360 x 530 and aligned its top to 17.5vh.
   - Post-fix evidence: `tmp/qa-captures/lanyard-burgundy-comparison.png`.
2. P2: the first card body left too much empty lower space and made the name feel secondary.
   - Fix: increased the editorial body height, enlarged the condensed name, and extended the portrait field.
   - Post-fix evidence: `tmp/qa-captures/lanyard-burgundy-front-final.jpg`.
3. P2: the previous cool black/gray surfaces conflicted with the approved reference.
   - Fix: replaced the site tokens and major section surfaces with the reference's warm burgundy family while retaining contrast and content hierarchy.
   - Post-fix evidence: `tmp/qa-captures/hero-burgundy-fresh.jpg` and `tmp/qa-captures/now-burgundy-final.jpg`.

final result: passed
