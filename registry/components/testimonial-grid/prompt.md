# Testimonial Grid

## Purpose
Testimonials section with nested testimonial items and flexible layout options.

## Storyblok Schema Fields
- `headline` (text, required): Section headline
- `intro` (textarea): Optional supporting copy
- `testimonials` (bloks, required): List of testimonial items
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
interface TestimonialGridProps {
  // Map Storyblok fields to your frontend props here
}
```

## Edge Cases
- Missing optional media or links.
- Extremely long text content.
- Empty collections in nested blok fields.
