# Accordion Item

## Purpose
Single item for accordion content with title, rich text body, and optional icon.

## Storyblok Schema Fields
- `title` (text, required): Question or heading text
- `content` (richtext, required): Expandable answer or body content
- `icon` (asset): Optional icon shown next to title

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
interface AccordionItemProps {
  // Map Storyblok fields to your frontend props here
}
```

## Edge Cases
- Missing optional media or links.
- Extremely long text content.
- Empty collections in nested blok fields.
