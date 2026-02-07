# Contact Section

## Purpose
Contact form section with heading, descriptive text, and configurable fields.

## Storyblok Schema Fields
- `headline` (text, required): Contact section heading
- `intro` (textarea): Short context text
- `submit_label` (text, required): Submit button text
- `include_company` (boolean): Show company name field
- `include_phone` (boolean): Show phone field
- `include_topic` (boolean): Show inquiry topic dropdown
- `success_message` (text): Message after successful submit

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
interface ContactSectionProps {
  // Map Storyblok fields to your frontend props here
}
```

## Edge Cases
- Missing optional media or links.
- Extremely long text content.
- Empty collections in nested blok fields.
