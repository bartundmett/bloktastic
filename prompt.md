# Accordion Component

## Purpose

An expandable/collapsible accordion component commonly used for:
- FAQ sections
- Feature lists with details
- Terms & conditions
- Product specifications
- Any content that benefits from progressive disclosure

## Storyblok Schema Fields

### Accordion (Container)
- `items` (bloks, required): Array of accordion_item components
- `allow_multiple_open` (boolean, default: false): Whether multiple items can be expanded at once
- `first_open` (boolean, default: false): Whether first item should be open on load
- `style` (option): Visual variant - "default", "bordered", "separated"

### Accordion Item (Nested)
- `title` (text, required): The clickable header text
- `content` (richtext, required): Expandable content area
- `icon` (asset, optional): Custom icon for the header

## Visual Requirements

### Layout
- Full width within container
- Items stack vertically with no gap (default) or gap (separated style)
- Header: horizontal flex with title left, chevron/icon right
- Content: hidden by default, smooth height transition on expand

### Spacing
- Header padding: 16px horizontal, 12-16px vertical
- Content padding: 16px horizontal, 16px bottom (no top to connect with header)
- Between items: 0px (default/bordered), 8-16px (separated)

### Transitions
- Height: 200-300ms ease-out
- Chevron rotation: 180deg when open
- Consider `prefers-reduced-motion`

### Style Variants
1. **Default**: Simple divider lines between items
2. **Bordered**: Each item has full border, slight border-radius
3. **Separated**: Items have background, gap between, rounded corners

## Accessibility

### Required
- Use `<details>` and `<summary>` OR custom ARIA implementation
- If custom: `role="button"`, `aria-expanded`, `aria-controls`
- Content region: `role="region"`, `aria-labelledby`
- Keyboard: Enter/Space to toggle, focus visible

### ARIA Pattern (if not using details/summary)
```html
<div class="accordion">
  <h3>
    <button 
      aria-expanded="false" 
      aria-controls="panel-1"
      id="header-1"
    >
      Title
      <span aria-hidden="true">▼</span>
    </button>
  </h3>
  <div 
    id="panel-1" 
    role="region" 
    aria-labelledby="header-1"
    hidden
  >
    Content here
  </div>
</div>
```

### Keyboard Navigation
- Tab: Move between accordion headers
- Enter/Space: Toggle current item
- Optional: Arrow keys to move between headers (widget pattern)

## Example Props Structure

```typescript
interface AccordionItem {
  _uid: string;
  title: string;
  content: RichTextContent;
  icon?: Asset;
}

interface AccordionProps {
  items: AccordionItem[];
  allowMultipleOpen?: boolean;
  firstOpen?: boolean;
  style?: 'default' | 'bordered' | 'separated';
}
```

## State Management

```typescript
// Single open mode
const [openIndex, setOpenIndex] = useState<number | null>(
  props.firstOpen ? 0 : null
);

// Multiple open mode  
const [openIndices, setOpenIndices] = useState<Set<number>>(
  new Set(props.firstOpen ? [0] : [])
);

const toggle = (index: number) => {
  if (props.allowMultipleOpen) {
    setOpenIndices(prev => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  } else {
    setOpenIndex(prev => prev === index ? null : index);
  }
};
```

## Styling Considerations

### CSS Custom Properties
```css
.accordion {
  --accordion-header-padding: 1rem;
  --accordion-content-padding: 1rem;
  --accordion-border-color: var(--border-color, #e5e7eb);
  --accordion-border-radius: 0.5rem;
  --accordion-transition-duration: 250ms;
  --accordion-chevron-size: 1.25rem;
  --accordion-gap: 0.5rem; /* for separated style */
}
```

### Height Animation Technique
```css
/* Use grid for smooth height animation */
.accordion-content {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows var(--accordion-transition-duration) ease-out;
}

.accordion-content[data-open="true"] {
  grid-template-rows: 1fr;
}

.accordion-content-inner {
  overflow: hidden;
}
```

## Common Variations

1. **With Icons**: Custom icon per item (checkmark, number, category icon)
2. **Nested Accordions**: Accordion items containing child accordions
3. **With Search**: Filter/search through accordion items
4. **Lazy Load Content**: Load content only when first opened
5. **Linked Items**: Deep-link to specific open item via URL hash

## Edge Cases

### Empty State
- If no items: Don't render anything or show placeholder

### Very Long Titles
- Allow wrapping, don't truncate
- Chevron should align to top of header if multi-line

### Very Long Content
- Consider max-height with scroll for extremely long content
- Or: No max-height, let it expand fully

### Rich Text Content
- Ensure all richtext elements styled properly
- Links should be keyboard accessible
- Images should be responsive

### Single Item
- Still render as accordion (consistency)
- Consider: Should single item be open by default?

### First Open + Multiple Open
- If both true: Only first item open initially
- User can then open additional items

## SEO Considerations

- Content inside closed accordions IS crawled by search engines
- Use semantic headings for titles (h2, h3, etc. based on context)
- Don't rely on accordion for critical SEO content
- Consider: FAQ Schema markup for FAQ-type accordions

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [{
    "@type": "Question",
    "name": "Accordion item title",
    "acceptedAnswer": {
      "@type": "Answer",
      "text": "Content here"
    }
  }]
}
```
