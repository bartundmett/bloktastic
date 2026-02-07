# Button Component

## Purpose
Create an accessible CTA button that can render as `button` or `a` depending on whether a link is provided.

## Storyblok Schema Fields
- `label` (text, required)
- `link` (multilink)
- `variant` (option: primary, secondary, ghost, link)
- `size` (option: small, medium, large)
- `full_width` (boolean)
- `disabled` (boolean)

## Visual Requirements
- Primary: solid brand fill with white text.
- Secondary: outlined with brand border.
- Ghost: transparent background with subtle hover.
- Link: text button style.
- Include focus ring and smooth state transitions.

## Accessibility
- Use semantic element (`button` for action, `a` for navigation).
- Keep 44px touch target minimum.
- Add visible focus style and disabled handling.

## Example Props Structure
```ts
interface ButtonProps {
  label: string;
  link?: unknown;
  variant?: 'primary' | 'secondary' | 'ghost' | 'link';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  disabled?: boolean;
}
```

## Edge Cases
- Missing link should still render valid button.
- Long label wraps or truncates gracefully.
- Disabled link must not navigate.
