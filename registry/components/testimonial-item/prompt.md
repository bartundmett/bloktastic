# Testimonial Item

## Purpose
Customer quote item with author details and optional avatar image.

## Storyblok Schema Fields
- `quote` (textarea, required): Customer quote text
- `author_name` (text, required): Customer name
- `author_role` (text): Title and company
- `author_image` (asset): Optional avatar image
- `rating` (option): Optional star rating

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
interface TestimonialItemProps {
  // Map Storyblok fields to your frontend props here
}
```

## Edge Cases
- Missing optional media or links.
- Extremely long text content.
- Empty collections in nested blok fields.
