# @bloktastic/bulk-publish

Tool plugin for publishing or unpublishing multiple stories at once with filters, dry-run preview, and batch progress tracking.

## What It Does

Bulk Publish adds a sidebar tool to Storyblok that streamlines mass content operations:

- **Folder-scoped publishing** — select a folder and publish all stories within it
- **Filter by status** — target only drafts, changed stories, or scheduled content
- **Dry-run mode** — preview which stories will be affected before committing
- **Batch progress** — real-time progress bar with success/failure counts
- **Unpublish support** — revert published stories back to draft state in bulk

## Use Cases

- Launch day: publish an entire campaign folder of landing pages at once
- Seasonal updates: unpublish holiday content after a promotion ends
- Content migration: publish imported stories that arrived as drafts
- QA workflows: publish staging content after review approval

## Setup

1. Install the Bulk Publish tool plugin in your Storyblok space.
2. It appears in the sidebar under **Tools** in the Storyblok editor.
3. Select the target folder, apply filters, and preview the batch before executing.

## Permissions

Bulk Publish respects Storyblok's role-based permissions. Only users with publish rights on the target stories can execute the operation. Editors without publish access will see a read-only preview.

## Links

- [Storyblok Marketplace](https://www.storyblok.com/marketplace)
- [Tool Plugin Docs](https://www.storyblok.com/docs/plugins/tool-plugins)
