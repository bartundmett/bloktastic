# FAQ Section

## Purpose
Frequently asked questions wrapper with optional intro and nested accordion block.

## Storyblok Schema Fields
- `headline` (text, required): FAQ heading
- `intro` (textarea): Optional helper text
- `faq_accordion` (bloks, required): Embed a single accordion blok

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
interface FaqSectionProps {
  // Map Storyblok fields to your frontend props here
}
```

## Edge Cases
- Missing optional media or links.
- Extremely long text content.
- Empty collections in nested blok fields.
