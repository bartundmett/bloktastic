# @bloktastic/color-picker

Advanced color picker field plugin with preset palettes, opacity control, and CSS color output for brand-consistent content styling.

## What It Does

Color Picker extends the default Storyblok color field with richer editing capabilities:

- **Visual color wheel** with saturation and lightness controls
- **Preset palette** support for enforcing brand colors
- **Opacity/alpha** slider for transparent color values
- **Output formats** — hex, rgb, rgba, or hsl strings
- **Color swatch preview** inline in the field list

## Use Cases

- Section background colors that editors can customize per page
- Accent color overrides for CTAs and highlights
- Theme-aware components where editors pick from a constrained palette
- Badge and tag color assignments in content models

## Setup

1. Install the color picker plugin in your Storyblok space.
2. Add a field of type `plugin` referencing the color picker to your component schema.
3. Optionally configure a preset palette in the plugin options to restrict choices to brand colors.

## Rendering

The field stores the selected color as a string value (e.g., `"#E8956C"` or `"rgba(232, 149, 108, 0.8)"`). Apply it directly as a CSS custom property or inline style in your component.

```html
<section :style="{ backgroundColor: blok.background_color }">
  <!-- content -->
</section>
```

## Links

- [Storyblok Marketplace](https://www.storyblok.com/marketplace)
- [Field Plugin Docs](https://www.storyblok.com/docs/plugins/field-plugins)
