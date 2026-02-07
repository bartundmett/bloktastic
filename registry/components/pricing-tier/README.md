# @bloktastic/pricing-tier

Single pricing card tier with plan name, price, features, and CTA settings.

## Installation

```bash
bloktastic add @bloktastic/pricing-tier
```

## Fields

| Field | Type | Required | Description |
|---|---|---|---|
| plan_name | text | Yes | Tier name, e.g. Pro |
| price | text | Yes | Price text, e.g. $29 |
| billing_period | text | No | Period text, e.g. /month |
| feature_list | textarea | Yes | One feature per line |
| cta_label | text | Yes | Button label |
| cta_link | multilink | No | Button destination |
| highlighted | boolean | No | Visually emphasize this tier |

## Notes
- Category: `commerce`
- Tags: `pricing`, `tier`, `plan`, `saas`
