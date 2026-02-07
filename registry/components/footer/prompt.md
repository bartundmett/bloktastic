# Footer

## Purpose
Multi-column footer with branding, navigation groups, legal text, and socials.

## Storyblok Schema Fields
- `brand_name` (text, required): Brand or company name
- `tagline` (text): Short footer tagline
- `link_columns` (textarea, required): Define links as Column|Label|URL per line
- `copyright_text` (text, required): Legal footer line
- `show_social_links` (boolean): Render social link icons

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
interface FooterProps {
  // Map Storyblok fields to your frontend props here
}
```

## Edge Cases
- Missing optional media or links.
- Extremely long text content.
- Empty collections in nested blok fields.
