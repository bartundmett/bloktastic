# Feature Grid

## Purpose
Marketing feature section with heading and nested feature items in responsive columns.

## Storyblok Schema Fields
- `eyebrow` (text): Optional compact intro label
- `headline` (text, required): Main section headline
- `intro` (textarea): Short intro paragraph
- `items` (bloks, required): List of feature item bloks
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
interface FeatureGridProps {
  // Map Storyblok fields to your frontend props here
}
```

## Edge Cases
- Missing optional media or links.
- Extremely long text content.
- Empty collections in nested blok fields.
