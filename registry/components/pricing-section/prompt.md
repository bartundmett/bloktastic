# Pricing Section

## Purpose
Pricing block with nested pricing tiers and optional comparison context.

## Storyblok Schema Fields
- `headline` (text, required): Pricing section headline
- `subline` (textarea): Optional section copy
- `tiers` (bloks, required): List of pricing tier items
- `show_annual_toggle` (boolean): Display monthly/annual UI switch
- `note` (text): Optional legal/pricing note

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
interface PricingSectionProps {
  // Map Storyblok fields to your frontend props here
}
```

## Edge Cases
- Missing optional media or links.
- Extremely long text content.
- Empty collections in nested blok fields.
