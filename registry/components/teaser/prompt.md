# Teaser Card Component

## Purpose
Build a reusable teaser card for featured content, services, or product snippets.

## Storyblok Schema Fields
- `eyebrow` (text)
- `headline` (text, required)
- `body` (textarea)
- `image` (bloks: image)
- `cta` (bloks: button)
- `theme` (option)

## Visual Requirements
- Card with clear spacing and hierarchy.
- Optional media at top.
- CTA anchored near bottom when present.
- Hover elevation and subtle motion.

## Accessibility
- Maintain heading hierarchy.
- Ensure card remains readable in all themes.
- Provide meaningful alt text for media.

## Edge Cases
- No image: keep balanced spacing.
- No CTA: render as informational card.
- Long headline/body: avoid layout collapse.
