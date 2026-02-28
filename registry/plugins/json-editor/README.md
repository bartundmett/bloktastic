# @bloktastic/json-editor

Field plugin with a syntax-highlighted JSON editor, schema validation, and collapsible tree view for structured data fields.

## What It Does

JSON Editor provides a developer-friendly editing experience for structured JSON data inside Storyblok:

- **Syntax highlighting** with bracket matching and auto-indent
- **Collapsible tree view** for navigating deeply nested structures
- **Schema validation** with inline error markers when JSON is malformed
- **Format/minify toggle** for quick cleanup
- **Raw and visual modes** — switch between code editor and tree view

## Use Cases

- Configuration objects for third-party widget embeds
- Structured metadata that doesn't map to standard Storyblok field types
- API response mocks or sample data stored alongside content
- Feature flag definitions or A/B test variant config

## Setup

1. Install the JSON editor plugin in your Storyblok space.
2. Add a field of type `plugin` referencing the JSON editor to your component schema.
3. Optionally provide a JSON Schema in the plugin options to validate input against a known structure.

## Rendering

The field stores a JSON string. Parse it in your frontend component:

```typescript
const config = JSON.parse(blok.custom_config);
```

Always wrap parsing in a try/catch and provide a sensible fallback for invalid data.

## Links

- [Storyblok Marketplace](https://www.storyblok.com/marketplace)
- [Field Plugin Docs](https://www.storyblok.com/docs/plugins/field-plugins)
