# Bloktastic

Community registry for Storyblok components, plugins, and presets, plus a CLI and docs website.

- Website: [bloktastic.com](https://bloktastic.com)
- Docs: [bloktastic.com/docs](https://bloktastic.com/docs)

## Monorepo Packages

- `packages/cli` - Terminal CLI for searching, validating, and installing registry packages.
- `packages/website` - Astro website for docs and package browsing.

Package-specific docs:

- `/Users/ben/code/bloktastic/packages/cli/README.md`
- `/Users/ben/code/bloktastic/packages/website/README.md`

## Repository Layout

```text
bloktastic/
├── packages/
│   ├── cli/
│   └── website/
├── registry/
│   ├── components/
│   ├── plugins/
│   ├── presets/
│   └── registry.json
├── schema/
└── scripts/
    └── build-registry.mjs
```

## Quick Start

```bash
pnpm install
pnpm check
pnpm build
```

Run website dev server:

```bash
pnpm dev
```

Run CLI in watch mode:

```bash
pnpm dev:cli
```

## CLI Usage (Workspace)

```bash
pnpm build:cli
pnpm bloktastic --help
pnpm bloktastic list --type component
pnpm bloktastic search hero
pnpm bloktastic init
pnpm bloktastic add @bloktastic/hero --prompt-only
```

If you want to push schemas to Storyblok:

```bash
export STORYBLOK_OAUTH_TOKEN="your-token"
```

## Registry Index

Rebuild the generated registry index after manifest updates:

```bash
pnpm registry:build
```

## CI Workflows

- `validate.yml` - type checks, tests, builds, and registry integrity checks.
- `build-registry.yml` - rebuilds and commits `registry/registry.json` on `main`.
- `security.yml` - dependency review and CodeQL analysis.
- `release.yml` - automates CLI release PRs, tags, GitHub releases, and npm publish.

## License

MIT
