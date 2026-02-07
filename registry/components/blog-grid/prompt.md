# Blog Grid

## Purpose
Recent articles section with teaser cards for content marketing pages.

## Storyblok Schema Fields
- `headline` (text, required): Section headline
- `intro` (textarea): Optional intro text
- `posts` (bloks, required): Collection of teaser cards
- `show_view_all` (boolean): Render a view-all link button
- `view_all_link` (multilink): Destination for all posts

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
interface BlogGridProps {
  // Map Storyblok fields to your frontend props here
}
```

## Edge Cases
- Missing optional media or links.
- Extremely long text content.
- Empty collections in nested blok fields.
