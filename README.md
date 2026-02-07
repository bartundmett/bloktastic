<div align="center">
  <h1>Bloktastic</h1>
  <p><strong>Community Registry for Storyblok Bloks and Plugins</strong></p>
  <p>
    <a href="https://bloktastic.dev">Website</a> ·
    <a href="https://bloktastic.dev/docs">Docs</a> ·
    <a href="https://bloktastic.dev/components">Components</a>
  </p>
</div>

## What is Bloktastic?

Bloktastic is an open registry for Storyblok packages:

- **Bloks** (component schemas)
- **Plugins** (curated external tooling)
- **Presets** (bundles of multiple components)

Each component includes both a Storyblok schema and a structured AI prompt so teams can generate frontend code for their exact stack.

## Project Structure

```text
bloktastic/
├── packages/
│   ├── cli/                  # Bloktastic terminal CLI
│   └── website/              # Astro landing + docs + package browser
├── registry/
│   ├── components/           # Sample bloks
│   ├── plugins/              # Sample plugin listings
│   ├── presets/              # Sample package bundles
│   └── registry.json         # Generated index
├── schema/                   # JSON schemas for manifests/registry/config
└── scripts/
    └── build-registry.mjs    # Rebuilds registry/registry.json
```

## Local Development

```bash
pnpm install
pnpm build:cli
pnpm --filter website dev
```

Website runs at `http://localhost:4321`.

## Use the CLI Locally

Run the workspace CLI via root script:

```bash
pnpm bloktastic --help
pnpm bloktastic list --type component
pnpm bloktastic search hero
pnpm bloktastic init
pnpm bloktastic add @bloktastic/hero --prompt-only
```

For full Storyblok schema push, set:

```bash
export STORYBLOK_OAUTH_TOKEN=\"your-token\"
```

## Rebuild Registry Index

```bash
pnpm registry:build
```

This scans package manifests in `registry/components`, `registry/plugins`, and `registry/presets`.

## Included Sample Packages

### Components
- `@bloktastic/hero`
- `@bloktastic/button`
- `@bloktastic/image`
- `@bloktastic/teaser`
- `@bloktastic/accordion`
- `@bloktastic/accordion-item`
- `@bloktastic/announcement-bar`
- `@bloktastic/navbar`
- `@bloktastic/logo-cloud`
- `@bloktastic/feature-grid`
- `@bloktastic/feature-item`
- `@bloktastic/stats-section`
- `@bloktastic/stat-item`
- `@bloktastic/testimonial-grid`
- `@bloktastic/testimonial-item`
- `@bloktastic/pricing-section`
- `@bloktastic/pricing-tier`
- `@bloktastic/faq-section`
- `@bloktastic/cta-banner`
- `@bloktastic/newsletter-section`
- `@bloktastic/contact-section`
- `@bloktastic/team-grid`
- `@bloktastic/team-member`
- `@bloktastic/blog-grid`
- `@bloktastic/footer`

### Plugins
- `@bloktastic/advanced-color-picker`
- `@bloktastic/seo-auditor`
- `@bloktastic/cookie-consent-manager`
- `@bloktastic/analytics-pixel-manager`
- `@bloktastic/icon-picker-pro`

### Presets
- `@bloktastic/blog-starter`
- `@bloktastic/marketing-landing-starter`
- `@bloktastic/saas-growth-starter`

## License

MIT
