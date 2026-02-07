# Pricing Tier

## Purpose
Single pricing card tier with plan name, price, features, and CTA settings.

## Storyblok Schema Fields
- `plan_name` (text, required): Tier name, e.g. Pro
- `price` (text, required): Price text, e.g. $29
- `billing_period` (text): Period text, e.g. /month
- `feature_list` (textarea, required): One feature per line
- `cta_label` (text, required): Button label
- `cta_link` (multilink): Button destination
- `highlighted` (boolean): Visually emphasize this tier

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
interface PricingTierProps {
  // Map Storyblok fields to your frontend props here
}
```

## Edge Cases
- Missing optional media or links.
- Extremely long text content.
- Empty collections in nested blok fields.
