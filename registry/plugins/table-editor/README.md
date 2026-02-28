# @bloktastic/table-editor

Field plugin that provides a spreadsheet-style table editor for structured tabular data like pricing comparisons, spec sheets, and schedules.

## What It Does

Table Editor gives content editors a familiar grid interface inside Storyblok:

- **Add/remove rows and columns** with click or keyboard shortcuts
- **Header row toggle** for semantic `<thead>` rendering
- **Cell alignment** (left, center, right) per column
- **Drag-to-reorder** rows and columns
- **Copy/paste** from spreadsheets and other sources

## Use Cases

- Feature comparison tables on pricing pages
- Technical specification sheets for product pages
- Event schedules and timetables
- Data-heavy content like nutritional info or sizing charts

## Setup

1. Install the table editor plugin in your Storyblok space.
2. Add a field of type `plugin` referencing the table editor to your component schema.
3. The field stores data as a JSON object with `thead` and `tbody` arrays.

## Rendering

The stored JSON structure looks like:

```json
{
  "thead": [{ "value": "Feature" }, { "value": "Basic" }, { "value": "Pro" }],
  "tbody": [
    [{ "value": "Storage" }, { "value": "5 GB" }, { "value": "100 GB" }],
    [{ "value": "Support" }, { "value": "Email" }, { "value": "Priority" }]
  ]
}
```

Map `thead` to `<th>` elements and `tbody` rows to `<tr>/<td>` in your frontend component.

## Links

- [Storyblok Marketplace](https://www.storyblok.com/marketplace)
- [Field Plugin Docs](https://www.storyblok.com/docs/plugins/field-plugins)
