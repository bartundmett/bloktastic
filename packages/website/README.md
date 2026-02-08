# Bloktastic Website

Astro site for the Bloktastic landing page, docs, and package browser.

## Stack

- Astro
- Tailwind CSS
- Generated registry data from `registry/registry.json`

## Development

From repo root:

```bash
pnpm --filter website dev
```

The app runs at:

```text
http://localhost:4321
```

## Build

```bash
pnpm --filter website build
```

Build output:

```text
packages/website/dist
```

## Preview Production Build

```bash
pnpm --filter website preview
```

## Type and Astro Checks

```bash
pnpm --filter website check
```

## Notes

- `predev` and `prebuild` run `scripts/build-registry.mjs`.
- Updating registry manifests should be followed by `pnpm registry:build` at repo root.
