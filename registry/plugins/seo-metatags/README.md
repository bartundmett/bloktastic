# @bloktastic/seo-metatags

Field plugin for managing SEO meta tags including title, description, Open Graph, and Twitter Card fields in one structured input.

## What It Does

SEO Meta Tags bundles all page-level SEO concerns into a single Storyblok field:

- **Title tag** with character count indicator
- **Meta description** with length guidance
- **Open Graph** fields (og:title, og:description, og:image)
- **Twitter Card** fields (twitter:title, twitter:description, twitter:image)
- **Robots directives** (index/noindex, follow/nofollow)
- **Canonical URL** override

## Use Cases

- Marketing landing pages that need precise OG previews
- Blog articles with per-post SEO customization
- Product pages requiring structured meta data
- Multi-language sites with locale-specific meta tags

## Setup

1. Install the field plugin in your Storyblok space via the marketplace or custom plugin upload.
2. Add a field of type `plugin` to your component schema, referencing the SEO meta tags plugin.
3. Editors can fill in SEO fields directly in the Visual Editor sidebar.

## Framework Integration

Render the meta tags in your `<head>` using your framework's head management:

- **Nuxt** — `useHead()` or `useSeoMeta()`
- **Next.js** — `metadata` export or `<Head>` component
- **Astro** — `<head>` in layout templates
- **SvelteKit** — `<svelte:head>`

## Links

- [Storyblok Marketplace](https://www.storyblok.com/marketplace)
- [Field Plugin Docs](https://www.storyblok.com/docs/plugins/field-plugins)
