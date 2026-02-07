# Announcement Bar

## Purpose
Slim top banner for product announcements, campaign messages, and urgent notices.

## Storyblok Schema Fields
- `enabled` (boolean): Show or hide the announcement bar
- `message` (text, required): Primary announcement copy
- `link` (multilink): Optional announcement link destination
- `cta_label` (text): Optional short link label
- `dismissible` (boolean): Allow user to dismiss this bar
- `theme` (option): Visual style

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
interface AnnouncementBarProps {
  // Map Storyblok fields to your frontend props here
}
```

## Edge Cases
- Missing optional media or links.
- Extremely long text content.
- Empty collections in nested blok fields.
