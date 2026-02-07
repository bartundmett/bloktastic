# CTA Banner

## Purpose
Call-to-action section with compact copy, button, and optional supporting text.

## Storyblok Schema Fields
- `headline` (text, required): Banner heading
- `subline` (textarea): Supporting copy
- `primary_cta` (bloks, required): Primary CTA button
- `secondary_cta` (bloks): Optional secondary CTA button
- `style` (option): Visual treatment

## Visual Requirements
- Design for responsive marketing pages (mobile, tablet, desktop).
- Keep spacing and hierarchy clear for conversion-focused sections.
- Support optional content gracefully without visual gaps.

## Accessibility
- Use semantic sectioning and heading structure.
- Ensure interactive elements are keyboard reachable with visible focus states.
- Maintain WCAG-compliant contrast in all supported styles.

## Example Props Structure
```typescript
interface CtaBannerProps {
  // Map Storyblok fields to your frontend props here
}
```

## Edge Cases
- Missing optional media or links.
- Extremely long text content.
- Empty collections in nested blok fields.
