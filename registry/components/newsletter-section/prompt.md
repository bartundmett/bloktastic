# Newsletter Section

## Purpose
Email capture section for newsletter subscriptions and lead generation.

## Storyblok Schema Fields
- `headline` (text, required): Signup heading
- `subline` (textarea): Optional helper copy
- `placeholder` (text): Email placeholder text
- `button_label` (text, required): Submit button text
- `consent_text` (text): Privacy/compliance helper text
- `success_message` (text): Message shown on successful submit

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
interface NewsletterSectionProps {
  // Map Storyblok fields to your frontend props here
}
```

## Edge Cases
- Missing optional media or links.
- Extremely long text content.
- Empty collections in nested blok fields.
