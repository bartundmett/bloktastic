# Image Component

## Purpose
Render optimized Storyblok images with responsive behavior and semantic caption support.

## Storyblok Schema Fields
- `asset` (asset, required)
- `alt` (text)
- `caption` (textarea)
- `ratio` (option)
- `loading` (option)

## Visual Requirements
- Preserve intrinsic dimensions when ratio is auto.
- Support object-fit cover for fixed ratios.
- Caption should be visually tied to image.

## Accessibility
- Always provide non-empty alt text for meaningful images.
- Allow empty alt text for decorative images.
- Ensure caption contrast and readable text size.

## Edge Cases
- Missing asset should render safe placeholder block.
- Broken URL should fail gracefully.
- Very long captions should wrap naturally.
