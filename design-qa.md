# Design QA

- Source visual truth: `work/design-qa/source-desktop.png`, `work/design-qa/source-mobile.png`, and the user-supplied attention critique `work/design-qa/attention-source.png`
- Implementation evidence: `work/design-qa/desktop-chat-final.jpg`, `work/design-qa/projects.png`, `work/design-qa/featured-project-final.png`, `work/design-qa/journey-final.jpg`, `work/design-qa/attention-desktop-full.jpg`, and `work/design-qa/attention-mobile-clip.png`
- Comparison image: `work/design-qa/desktop-comparison.png`
- Desktop viewport: 1265 × 712 CSS px, device scale factor 1
- Source pixels: 1530 × 576 at 144 dpi
- Implementation pixels: 1265 × 712 at 72 dpi
- Normalization: both desktop images were normalized to 576 px height before the side-by-side comparison
- State: Chinese locale, AI answer visible, employer evidence rail visible

## Full-view comparison

The original desktop screen divided attention between a central portrait and a detached answer panel at the right edge. The revised screen places the complete answer panel on the visual center line and reserves the left rail for verified education, publication, and honor evidence. The name, positioning statement, answer, and input now read in one top-to-bottom sequence.

## Focused region comparison

- Hero: answer is centered and no longer clipped by the right edge.
- Employer evidence: current Ph.D. study, accepted paper, and two leading scholarships are visible without scrolling.
- Projects: the first case is visually dominant and uses a project-specific asset; capability signals appear before technology tags.
- Journey: experience is presented as a four-card career arc rather than a long low-density list.

## Comparison history

1. P1 — The AI answer competed with the portrait and sat at the right edge.
   - Fix: moved conversation history into a centered, bounded dialogue surface.
   - Post-fix evidence: `desktop-chat-final.jpg`.
2. P1 — No verified employer proof appeared above the fold.
   - Fix: added education, publication, and honors to a persistent left evidence rail.
   - Post-fix evidence: `desktop-chat-final.jpg`.
3. P2 — Projects reused abstract visuals and did not communicate the work quickly.
   - Fix: added three project-specific editorial images and problem/capability/proof signals.
   - Post-fix evidence: `featured-project-final.png`.
4. P2 — Chinese project and journey headings created orphaned final characters.
   - Fix: introduced locale-aware display sizing and balanced heading wrapping.
   - Post-fix evidence: `journey-final.jpg`.
5. P1 — The employer evidence rail showed only the current Ph.D. and omitted the Master and Bachelor degrees.
   - Fix: added all three verified degrees with dates, institutions, and field of study above the fold.
   - Post-fix evidence: `attention-desktop-full.jpg` and `attention-mobile-clip.png`.
6. P1 — Muted transparent text over the interior image had weak contrast and no reliable scan order.
   - Fix: converted the evidence rail into a high-contrast warm-ivory panel, increased identity and evidence typography, and reserved moss green for verified labels.
   - Post-fix evidence: `attention-comparison.jpg`.

## Required fidelity surfaces

- Fonts and typography: display hierarchy is strong; Chinese wrapping was corrected; small evidence labels remain deliberately secondary.
- Spacing and layout rhythm: hero now has a three-zone structure with a stable center; project and journey cards use consistent internal rhythm.
- Colors and tokens: warm bronze, forest, cream, and moss accents remain consistent with the source atmosphere.
- Image quality: supplied portrait and generated project-specific raster assets are sharp and correctly cropped; no placeholder asset remains in the three primary cases.
- Copy and content: above-the-fold claims are resume-grounded and framed for employer scanning.

## Interactions and console

- Tested primary navigation, employer question shortcut, centered answer state, project anchor, and journey anchor.
- No application console errors were observed.
- Tested the revised hero at a 390 × 844 responsive viewport; the full education panel, identity, portrait, and input regions do not overlap.

final result: passed
