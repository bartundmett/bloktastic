# Stats Section

## Purpose
Section for key metrics and KPIs with nested stat items.

## Storyblok Schema Fields
- `headline` (text): Optional section title
- `stats` (bloks, required): Collection of stat item bloks
- `alignment` (option): Text alignment strategy
- `columns` (option): Desktop column count

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
interface StatsSectionProps {
  // Map Storyblok fields to your frontend props here
}
```

## Edge Cases
- Missing optional media or links.
- Extremely long text content.
- Empty collections in nested blok fields.
