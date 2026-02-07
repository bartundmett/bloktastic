# Team Member

## Purpose
Profile card for a team member with role, avatar, and optional social links.

## Storyblok Schema Fields
- `name` (text, required): Team member full name
- `role` (text, required): Job title or function
- `bio` (textarea): Short biography text
- `avatar` (asset): Profile image
- `linkedin` (multilink): LinkedIn profile URL
- `x_link` (multilink): X/Twitter profile URL

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
interface TeamMemberProps {
  // Map Storyblok fields to your frontend props here
}
```

## Edge Cases
- Missing optional media or links.
- Extremely long text content.
- Empty collections in nested blok fields.
