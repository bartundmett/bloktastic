# Hero Section Component

## Purpose
Create a high-impact hero section for landing pages with clear visual hierarchy and CTA actions.

## Storyblok Schema Fields
- `eyebrow` (text)
- `headline` (text, required)
- `subline` (textarea)
- `primary_cta` (bloks: button)
- `secondary_cta` (bloks: button)
- `background_image` (asset)
- `layout` (option: center, left, split)
- `theme` (option: light, dark, teal-gradient)

## Visual Requirements
- Use large headline scale and balanced max-width.
- Support three layout variants.
- Keep CTA stack responsive.
- Add subtle decorative background shapes.

## Accessibility
- Semantic section and heading tags.
- CTA buttons must be keyboard reachable.
- Ensure color contrast for overlay text.

## Example Props Structure
```ts
interface HeroProps {
  eyebrow?: string;
  headline: string;
  subline?: string;
  layout?: 'center' | 'left' | 'split';
  theme?: 'light' | 'dark' | 'teal-gradient';
}
```

## Edge Cases
- Missing image: use gradient background fallback.
- No CTAs: center text with stronger spacing.
- Long headline: clamp or wrap without overflow.
