# Contributing to Bloktastic

Thanks for contributing. Contributions are welcome for components, plugin listings, docs, and tooling.

## Development Setup

```bash
git clone https://github.com/bloktastic/bloktastic.git
cd bloktastic
pnpm install
pnpm --filter website dev
```

## Package Types

- `component`: Storyblok schema + prompt + README
- `plugin`: curated external plugin entry + README
- `preset`: bundle of existing packages + README

## Package Layout

```text
registry/components/my-component/
├── bloktastic.json
├── schema.json
├── prompt.md
└── README.md
```

```text
registry/plugins/my-plugin/
├── bloktastic.json
└── README.md
```

```text
registry/presets/my-preset/
├── bloktastic.json
└── README.md
```

## Validation Checklist

1. Manifest has valid name/version/type metadata.
2. Component schemas use clear field names and descriptions.
3. Prompt includes purpose, fields, visuals, accessibility, edge cases.
4. README includes install and usage guidance.
5. `pnpm registry:build` runs successfully.

## Pull Requests

1. Create a branch.
2. Add or update package files.
3. Rebuild registry index.
4. Submit PR with concise summary and screenshots when UI changes are included.
