# Design QA

## Evidence

- Source visual truth: `C:/Users/wantedfast/.codex/generated_images/019f9d41-3a07-7d23-90bf-0da945f42210/call_ykGbjprNGb2yySwQGSGZWxZc.png`
- Desktop implementation: `work/product-design-audit/12-implementation-desktop-final.png`
- Mobile implementation: `work/product-design-audit/13-implementation-mobile-final.png`
- Full comparison: `work/product-design-audit/14-full-comparison-final.jpg`
- Focused comparison: `work/product-design-audit/15-focused-comparison-final.jpg`
- Desktop CSS viewport: 1280 × 720, device scale factor 1.5
- Source pixels: 1680 × 932
- Implementation pixels: 1280 × 720
- Normalization: source and implementation were normalized to 1280 × 720 for comparison
- State: Chinese locale, empty AI conversation, voice entry ready

## Findings

No actionable P0, P1, or P2 differences remain.

- Typography: the system font stack, compact evidence labels, display-name hierarchy and bilingual fallback match the Apple-like direction. No clipping or broken wrapping is visible.
- Layout rhythm: the academic evidence now occupies a lightweight left evidence layer, ends above the composer, and leaves the center clear for the primary AI action.
- Colors and tokens: near-black neutral glass, system-gray secondary text and restrained Apple blue are used consistently. The warm background image remains the dominant brand atmosphere.
- Image quality: the existing full-bleed background remains sharp and correctly cropped. The portrait was intentionally removed from the wake control; the microphone uses the installed icon library rather than a raster or handmade substitute.
- Copy and content: all three degrees, the accepted paper and scholarship proof remain visible above the fold.
- Accessibility and behavior: the wake control focuses the chat input, has a visible focus ring and semantic label, and reduced-motion behavior remains available. No horizontal overflow was observed at 390 × 844.

## Comparison history

1. P1 — The first implementation retained a visibly boxed, dark academic card.
   - Fix: removed the desktop border and shadow, lowered the material opacity, reduced blur, narrowed the evidence layer and kept only lightweight separators.
   - Post-fix evidence: `work/product-design-audit/09-implementation-desktop-pass2.png`.
2. P2 — The evidence labels still read like numbered dashboard sections.
   - Fix: changed them to editorial labels (“学术背景”, “学术成果”, “奖学金与荣誉”) and removed the redundant education index.
   - Post-fix evidence: `work/product-design-audit/12-implementation-desktop-final.png`.
3. P1 — The original wake control used the portrait as the interaction object.
   - Fix: replaced it with a dedicated frosted microphone control and an “AI READY” state label.
   - Post-fix evidence: `work/product-design-audit/12-implementation-desktop-final.png`.

## Interaction and runtime checks

- Wake control focuses `#agent-question`.
- DeepSeek chat returned a complete Chinese answer.
- Browser console errors: none.
- Desktop and 390 × 844 mobile layouts were captured and inspected.
- Mobile composer remains visible in the initial viewport.

## Follow-up polish

- P3: the generated source uses a slightly brighter outer microphone halo. The implementation keeps it dimmer to avoid a neon or sci-fi appearance and better match the requested Apple restraint.

final result: passed
