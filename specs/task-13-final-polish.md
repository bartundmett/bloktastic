# Task 13: Final Polish (README, CONTRIBUTING, Deployment)

## Ziel
Finalisiere das Projekt mit professioneller Dokumentation und Deployment-Setup.

## Voraussetzungen
- Task 12 abgeschlossen (Website Docs)

## Zu erstellende/aktualisierende Dateien

### 1. Repository README
### 2. CONTRIBUTING Guide
### 3. LICENSE
### 4. GitHub Templates
### 5. Deployment Konfiguration

---

## README.md

### `/README.md`

```markdown
<div align="center">
  <h1>Bloktastic</h1>
  <p><strong>Community Registry for Storyblok Components</strong></p>
  <p>
    <a href="https://bloktastic.dev">Website</a> •
    <a href="https://bloktastic.dev/docs">Documentation</a> •
    <a href="https://bloktastic.dev/components">Browse Components</a>
  </p>
  <p>
    <a href="https://www.npmjs.com/package/@bloktastic/cli"><img src="https://img.shields.io/npm/v/@bloktastic/cli" alt="npm version"></a>
    <a href="https://github.com/bloktastic/bloktastic/blob/main/LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="license"></a>
    <a href="https://github.com/bloktastic/bloktastic/actions"><img src="https://github.com/bloktastic/bloktastic/actions/workflows/validate.yml/badge.svg" alt="CI status"></a>
  </p>
</div>

---

## What is Bloktastic?

Bloktastic is an open-source registry of **Storyblok component schemas** and **AI-powered generation prompts**. Instead of rebuilding Hero sections, Accordions, and Teasers from scratch in every project, install pre-built schemas via CLI and use structured prompts to generate frontend code for your specific stack.

### The Prompt-First Approach

Unlike traditional component libraries, Bloktastic doesn't ship framework-specific code. Instead:

1. **Schema** → Pushed directly to your Storyblok space
2. **Prompt** → Structured instructions for AI code generation

This means you get code that matches your exact setup (Vue, React, Astro, etc.) and coding style.

## Quick Start

```bash
# Install CLI
npm install -g @bloktastic/cli

# Initialize in your project
bloktastic init

# Add a component
bloktastic add @bloktastic/hero
```

The CLI will:
- Push the component schema to your Storyblok space
- Copy the AI prompt to your clipboard
- Paste into Claude/ChatGPT/Cursor to generate code for your stack

## Documentation

- [Getting Started](https://bloktastic.dev/docs/getting-started)
- [CLI Reference](https://bloktastic.dev/docs/cli)
- [Contributing Guide](https://bloktastic.dev/docs/contributing)

## Available Components

| Component | Description |
|-----------|-------------|
| `@bloktastic/hero` | Full-width hero with headline, CTA, background |
| `@bloktastic/button` | Versatile button with variants and sizes |
| `@bloktastic/image` | Responsive image with lazy loading |
| `@bloktastic/teaser` | Card-style teaser with image and text |
| `@bloktastic/accordion` | Expandable accordion sections |

[Browse all components →](https://bloktastic.dev/components)

## Contributing

We welcome contributions! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

```bash
# Create a new component
bloktastic create component my-component

# Validate before submitting
bloktastic validate registry/components/my-component
```

## Project Structure

```
bloktastic/
├── packages/
│   ├── cli/          # @bloktastic/cli npm package
│   └── website/      # bloktastic.dev (Astro)
├── registry/         # Component packages
│   ├── components/
│   ├── plugins/
│   └── presets/
├── schema/           # JSON Schemas for validation
└── scripts/          # Build scripts
```

## License

MIT © [Benedikt Müller](https://github.com/bmueller)

---

<p align="center">
  <sub>Community project, not affiliated with Storyblok GmbH.</sub>
</p>
```

---

## CONTRIBUTING.md

### `/CONTRIBUTING.md`

```markdown
# Contributing to Bloktastic

Thank you for your interest in contributing! This document provides guidelines and instructions.

## Ways to Contribute

- **Add Components** – Share your Storyblok component schemas
- **Add Plugins** – Curate external Storyblok plugins
- **Improve Docs** – Fix typos, clarify instructions
- **Fix Bugs** – Help improve the CLI or website
- **Feature Ideas** – Open a discussion for new features

## Development Setup

### Prerequisites

- Node.js 20+
- pnpm 8+
- A Storyblok account (for testing)

### Setup

```bash
# Clone the repo
git clone https://github.com/bloktastic/bloktastic.git
cd bloktastic

# Install dependencies
pnpm install

# Build CLI
pnpm --filter @bloktastic/cli build

# Start website dev server
pnpm --filter website dev
```

## Adding a Component

### 1. Create the scaffold

```bash
pnpm --filter @bloktastic/cli dev  # Start CLI in watch mode

# In another terminal:
node packages/cli/dist/index.js create component my-component
```

### 2. Edit the files

```
registry/components/my-component/
├── bloktastic.json   # Package manifest
├── schema.json       # Storyblok component schema
├── prompt.md         # AI generation prompt
└── README.md         # Usage documentation
```

### 3. Schema Guidelines

- Use descriptive `display_name` for every field
- Add helpful `description` for complex fields
- Set sensible defaults with `default_value`
- Keep field count reasonable (< 15 fields)
- Use `required: true` sparingly

### 4. Prompt Guidelines

Your `prompt.md` must include:

- **## Purpose** – What the component does
- **## Storyblok Schema Fields** – All fields documented
- **## Visual Requirements** – Layout, spacing, responsive
- **## Accessibility** – ARIA, keyboard, semantics
- **## Example Props Structure** – TypeScript interface
- **## Edge Cases** – Empty states, long content

### 5. Validate

```bash
node packages/cli/dist/index.js validate registry/components/my-component
```

### 6. Submit PR

- Fork the repository
- Create a feature branch
- Push your changes
- Open a Pull Request

## Code Style

- TypeScript for CLI
- Astro + Tailwind for website
- Prettier for formatting
- ESLint for linting

## Commit Messages

Use conventional commits:

```
feat: add accordion component
fix: correct button hover state
docs: improve CLI documentation
chore: update dependencies
```

## Questions?

- Open a [Discussion](https://github.com/bloktastic/bloktastic/discussions)
- Check existing [Issues](https://github.com/bloktastic/bloktastic/issues)

## Code of Conduct

Be kind, respectful, and constructive. We're all here to build something useful together.
```

---

## GitHub Issue Templates

### `/.github/ISSUE_TEMPLATE/bug_report.md`

```markdown
---
name: Bug Report
about: Report a bug in the CLI or website
title: '[BUG] '
labels: bug
---

## Description
A clear description of the bug.

## Steps to Reproduce
1. Run `bloktastic ...`
2. ...

## Expected Behavior
What should happen.

## Actual Behavior
What actually happens.

## Environment
- OS: [e.g., macOS 14]
- Node.js: [e.g., 20.10.0]
- CLI Version: [e.g., 0.1.0]
```

### `/.github/ISSUE_TEMPLATE/component_request.md`

```markdown
---
name: Component Request
about: Suggest a new component for the registry
title: '[COMPONENT] '
labels: component-request
---

## Component Name
What should it be called?

## Description
What does this component do?

## Use Case
When would someone use this?

## Example Fields
What Storyblok fields should it have?

## Similar Components
Links to similar implementations (optional).
```

### `/.github/ISSUE_TEMPLATE/feature_request.md`

```markdown
---
name: Feature Request
about: Suggest a feature for the CLI or website
title: '[FEATURE] '
labels: enhancement
---

## Description
A clear description of the feature.

## Use Case
Why is this feature needed?

## Proposed Solution
How should it work?
```

---

## PR Template

### `/.github/PULL_REQUEST_TEMPLATE.md`

```markdown
## Description
What does this PR do?

## Type of Change
- [ ] New component
- [ ] Bug fix
- [ ] Feature
- [ ] Documentation
- [ ] Other

## Checklist
- [ ] I've run `bloktastic validate` on any new/changed packages
- [ ] I've updated documentation if needed
- [ ] I've tested my changes locally

## Screenshots (if applicable)
```

---

## Vercel/Netlify Configuration

### `/packages/website/vercel.json` (if using Vercel)

```json
{
  "buildCommand": "pnpm build",
  "outputDirectory": "dist",
  "framework": "astro"
}
```

### `/packages/website/netlify.toml` (if using Netlify)

```toml
[build]
  command = "pnpm build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

---

## Final Checklist

### Repository Setup
- [ ] README.md is complete and professional
- [ ] CONTRIBUTING.md explains the process
- [ ] LICENSE file exists (MIT)
- [ ] .gitignore covers all generated files
- [ ] Issue templates are in place
- [ ] PR template is in place

### CLI Package
- [ ] Package is publishable (`npm publish --dry-run`)
- [ ] All commands work as documented
- [ ] Error messages are helpful
- [ ] Help text is complete

### Registry
- [ ] All starter components pass validation
- [ ] registry.json is up to date
- [ ] Each component has complete files

### Website
- [ ] Builds without errors
- [ ] All pages render correctly
- [ ] Mobile responsive
- [ ] Dark mode works
- [ ] Links are correct

### CI/CD
- [ ] PR validation runs successfully
- [ ] Registry build works
- [ ] Website deploys correctly

---

## Launch Checklist

1. **Pre-Launch**
   - [ ] Final code review
   - [ ] Test all CLI commands
   - [ ] Test website in production mode
   - [ ] Check all links

2. **Launch**
   - [ ] Publish CLI to npm
   - [ ] Deploy website
   - [ ] Create GitHub release

3. **Announcement**
   - [ ] LinkedIn post
   - [ ] Storyblok Discord
   - [ ] Twitter/X (optional)

4. **Post-Launch**
   - [ ] Monitor for issues
   - [ ] Respond to feedback
   - [ ] Track usage metrics

---

## Acceptance Criteria

- [ ] README ist professionell und vollständig
- [ ] CONTRIBUTING erklärt den Beitragsprozess
- [ ] Issue/PR Templates sind vorhanden
- [ ] Deployment-Config ist bereit
- [ ] Alle vorherigen Tasks sind integriert
- [ ] Projekt ist bereit für Launch

## Abschluss

🎉 **Congratulations!** Das MVP ist fertig.

Nach diesem Task ist Bloktastic bereit für:
- npm publish (`@bloktastic/cli`)
- Website deployment (bloktastic.dev)
- Community launch
