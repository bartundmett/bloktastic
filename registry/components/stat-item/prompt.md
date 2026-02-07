# Stat Item

## Purpose
Single KPI/stat block for metrics such as growth, users, and performance.

## Storyblok Schema Fields
- `value` (text, required): Primary metric value, e.g. 125K
- `label` (text, required): What the metric represents
- `helper` (text): Optional context or change indicator

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
interface StatItemProps {
  // Map Storyblok fields to your frontend props here
}
```

## Edge Cases
- Missing optional media or links.
- Extremely long text content.
- Empty collections in nested blok fields.
