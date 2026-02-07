# Task 8: Starter Components erstellen

## Ziel
Erstelle 5 hochwertige Starter Components für die initiale Registry.

## Voraussetzungen
- Task 7 abgeschlossen (CLI Discovery Commands)

## Components zu erstellen

| Component | Kategorie | Beschreibung |
|-----------|-----------|--------------|
| `@bloktastic/hero` | sections | Full-width Hero mit Headline, CTA, Background |
| `@bloktastic/button` | content | Universeller Button (Primary, Secondary, Ghost) |
| `@bloktastic/image` | media | Responsive Image mit Caption |
| `@bloktastic/teaser` | content | Card-Style Teaser mit Bild, Titel, Text |
| `@bloktastic/accordion` | content | Expandable Accordion mit Items |

## Struktur pro Component

```
registry/components/<name>/
├── bloktastic.json    # Package manifest
├── schema.json        # Storyblok component schema
├── prompt.md          # AI generation prompt
└── README.md          # Documentation
```

---

## Component 1: @bloktastic/button

### `/registry/components/button/bloktastic.json`
```json
{
  "$schema": "https://bloktastic.dev/schema/bloktastic.schema.json",
  "name": "@bloktastic/button",
  "type": "component",
  "version": "1.0.0",
  "title": "Button",
  "description": "Versatile button component with multiple variants, sizes, and states",
  "author": {
    "name": "Bloktastic",
    "github": "bloktastic"
  },
  "compatibility": {
    "storyblok": ">=2.0.0",
    "frameworks": ["vue", "nuxt", "react", "nextjs", "astro", "svelte", "agnostic"]
  },
  "tags": ["button", "cta", "action", "link", "interactive"],
  "category": "content",
  "files": {
    "schema": "schema.json",
    "prompt": "prompt.md",
    "readme": "README.md"
  },
  "dependencies": {
    "bloktastic": []
  },
  "metadata": {
    "created": "2026-01-28",
    "updated": "2026-01-28",
    "status": "stable"
  }
}
```

### `/registry/components/button/schema.json`
```json
{
  "$bloktastic": {
    "version": "1.0.0"
  },
  "name": "button",
  "display_name": "Button",
  "is_root": false,
  "is_nestable": true,
  "schema": {
    "label": {
      "type": "text",
      "pos": 0,
      "required": true,
      "display_name": "Label",
      "description": "Button text"
    },
    "link": {
      "type": "multilink",
      "pos": 1,
      "display_name": "Link",
      "description": "Button destination (internal page, external URL, or email)"
    },
    "variant": {
      "type": "option",
      "pos": 2,
      "display_name": "Variant",
      "default_value": "primary",
      "options": [
        { "name": "Primary", "value": "primary" },
        { "name": "Secondary", "value": "secondary" },
        { "name": "Ghost", "value": "ghost" },
        { "name": "Link", "value": "link" }
      ]
    },
    "size": {
      "type": "option",
      "pos": 3,
      "display_name": "Size",
      "default_value": "medium",
      "options": [
        { "name": "Small", "value": "small" },
        { "name": "Medium", "value": "medium" },
        { "name": "Large", "value": "large" }
      ]
    },
    "full_width": {
      "type": "boolean",
      "pos": 4,
      "display_name": "Full Width",
      "default_value": false
    },
    "icon": {
      "type": "text",
      "pos": 5,
      "display_name": "Icon",
      "description": "Icon name (e.g., 'arrow-right', 'download')"
    },
    "icon_position": {
      "type": "option",
      "pos": 6,
      "display_name": "Icon Position",
      "default_value": "right",
      "options": [
        { "name": "Left", "value": "left" },
        { "name": "Right", "value": "right" }
      ]
    },
    "disabled": {
      "type": "boolean",
      "pos": 7,
      "display_name": "Disabled",
      "default_value": false
    }
  },
  "preview_field": "label"
}
```

### `/registry/components/button/prompt.md`
```markdown
# Button Component

## Purpose
A versatile, accessible button component for calls-to-action, form submissions, and navigation. Supports multiple visual variants, sizes, and states to fit any design system.

## Storyblok Schema Fields
- `label` (text, required): Button text displayed to users
- `link` (multilink): Destination - internal page, external URL, email, or asset
- `variant` (option): Visual style - primary, secondary, ghost, link
- `size` (option): Button size - small, medium, large
- `full_width` (boolean): Whether button spans full container width
- `icon` (text): Optional icon name from your icon library
- `icon_position` (option): Icon placement - left or right of label
- `disabled` (boolean): Disabled state

## Visual Requirements
- **Primary**: Solid background with brand color, white text
- **Secondary**: Outlined style with brand color border
- **Ghost**: Transparent background, subtle hover state
- **Link**: Text-only, underline on hover

### Sizes
- Small: `padding: 0.5rem 1rem`, `font-size: 0.875rem`
- Medium: `padding: 0.75rem 1.5rem`, `font-size: 1rem`
- Large: `padding: 1rem 2rem`, `font-size: 1.125rem`

### States
- Default, Hover, Focus, Active, Disabled
- Focus ring for keyboard navigation (2px offset, brand color)

## Accessibility
- Use `<button>` for actions, `<a>` for navigation
- Include `aria-disabled` for disabled state (not just CSS)
- Visible focus indicator meeting WCAG 2.1
- Minimum touch target: 44x44px
- Color contrast ratio: 4.5:1 minimum

## Example Props Structure
```typescript
interface ButtonProps {
  label: string;
  link?: {
    linktype: 'story' | 'url' | 'email' | 'asset';
    url?: string;
    cached_url?: string;
    anchor?: string;
    target?: '_blank' | '_self';
  };
  variant?: 'primary' | 'secondary' | 'ghost' | 'link';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  icon?: string;
  iconPosition?: 'left' | 'right';
  disabled?: boolean;
}
```

## Styling Considerations
- Use CSS custom properties: `--button-bg`, `--button-text`, `--button-border`
- Transition: `all 0.2s ease`
- Border-radius: Use design system token or `0.375rem` default
- Font-weight: 500 or 600

## Common Variations
- Icon-only button (with `aria-label`)
- Loading state with spinner
- Button group (multiple buttons inline)

## Edge Cases
- Very long labels: `text-overflow: ellipsis` or allow wrapping
- Missing link: Render as `<button>` not `<a>`
- Icon without label: Ensure `aria-label` is set
- Disabled with link: Prevent navigation
```

### `/registry/components/button/README.md`
```markdown
# @bloktastic/button

A versatile, accessible button component with multiple variants, sizes, and states.

## Installation

```bash
bloktastic add @bloktastic/button
```

## Schema Fields

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| label | text | Yes | - | Button text |
| link | multilink | No | - | Button destination |
| variant | option | No | primary | Visual style |
| size | option | No | medium | Button size |
| full_width | boolean | No | false | Full width mode |
| icon | text | No | - | Icon name |
| icon_position | option | No | right | Icon placement |
| disabled | boolean | No | false | Disabled state |

## Variants

- **Primary**: Main CTA, solid background
- **Secondary**: Alternative action, outlined
- **Ghost**: Subtle, transparent background
- **Link**: Text-only, appears as hyperlink

## Usage Examples

### Primary CTA
```
Label: "Get Started"
Variant: primary
Size: large
Link: /signup
```

### Secondary Action
```
Label: "Learn More"
Variant: secondary
Icon: arrow-right
```

### Icon Button
```
Label: "Download PDF"
Variant: ghost
Icon: download
Icon Position: left
```

## Author

Created by [Bloktastic](https://github.com/bloktastic)
```

---

## Component 2: @bloktastic/image

### `/registry/components/image/bloktastic.json`
```json
{
  "$schema": "https://bloktastic.dev/schema/bloktastic.schema.json",
  "name": "@bloktastic/image",
  "type": "component",
  "version": "1.0.0",
  "title": "Image",
  "description": "Responsive image component with lazy loading, aspect ratios, and optional caption",
  "author": {
    "name": "Bloktastic",
    "github": "bloktastic"
  },
  "compatibility": {
    "storyblok": ">=2.0.0",
    "frameworks": ["vue", "nuxt", "react", "nextjs", "astro", "svelte", "agnostic"]
  },
  "tags": ["image", "media", "picture", "responsive", "lazy-loading"],
  "category": "media",
  "files": {
    "schema": "schema.json",
    "prompt": "prompt.md",
    "readme": "README.md"
  },
  "dependencies": {
    "bloktastic": []
  },
  "metadata": {
    "created": "2026-01-28",
    "updated": "2026-01-28",
    "status": "stable"
  }
}
```

### `/registry/components/image/schema.json`
```json
{
  "$bloktastic": {
    "version": "1.0.0"
  },
  "name": "image",
  "display_name": "Image",
  "is_root": false,
  "is_nestable": true,
  "schema": {
    "image": {
      "type": "asset",
      "pos": 0,
      "required": true,
      "filetypes": ["images"],
      "display_name": "Image",
      "description": "Select an image from the asset library"
    },
    "alt": {
      "type": "text",
      "pos": 1,
      "display_name": "Alt Text",
      "description": "Describe the image for accessibility (leave empty for decorative images)"
    },
    "caption": {
      "type": "text",
      "pos": 2,
      "display_name": "Caption",
      "description": "Optional caption displayed below the image"
    },
    "aspect_ratio": {
      "type": "option",
      "pos": 3,
      "display_name": "Aspect Ratio",
      "default_value": "auto",
      "options": [
        { "name": "Auto (Original)", "value": "auto" },
        { "name": "1:1 (Square)", "value": "1/1" },
        { "name": "4:3", "value": "4/3" },
        { "name": "16:9", "value": "16/9" },
        { "name": "21:9 (Cinematic)", "value": "21/9" }
      ]
    },
    "object_fit": {
      "type": "option",
      "pos": 4,
      "display_name": "Object Fit",
      "default_value": "cover",
      "options": [
        { "name": "Cover", "value": "cover" },
        { "name": "Contain", "value": "contain" },
        { "name": "Fill", "value": "fill" }
      ]
    },
    "lazy_load": {
      "type": "boolean",
      "pos": 5,
      "display_name": "Lazy Load",
      "default_value": true
    },
    "rounded": {
      "type": "option",
      "pos": 6,
      "display_name": "Border Radius",
      "default_value": "none",
      "options": [
        { "name": "None", "value": "none" },
        { "name": "Small", "value": "small" },
        { "name": "Medium", "value": "medium" },
        { "name": "Large", "value": "large" },
        { "name": "Full (Circle)", "value": "full" }
      ]
    }
  },
  "preview_field": "image"
}
```

### `/registry/components/image/prompt.md`
```markdown
# Image Component

## Purpose
A responsive, accessible image component that leverages Storyblok's Image Service for automatic optimization. Supports aspect ratios, lazy loading, and optional captions.

## Storyblok Schema Fields
- `image` (asset, required): Image from Storyblok asset library
- `alt` (text): Alternative text for screen readers
- `caption` (text): Optional caption below image
- `aspect_ratio` (option): auto, 1/1, 4/3, 16/9, 21/9
- `object_fit` (option): cover, contain, fill
- `lazy_load` (boolean): Enable native lazy loading
- `rounded` (option): Border radius - none, small, medium, large, full

## Visual Requirements
- Use `<figure>` and `<figcaption>` for semantic markup
- Responsive: `max-width: 100%`, `height: auto`
- Aspect ratio: Use CSS `aspect-ratio` property
- Lazy loading: Native `loading="lazy"` attribute
- Caption: Smaller font, muted color, centered or left-aligned

## Storyblok Image Service
Use Storyblok's Image Service for optimization:
```
image.filename/m/800x600/filters:quality(80)
```
- `/m/WIDTHxHEIGHT` - Resize
- `/filters:quality(N)` - Compression
- `/filters:format(webp)` - Format conversion

## Accessibility
- Always provide meaningful `alt` text (except decorative images)
- For decorative images: `alt=""` and `role="presentation"`
- Caption should be associated via `<figcaption>`
- Ensure sufficient color contrast for captions

## Example Props Structure
```typescript
interface ImageProps {
  image: {
    filename: string;
    alt?: string;
    title?: string;
    focus?: string;
  };
  alt?: string; // Override image.alt
  caption?: string;
  aspectRatio?: 'auto' | '1/1' | '4/3' | '16/9' | '21/9';
  objectFit?: 'cover' | 'contain' | 'fill';
  lazyLoad?: boolean;
  rounded?: 'none' | 'small' | 'medium' | 'large' | 'full';
}
```

## Styling Considerations
- Border radius tokens: small (4px), medium (8px), large (16px), full (50%)
- Caption: `font-size: 0.875rem`, `color: var(--text-muted)`
- Consider skeleton/blur placeholder while loading

## Edge Cases
- Missing image: Show placeholder or hide component
- Very long captions: Limit lines or allow full display
- Full rounded on non-square: May look odd, use with 1:1 ratio
- No alt text: Log warning, use empty alt for decorative
```

### `/registry/components/image/README.md`
```markdown
# @bloktastic/image

Responsive image component with Storyblok Image Service optimization, lazy loading, and captions.

## Installation

```bash
bloktastic add @bloktastic/image
```

## Schema Fields

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| image | asset | Yes | - | Image from asset library |
| alt | text | No | - | Alternative text |
| caption | text | No | - | Caption below image |
| aspect_ratio | option | No | auto | Aspect ratio constraint |
| object_fit | option | No | cover | How image fills container |
| lazy_load | boolean | No | true | Enable lazy loading |
| rounded | option | No | none | Border radius |

## Storyblok Image Service

This component should use Storyblok's built-in Image Service for optimization:

```javascript
// Example: Resize to 800px width, 80% quality
const optimizedUrl = `${image.filename}/m/800x0/filters:quality(80)`;
```

## Author

Created by [Bloktastic](https://github.com/bloktastic)
```

---

## Component 3: @bloktastic/hero

### `/registry/components/hero/bloktastic.json`
```json
{
  "$schema": "https://bloktastic.dev/schema/bloktastic.schema.json",
  "name": "@bloktastic/hero",
  "type": "component",
  "version": "1.0.0",
  "title": "Hero Section",
  "description": "Full-width hero section with headline, subline, CTA buttons, and background image",
  "author": {
    "name": "Bloktastic",
    "github": "bloktastic"
  },
  "compatibility": {
    "storyblok": ">=2.0.0",
    "frameworks": ["vue", "nuxt", "react", "nextjs", "astro", "svelte", "agnostic"]
  },
  "tags": ["hero", "header", "landing", "marketing", "banner"],
  "category": "sections",
  "files": {
    "schema": "schema.json",
    "prompt": "prompt.md",
    "readme": "README.md"
  },
  "dependencies": {
    "bloktastic": ["@bloktastic/button", "@bloktastic/image"]
  },
  "metadata": {
    "created": "2026-01-28",
    "updated": "2026-01-28",
    "status": "stable"
  }
}
```

### `/registry/components/hero/schema.json`
```json
{
  "$bloktastic": {
    "version": "1.0.0"
  },
  "name": "hero",
  "display_name": "Hero Section",
  "is_root": false,
  "is_nestable": true,
  "schema": {
    "headline": {
      "type": "text",
      "pos": 0,
      "required": true,
      "display_name": "Headline",
      "description": "Main heading (typically H1)"
    },
    "subline": {
      "type": "textarea",
      "pos": 1,
      "display_name": "Subline",
      "description": "Supporting text below the headline"
    },
    "background_image": {
      "type": "asset",
      "pos": 2,
      "filetypes": ["images"],
      "display_name": "Background Image",
      "description": "Full-width background (recommended: 1920x1080 or larger)"
    },
    "overlay_opacity": {
      "type": "option",
      "pos": 3,
      "display_name": "Overlay Opacity",
      "default_value": "50",
      "description": "Dark overlay for text readability",
      "options": [
        { "name": "None", "value": "0" },
        { "name": "Light (25%)", "value": "25" },
        { "name": "Medium (50%)", "value": "50" },
        { "name": "Heavy (75%)", "value": "75" }
      ]
    },
    "cta_buttons": {
      "type": "bloks",
      "pos": 4,
      "display_name": "CTA Buttons",
      "restrict_components": true,
      "component_whitelist": ["button"],
      "maximum": 2
    },
    "alignment": {
      "type": "option",
      "pos": 5,
      "display_name": "Text Alignment",
      "default_value": "center",
      "options": [
        { "name": "Left", "value": "left" },
        { "name": "Center", "value": "center" },
        { "name": "Right", "value": "right" }
      ]
    },
    "height": {
      "type": "option",
      "pos": 6,
      "display_name": "Height",
      "default_value": "large",
      "options": [
        { "name": "Small (50vh)", "value": "small" },
        { "name": "Medium (70vh)", "value": "medium" },
        { "name": "Large (90vh)", "value": "large" },
        { "name": "Full Screen", "value": "full" }
      ]
    },
    "text_color": {
      "type": "option",
      "pos": 7,
      "display_name": "Text Color",
      "default_value": "light",
      "options": [
        { "name": "Light (White)", "value": "light" },
        { "name": "Dark (Black)", "value": "dark" }
      ]
    }
  },
  "preview_field": "headline"
}
```

### `/registry/components/hero/prompt.md`
```markdown
# Hero Section Component

## Purpose
A full-width hero section typically used at the top of landing pages. Displays a prominent headline, optional subline, background image with overlay, and up to two CTA buttons.

## Storyblok Schema Fields
- `headline` (text, required): Main heading, typically rendered as H1
- `subline` (textarea): Supporting paragraph text
- `background_image` (asset): Full-width background image
- `overlay_opacity` (option): Dark overlay intensity (0, 25, 50, 75%)
- `cta_buttons` (bloks): Array of button components (max 2)
- `alignment` (option): Text alignment - left, center, right
- `height` (option): Section height - small (50vh), medium (70vh), large (90vh), full (100vh)
- `text_color` (option): Light (white) or dark (black) text

## Visual Requirements
- Full viewport width with contained content
- Background image with `object-fit: cover`
- Dark gradient overlay for text readability
- Content vertically and horizontally centered (default)
- Responsive: Stack content vertically on mobile
- Minimum padding: 2rem on mobile, 4rem on desktop

### Height Values
- Small: `min-height: 50vh`
- Medium: `min-height: 70vh`
- Large: `min-height: 90vh`
- Full: `min-height: 100vh`

## Accessibility
- Headline should be `<h1>` if first hero on page
- Background image: `role="presentation"` or meaningful `alt` if contextual
- Buttons need sufficient color contrast against overlay
- Consider `prefers-reduced-motion` for any animations
- Ensure text is readable at all overlay levels

## Example Props Structure
```typescript
interface HeroProps {
  headline: string;
  subline?: string;
  backgroundImage?: {
    filename: string;
    alt?: string;
    focus?: string;
  };
  overlayOpacity?: '0' | '25' | '50' | '75';
  ctaButtons?: ButtonProps[];
  alignment?: 'left' | 'center' | 'right';
  height?: 'small' | 'medium' | 'large' | 'full';
  textColor?: 'light' | 'dark';
}
```

## Styling Considerations
- Use CSS Grid or Flexbox for centering
- Overlay: `background: rgba(0, 0, 0, ${opacity})`
- Text shadow for additional readability: `text-shadow: 0 2px 4px rgba(0,0,0,0.3)`
- Button container: `display: flex; gap: 1rem;`
- Max content width: 800px for readability

## Common Variations
- Video background instead of image
- Animated text entrance
- Split hero (image on one side, text on other)
- With logo/badge above headline

## Edge Cases
- No background image: Use solid brand color
- Very long headlines: Consider `font-size: clamp(2rem, 5vw, 4rem)`
- Single CTA: Center it regardless of alignment setting
- No CTAs: Increase bottom padding for visual balance
- Mobile: Reduce headline size, stack buttons vertically
```

### `/registry/components/hero/README.md`
```markdown
# @bloktastic/hero

Full-width hero section with headline, subline, background image, and CTA buttons.

## Installation

```bash
bloktastic add @bloktastic/hero
```

This will also install dependencies: `@bloktastic/button`, `@bloktastic/image`

## Schema Fields

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| headline | text | Yes | - | Main heading (H1) |
| subline | textarea | No | - | Supporting text |
| background_image | asset | No | - | Background image |
| overlay_opacity | option | No | 50 | Dark overlay % |
| cta_buttons | bloks | No | - | Up to 2 buttons |
| alignment | option | No | center | Text alignment |
| height | option | No | large | Section height |
| text_color | option | No | light | Text color |

## Dependencies

- `@bloktastic/button` - Used for CTA buttons

## Author

Created by [Bloktastic](https://github.com/bloktastic)
```

---

## Component 4: @bloktastic/teaser

*(Create similar structure with teaser-specific fields: image, title, text, link, etc.)*

### `/registry/components/teaser/bloktastic.json`
```json
{
  "$schema": "https://bloktastic.dev/schema/bloktastic.schema.json",
  "name": "@bloktastic/teaser",
  "type": "component",
  "version": "1.0.0",
  "title": "Teaser Card",
  "description": "Card-style teaser with image, title, text, and link for content previews",
  "author": {
    "name": "Bloktastic",
    "github": "bloktastic"
  },
  "compatibility": {
    "storyblok": ">=2.0.0",
    "frameworks": ["vue", "nuxt", "react", "nextjs", "astro", "svelte", "agnostic"]
  },
  "tags": ["teaser", "card", "preview", "article", "grid"],
  "category": "content",
  "files": {
    "schema": "schema.json",
    "prompt": "prompt.md",
    "readme": "README.md"
  },
  "dependencies": {
    "bloktastic": ["@bloktastic/image"]
  },
  "metadata": {
    "created": "2026-01-28",
    "updated": "2026-01-28",
    "status": "stable"
  }
}
```

*(schema.json, prompt.md, README.md follow same pattern)*

---

## Component 5: @bloktastic/accordion

*(Create with accordion-item as nested blok)*

### `/registry/components/accordion/bloktastic.json`
```json
{
  "$schema": "https://bloktastic.dev/schema/bloktastic.schema.json",
  "name": "@bloktastic/accordion",
  "type": "component",
  "version": "1.0.0",
  "title": "Accordion",
  "description": "Expandable accordion with multiple collapsible items for FAQs and content organization",
  "author": {
    "name": "Bloktastic",
    "github": "bloktastic"
  },
  "compatibility": {
    "storyblok": ">=2.0.0",
    "frameworks": ["vue", "nuxt", "react", "nextjs", "astro", "svelte", "agnostic"]
  },
  "tags": ["accordion", "faq", "collapse", "expandable", "toggle"],
  "category": "content",
  "files": {
    "schema": "schema.json",
    "prompt": "prompt.md",
    "readme": "README.md"
  },
  "dependencies": {
    "bloktastic": []
  },
  "metadata": {
    "created": "2026-01-28",
    "updated": "2026-01-28",
    "status": "stable"
  }
}
```

*(Full implementation for accordion with nested accordion-item schema)*

---

## Acceptance Criteria

- [ ] Alle 5 Components haben vollständige Dateien (bloktastic.json, schema.json, prompt.md, README.md)
- [ ] Alle Components passieren `bloktastic validate`
- [ ] Schemas sind valides Storyblok Format
- [ ] Prompts enthalten alle Required Sections
- [ ] Dependencies sind korrekt deklariert
- [ ] READMEs enthalten Installation und Field-Dokumentation

## Test Commands

```bash
# Alle Components validieren
for dir in registry/components/*/; do
  bloktastic validate "$dir"
done
```

## Nächster Task
→ Task 9: GitHub Actions (Validation, Registry Build)
