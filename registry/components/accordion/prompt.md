# Accordion Component

## Purpose
Build an accessible accordion for FAQs and stacked disclosure content.

## Storyblok Schema Fields
- `items` (bloks, required)
- `allow_multiple_open` (boolean)
- `first_open` (boolean)
- `style` (option)

## Visual Requirements
- Header row with title and chevron icon.
- Smooth open/close animation.
- Support default, bordered, and separated variants.

## Accessibility
- WAI-ARIA accordion semantics.
- Keyboard toggle via Enter/Space.
- Visible focus styling.

## Edge Cases
- Empty list should not render container.
- Extremely long titles should wrap.
- Respect reduced-motion preference.
