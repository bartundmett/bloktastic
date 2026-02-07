# Feature Item

## Purpose
Reusable feature item with icon, title, and short description for feature grids.

## Storyblok Schema Fields
- `icon` (text): Icon identifier from your icon set
- `title` (text, required): Feature title
- `description` (textarea, required): Short feature explanation
- `link` (multilink): Optional link for more details

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
interface FeatureItemProps {
  // Map Storyblok fields to your frontend props here
}
```

## Edge Cases
- Missing optional media or links.
- Extremely long text content.
- Empty collections in nested blok fields.
