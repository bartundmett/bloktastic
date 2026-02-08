# Bloktastic CLI

Command-line interface for working with the Bloktastic registry.

## What It Does

- Initializes local config for Storyblok integration.
- Lists and searches registry packages.
- Shows package metadata and docs links.
- Validates package manifests before publishing.
- Adds package assets/prompts into local projects.

## Development

From repo root:

```bash
pnpm --filter ./packages/cli dev
```

Build:

```bash
pnpm --filter ./packages/cli build
```

Test:

```bash
pnpm --filter ./packages/cli test
```

Type-check:

```bash
pnpm --filter ./packages/cli check
```

## Run Locally

After building, run from repo root:

```bash
pnpm bloktastic --help
pnpm bloktastic search hero
pnpm bloktastic list --type component
```

Direct package entrypoint:

```bash
node packages/cli/dist/index.js --help
```

## Storyblok Access

Some CLI operations require Storyblok API access:

```bash
export STORYBLOK_OAUTH_TOKEN="your-token"
```
