# Logo Cloud

## Purpose
Trusted-by logo section to showcase customers, partners, and integrations.

## Storyblok Schema Fields
- `heading` (text): Optional section heading
- `logos` (bloks, required): Logo items rendered as image components
- `columns` (option): Number of columns on desktop
- `grayscale` (boolean): Render logos in grayscale until hover

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
interface LogoCloudProps {
  // Map Storyblok fields to your frontend props here
}
```

## Edge Cases
- Missing optional media or links.
- Extremely long text content.
- Empty collections in nested blok fields.
