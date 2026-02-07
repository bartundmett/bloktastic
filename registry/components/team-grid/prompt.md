# Team Grid

## Purpose
Team showcase section with nested team member cards.

## Storyblok Schema Fields
- `headline` (text, required): Team section heading
- `subline` (textarea): Optional description
- `members` (bloks, required): List of team member bloks
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
interface TeamGridProps {
  // Map Storyblok fields to your frontend props here
}
```

## Edge Cases
- Missing optional media or links.
- Extremely long text content.
- Empty collections in nested blok fields.
