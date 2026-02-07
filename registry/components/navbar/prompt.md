# Navbar

## Purpose
Responsive navigation header with logo text, menu links, CTA, and mobile-friendly behavior.

## Storyblok Schema Fields
- `logo_text` (text, required): Brand text shown in navbar
- `menu_links` (textarea, required): One per line: Label|/path or Label|https://url
- `cta_button` (bloks): Optional primary button in navbar
- `sticky` (boolean): Keep navbar fixed to top on scroll
- `theme` (option): Navbar color mode

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
interface NavbarProps {
  // Map Storyblok fields to your frontend props here
}
```

## Edge Cases
- Missing optional media or links.
- Extremely long text content.
- Empty collections in nested blok fields.
