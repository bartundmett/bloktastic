# Bloktastic - Product Requirements Document

## Executive Summary

**Bloktastic** ist eine Open-Source Community Registry für Storyblok Components und Plugins. Entwickler können vorgefertigte Component-Schemas und AI-Generation-Prompts über ein CLI in ihre Storyblok Spaces installieren.

**Domain:** bloktastic.dev (bereits gesichert)
**Lizenz:** MIT (Open Source)
**Maintainer:** Benedikt Müller (Storyblok MVP)

---

## Strategic Risks & Mitigation

### Risiko 1: Storyblok launcht eigenen Marketplace

**Szenario:** Storyblok führt einen offiziellen Component Marketplace ein.

**Mitigation:** Der AI-Prompt-Ansatz differenziert Bloktastic fundamental. Ein offizieller Marketplace würde vermutlich fertige Code-Templates pro Framework anbieten. Bloktastic's Prompt-Ansatz ist:
- Framework-agnostisch (ein Prompt für alle Stacks)
- Anpassbar an individuelle Projekt-Kontexte
- Unabhängig von Storyblok's Produkt-Roadmap

**Worst Case:** Bloktastic wird zu einer Community-Ergänzung statt Alternative.

### Risiko 2: Prompt-Ansatz zu abstrakt

**Szenario:** Entwickler wollen fertigen Code, nicht Prompts die sie erst in AI-Tools kippen müssen.

**Mitigation:**
1. Prompts sind auch als menschenlesbare Specs verwendbar (Copy-Paste Fallback)
2. Community-Feedback-System zeigt welche Prompts gut funktionieren
3. Pivot-Option: Bei mangelnder Adoption → Code-Snippets für Top-Frameworks (Vue, React) als Phase X

### Risiko 3: Community entsteht nicht

**Szenario:** Zu nischig, zu wenig aktive Storyblok-Entwickler.

**Mitigation:**
1. Eigene Components für Critical Mass (20+ zum Launch)
2. Storyblok MVP-Netzwerk für erste Contributors
3. E-Commerce-Fokus (Shopware, Emporix) als DACH-Differenzierung

---

## Problem Statement

### Aktueller Zustand

1. **Jeder baut dieselben Components neu** - Hero, Teaser, Accordion, FAQ werden in jedem Storyblok-Projekt von Grund auf erstellt.

2. **Kein zentraler Marketplace** - Storyblok hat einen Plugin Store, aber keinen Component-Marketplace. Gute Community-Components sind auf GitHub verstreut, schlecht dokumentiert, oft abandoned.

3. **Schema allein reicht nicht** - Ein Storyblok Component Schema ist nur die halbe Miete. Der Frontend-Code (Vue/React/etc.) fehlt, und jeder hat einen anderen Stack.

4. **Keine Standardisierung** - Keine einheitliche Struktur für das Teilen von Components.

### Bestehende Tools (keine Konkurrenz)

| Tool | Funktion | Lücke |
|------|----------|-------|
| `awesome-storyblok` | Link-Liste | Kein CLI, keine Installation |
| `storyblok-cli` | Push/Pull eigener Schemas | Kein Marketplace |
| `storyblok-migrate` | Migrationen | Keine Registry |

**Ergebnis:** Die Lücke für eine Community-Registry existiert. Kein vergleichbares Projekt vorhanden.

---

## Solution

### Kernkonzept

Bloktastic ist eine **kuratierte Registry** mit drei Säulen:

1. **Components** - Storyblok Schemas + AI-Prompts für Frontend-Generierung
2. **Plugins** - Kuratierte Liste externer Field/Tool Plugins
3. **Presets** - Bundles von Components für Starter-Kits

### Differenzierung: Der Prompt-Ansatz

Statt 50 Framework-Varianten zu maintainen (Vue + Tailwind, React + Styled Components, etc.), liefert Bloktastic:

1. **Das Schema** - Universell, wird direkt in Storyblok gepusht
2. **Einen strukturierten AI-Prompt** - Beschreibt Intent, Varianten, Edge Cases, A11y

Der Entwickler nimmt den Prompt, füttert ihn in Cursor/Claude mit seinem Projekt-Kontext, und bekommt Code der zu seinem Setup passt.

**Das ist Context Engineering für Component-Entwicklung.**

### Fallback für Nicht-AI-User

Prompts funktionieren auch ohne AI-Tools:
- **Als Spec-Dokument:** Strukturierte Anforderungen für manuelle Implementierung
- **Als Onboarding:** Neue Team-Mitglieder verstehen Component-Intent
- **Als Review-Checkliste:** A11y, Edge Cases, Styling bereits dokumentiert

### Inspirationsquellen

- **shadcn/ui** - Registry-Pattern, JSON-Schema, CLI-Installation
- **Homebrew Taps** - Community-getriebene Package-Distribution
- **Terraform Registry** - Module/Provider Marketplace mit Versionierung

---

## Technical Architecture

### Tech Stack

| Komponente | Technologie | Begründung |
|------------|-------------|------------|
| Registry | GitHub Repository | Version Control, PRs, Community-Standard |
| Website | Astro + Static | Schnell, SEO, einfach zu hosten |
| CLI | Node.js (TypeScript) | npm-Distribution, Storyblok SDK kompatibel |
| Validation | JSON Schema (Ajv) | Automatische Package-Validierung |
| CI/CD | GitHub Actions | Automatische Builds, Validation |
| Hosting | Vercel/Netlify | Kostenlos für Open Source |

### Contributor System & Governance

**Contributor Levels:**

| Level | Rechte | Anforderung |
|-------|--------|-------------|
| **Newcomer** | PRs einreichen, alle Reviews nötig | GitHub Account |
| **Trusted** | Direktes Publish eigener `@user/*` Packages | 3+ merged PRs, Code-Review bestanden |
| **Core** | Review anderer PRs, `@bloktastic/*` Publish | Einladung durch Maintainer |
| **Maintainer** | Admin, Governance-Entscheidungen | Benedikt + eingeladene Co-Maintainer |

**Trusted Contributor Onboarding:**
1. User reicht 3 qualitativ hochwertige PRs ein
2. Core-Reviewer prüft Code-Qualität und Prompt-Struktur
3. Bei Approval: User erhält Trusted-Status
4. Trusted Contributors können eigene Packages ohne Review publishen

**Quality Gates für PRs:**
- [ ] `bloktastic.json` valide gegen Schema
- [ ] `schema.json` valide Storyblok-Struktur
- [ ] `prompt.md` enthält alle Required Sections
- [ ] `README.md` vorhanden und aussagekräftig
- [ ] Keine Duplicate Names in Registry
- [ ] Dependencies existieren

### Repository Struktur

```
bloktastic/
├── packages/
│   ├── cli/                      # @bloktastic/cli npm package
│   │   ├── src/
│   │   │   ├── commands/
│   │   │   │   ├── add.ts        # Install component/plugin
│   │   │   │   ├── search.ts     # Search registry
│   │   │   │   ├── list.ts       # List packages
│   │   │   │   ├── create.ts     # Scaffold new package
│   │   │   │   ├── validate.ts   # Validate package structure
│   │   │   │   └── init.ts       # Initialize project config
│   │   │   ├── lib/
│   │   │   │   ├── storyblok.ts  # Storyblok API wrapper
│   │   │   │   ├── registry.ts   # Registry API client
│   │   │   │   └── prompts.ts    # Interactive prompts
│   │   │   └── index.ts
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── website/                  # bloktastic.dev
│       ├── src/
│       │   ├── pages/
│       │   │   ├── index.astro
│       │   │   ├── components/[...slug].astro
│       │   │   ├── plugins/[...slug].astro
│       │   │   └── docs/[...slug].astro
│       │   └── components/
│       ├── astro.config.mjs
│       └── package.json
│
├── registry/                     # Community Packages
│   ├── registry.json             # Master index
│   ├── components/
│   │   ├── hero/
│   │   │   ├── bloktastic.json
│   │   │   ├── schema.json
│   │   │   ├── prompt.md
│   │   │   └── README.md
│   │   ├── accordion/
│   │   ├── teaser/
│   │   └── ...
│   ├── plugins/
│   │   ├── advanced-color-picker/
│   │   │   ├── bloktastic.json
│   │   │   └── README.md
│   │   └── ...
│   └── presets/
│       ├── blog-starter/
│       │   ├── bloktastic.json
│       │   └── README.md
│       └── ...
│
├── schema/                       # JSON Schemas for validation
│   ├── bloktastic.schema.json
│   ├── registry.schema.json
│   └── config.schema.json
│
├── .github/
│   └── workflows/
│       ├── validate.yml          # PR validation
│       ├── build-registry.yml    # Rebuild registry.json
│       └── deploy.yml            # Deploy website
│
├── CONTRIBUTING.md
├── LICENSE
└── README.md
```

---

## Package Specifications

### Package Naming & Namespaces

Alle Packages verwenden npm-style Namespaces zur Vermeidung von Naming-Konflikten:

```
@<namespace>/<package-name>
```

**Namespace-Typen:**
| Namespace | Beschreibung | Beispiel |
|-----------|--------------|----------|
| `@bloktastic` | Offizielle/Core Packages | `@bloktastic/hero` |
| `@<github-user>` | User-owned Packages | `@bmueller/hero-video` |
| `@<org>` | Organisation Packages | `@acme-agency/client-hero` |

**Naming Rules:**
- Namespace: GitHub Username oder Org, lowercase
- Package Name: lowercase, hyphens, 2-50 Zeichen
- Reserved: `@bloktastic/*` nur für Core-Maintainer

### 1. Component Package Manifest (`bloktastic.json`)

```json
{
  "$schema": "https://bloktastic.dev/schema/bloktastic.schema.json",
  "name": "@bloktastic/hero",
  "type": "component",
  "version": "1.0.0",
  "title": "Hero Section",
  "description": "Full-width hero with headline, subline, CTA and background image",

  "author": {
    "name": "Benedikt Müller",
    "github": "bmueller"
  },
  
  "compatibility": {
    "storyblok": ">=2.0.0",
    "storyblokMax": "3.0.0",
    "frameworks": ["vue", "nuxt", "react", "nextjs", "astro", "agnostic"]
  },

  // CLI prüft User's Space gegen diese Range:
  // - Warnung wenn außerhalb Range
  // - Blockiert Installation wenn majorVersion nicht passt
  
  "tags": ["hero", "header", "landing", "marketing"],
  "category": "sections",
  
  "files": {
    "schema": "schema.json",
    "prompt": "prompt.md",
    "readme": "README.md"
  },
  
  "dependencies": {
    "bloktastic": ["@bloktastic/button", "@bloktastic/image"]
  },
  
  "metadata": {
    "created": "2026-01-28",
    "updated": "2026-01-28",
    "status": "stable"
  }
}
```

### 2. Storyblok Schema (`schema.json`)

Standard Storyblok Component Schema Format mit Bloktastic-Header:

```json
{
  "$bloktastic": {
    "version": "1.0.0"
  },
  "name": "hero",
  "display_name": "Hero Section",
  "is_root": false,
  "is_nestable": true,
  "schema": {
    "headline": {
      "type": "text",
      "pos": 0,
      "required": true,
      "description": "Main headline text",
      "display_name": "Headline"
    },
    "subline": {
      "type": "textarea",
      "pos": 1,
      "description": "Supporting text below headline"
    },
    "background_image": {
      "type": "asset",
      "pos": 2,
      "filetypes": ["images"],
      "description": "Background image (recommended: 1920x1080)"
    },
    "cta_buttons": {
      "type": "bloks",
      "pos": 3,
      "restrict_components": true,
      "component_whitelist": ["button"],
      "maximum": 2
    },
    "alignment": {
      "type": "option",
      "pos": 4,
      "options": [
        { "name": "Left", "value": "left" },
        { "name": "Center", "value": "center" },
        { "name": "Right", "value": "right" }
      ],
      "default_value": "center"
    }
  },
  "preview_field": "headline"
}
```

### 3. AI Generation Prompt (`prompt.md`)

```markdown
# Hero Section Component

## Purpose
A full-width hero section typically used at the top of landing pages.
Displays a prominent headline, optional subline, background image with
overlay, and up to two CTA buttons.

## Storyblok Schema Fields
- `headline` (text, required): Main heading, typically H1
- `subline` (textarea): Supporting paragraph text
- `background_image` (asset): Full-width background image
- `cta_buttons` (bloks): Array of button components (max 2)
- `alignment` (option): Text alignment - left/center/right

## Visual Requirements
- Full viewport width, min-height 60vh
- Background image with object-fit: cover
- Dark gradient overlay for text readability
- Responsive: Stack vertically on mobile
- Text should be white/light for contrast

## Accessibility
- Headline should be `<h1>` if used as page hero
- Background image needs meaningful alt text OR role="presentation"
- Buttons need sufficient color contrast
- Consider reduced-motion preferences for animations

## Example Props Structure
\`\`\`typescript
interface HeroProps {
  headline: string;
  subline?: string;
  backgroundImage?: {
    filename: string;
    alt: string;
  };
  ctaButtons?: ButtonProps[];
  alignment?: 'left' | 'center' | 'right';
}
\`\`\`

## Styling Considerations
- Use CSS custom properties for theming
- Consider aspect-ratio for consistent heights
- Button container: flex with gap for spacing

## Edge Cases
- No background image: Use solid brand color fallback
- Very long headlines: Consider max-width and font scaling
- Single button: Center it regardless of alignment
- No CTA: Increase bottom padding for visual balance
```

### 4. Plugin Package Manifest

```json
{
  "$schema": "https://bloktastic.dev/schema/bloktastic.schema.json",
  "name": "advanced-color-picker",
  "type": "plugin",
  "version": "2.1.0",
  "title": "Advanced Color Picker",
  "description": "Enhanced color picker with palette presets and opacity",
  
  "author": {
    "name": "Jane Doe",
    "github": "janedoe"
  },
  
  "compatibility": {
    "storyblok": ">=2.0.0",
    "pluginType": "field-type"
  },
  
  "tags": ["color", "design", "field-plugin"],
  "category": "field-plugins",
  
  "source": {
    "type": "github",
    "url": "https://github.com/janedoe/storyblok-color-picker",
    "branch": "main"
  },
  
  "installation": {
    "storeUrl": "https://www.storyblok.com/mp/advanced-color-picker",
    "selfHosted": true,
    "instructions": "README.md"
  },
  
  "status": "maintained",
  "lastVerified": "2026-01-20"
}
```

### 5. Preset Package Manifest

```json
{
  "$schema": "https://bloktastic.dev/schema/bloktastic.schema.json",
  "name": "blog-starter",
  "type": "preset",
  "version": "1.0.0",
  "title": "Blog Starter Kit",
  "description": "Complete component set for a blog",
  
  "author": {
    "name": "Bloktastic Team",
    "github": "bloktastic"
  },
  
  "includes": [
    "article",
    "author-card",
    "category-tag",
    "featured-posts-grid",
    "article-teaser"
  ],
  
  "tags": ["blog", "starter", "bundle"],
  "category": "presets"
}
```

### 6. Registry Index (`registry.json`)

```json
{
  "$schema": "https://bloktastic.dev/schema/registry.schema.json",
  "name": "bloktastic",
  "version": "1.0.0",
  "homepage": "https://bloktastic.dev",
  "repository": "https://github.com/bloktastic/registry",
  
  "packages": {
    "components": [
      {
        "name": "hero",
        "path": "components/hero",
        "version": "1.0.0",
        "title": "Hero Section",
        "tags": ["hero", "header", "landing"],
        "category": "sections"
      }
    ],
    "plugins": [
      {
        "name": "advanced-color-picker",
        "path": "plugins/advanced-color-picker",
        "version": "2.1.0",
        "title": "Advanced Color Picker",
        "status": "maintained"
      }
    ],
    "presets": [
      {
        "name": "blog-starter",
        "path": "presets/blog-starter",
        "version": "1.0.0",
        "includes": ["article", "author-card", "category-tag"]
      }
    ]
  },
  
  "categories": {
    "components": ["sections", "content", "navigation", "forms", "media", "layout", "commerce"],
    "plugins": ["field-plugins", "tool-plugins", "sidebar-plugins"]
  },
  
  "stats": {
    "totalComponents": 0,
    "totalPlugins": 0,
    "totalPresets": 0,
    "lastUpdated": "2026-01-28T00:00:00Z"
  }
}
```

### 7. Package Lifecycle & Deprecation

**Status-Werte:**

| Status | Bedeutung | Trigger |
|--------|-----------|---------|
| `stable` | Aktiv maintained, empfohlen | Default bei Publish |
| `unmaintained` | Keine Updates >6 Monate | Automatisch via CI |
| `deprecated` | Sollte nicht verwendet werden | Manuell oder >12 Monate inaktiv |
| `archived` | Aus Registry entfernt, nur noch historisch | Manuell durch Maintainer |

**Automatische Checks (GitHub Action):**
```yaml
# Wöchentlicher Check
- Packages ohne Commit seit 6 Monaten → status: unmaintained
- Packages ohne Commit seit 12 Monaten → status: deprecated
- Benachrichtigung an Author via GitHub Issue
```

**CLI Warnings:**
```bash
bloktastic add @user/old-component

⚠️  Warning: This package hasn't been updated in 8 months.
    Status: unmaintained
    Consider using @bloktastic/hero instead.

    Continue anyway? (y/N)
```

**Community Takeover:**
- Deprecated Packages können von anderen Usern übernommen werden
- Original Author muss zustimmen ODER 3 Monate nicht reagieren
- Neuer Maintainer erstellt Fork unter eigenem Namespace

### 8. Project Config (`bloktastic.config.json`)

Wird im User-Projekt erstellt via `bloktastic init`:

```json
{
  "$schema": "https://bloktastic.dev/schema/config.schema.json",
  "space": {
    "id": "123456",
    "region": "eu"
  },
  "preferences": {
    "defaultFramework": "nuxt",
    "outputDirectory": "./components/storyblok",
    "promptOutput": "clipboard"
  },
  "installedPackages": []
}
```

---

## CLI Specification

### Installation

```bash
npm install -g @bloktastic/cli
# oder
npx @bloktastic/cli <command>
```

### Commands

#### `bloktastic init`

Initialisiert Bloktastic in einem Projekt.

```bash
bloktastic init

# Interaktiver Flow:
# ? Storyblok Space ID: 123456
# ? Region: (eu/us/ca/ap) eu
# ? Default Framework: (vue/nuxt/react/nextjs/astro) nuxt
# ? Output Directory: ./components/storyblok
# 
# ✓ Created bloktastic.config.json
# ✓ Authenticated with Storyblok
```

**Implementierung:**
1. Interaktive Prompts (inquirer/prompts)
2. Config-File schreiben
3. Storyblok Token aus Environment oder Prompt
4. Token validieren via Management API

#### `bloktastic add <package>`

Installiert ein Package.

```bash
# Component installieren
bloktastic add hero

# Mit Optionen
bloktastic add hero --prompt-only        # Nur Prompt anzeigen/kopieren
bloktastic add hero --framework vue      # Vue-Code generieren (falls vorhanden)
bloktastic add hero --skip-schema        # Schema nicht pushen

# Plugin
bloktastic add plugin:advanced-color-picker

# Preset (mehrere Components)
bloktastic add preset:blog-starter
```

**Implementierung:**
1. Package aus Registry laden (fetch `registry.json`, dann Package-Files)
2. Schema validieren
3. Dependencies prüfen/installieren (rekursiv)
4. Schema via Storyblok Management API pushen
5. Prompt anzeigen oder in Clipboard kopieren
6. `installedPackages` in Config updaten

**Flow:**
```
┌─────────────────────────────────────────────────────────────┐
│ bloktastic add hero                                         │
├─────────────────────────────────────────────────────────────┤
│ 1. Fetch registry.json                                      │
│ 2. Find "hero" package                                      │
│ 3. Fetch hero/bloktastic.json, schema.json, prompt.md       │
│ 4. Check dependencies → found: "button"                     │
│    └─ Recursively install "button" first                    │
│ 5. POST schema.json to Storyblok Management API             │
│    └─ POST /v1/spaces/{id}/components                       │
│ 6. Prompt: "Generate frontend code?"                        │
│    └─ Yes: "Which framework?" → vue/react/nuxt/prompt       │
│    └─ No: Skip                                              │
│ 7. If prompt: Copy prompt.md to clipboard                   │
│ 8. Update bloktastic.config.json installedPackages          │
│ 9. Success message                                          │
└─────────────────────────────────────────────────────────────┘
```

**Dependency Conflict Handling:**

Wenn eine Dependency bereits im Storyblok Space existiert:

```bash
bloktastic add @bloktastic/hero

Installing @bloktastic/hero...

Checking dependencies:
  ✓ @bloktastic/image (not installed, will install)
  ⚠ @bloktastic/button (already exists in Space)
    → Skipping installation (existing component preserved)
    → Note: Schema may differ from Bloktastic version

Continue? (Y/n)
```

**Regeln:**
- Existierende Components werden NICHT überschrieben (User-Daten schützen)
- Warning wird angezeigt
- User kann mit `--force` überschreiben (mit Backup-Hinweis)
- Installierte Packages werden in Config getrackt um Konflikte zu erkennen

#### `bloktastic search <query>`

Sucht in der Registry.

```bash
bloktastic search hero
bloktastic search --type plugin color
bloktastic search --category sections
bloktastic search --tag faq
```

**Output:**
```
Found 3 components matching "hero":

  hero (v1.0.0) - sections
  Full-width hero with headline, subline, CTA and background image
  Tags: hero, header, landing
  
  hero-video (v1.2.0) - sections
  Hero section with video background
  Tags: hero, video, landing
  
  hero-split (v0.9.0) - sections
  Split-screen hero with image on one side
  Tags: hero, split, landing

Run `bloktastic add <name>` to install.
```

#### `bloktastic list`

Listet verfügbare Packages.

```bash
bloktastic list                    # Alle
bloktastic list --type components  # Nur Components
bloktastic list --type plugins     # Nur Plugins
bloktastic list --category sections
bloktastic list --installed        # Nur installierte
```

#### `bloktastic create <type> <name>`

Scaffoldet ein neues Package für Contributors.

```bash
bloktastic create component my-accordion
bloktastic create plugin my-field-plugin
bloktastic create preset my-starter
```

**Output:**
```
Created package structure:

  registry/components/my-accordion/
  ├── bloktastic.json   ← Package manifest (edit this)
  ├── schema.json       ← Storyblok schema (edit this)
  ├── prompt.md         ← AI generation prompt (edit this)
  └── README.md         ← Documentation (edit this)

Next steps:
  1. Edit the files above
  2. Run `bloktastic validate registry/components/my-accordion`
  3. Submit a PR to github.com/bloktastic/registry
```

#### `bloktastic validate <path>`

Validiert ein Package gegen das Schema.

```bash
bloktastic validate registry/components/my-accordion

# Output:
# Validating my-accordion...
# ✓ bloktastic.json valid
# ✓ schema.json valid
# ✓ prompt.md exists (2.4kb)
# ✓ README.md exists
# ✓ All dependencies available: button
# 
# Package is valid and ready for submission.
```

**Checks:**
1. `bloktastic.json` gegen JSON Schema validieren
2. `schema.json` gegen Storyblok Schema Format validieren
3. Required files existieren (`prompt.md`, `README.md`)
4. Dependencies in Registry vorhanden
5. Keine duplicate names
6. Semantic version format

#### `bloktastic info <package>`

Zeigt Details zu einem Package.

```bash
bloktastic info hero

# Output:
# hero v1.0.0
# Full-width hero with headline, subline, CTA and background image
# 
# Author:      Benedikt Müller (@bmueller)
# Category:    sections
# Tags:        hero, header, landing, marketing
# Frameworks:  vue, nuxt, react, nextjs, astro, agnostic
# 
# Dependencies:
#   - button
# 
# Files:
#   - schema.json (1.2kb)
#   - prompt.md (3.4kb)
#   - README.md (2.1kb)
# 
# Install: bloktastic add hero
```

---

## Website Specification

### Pages

#### Homepage (`/`)

- Hero mit Tagline: "Community Registry für Storyblok Components"
- Quick Stats (X Components, Y Plugins, Z Contributors)
- Search Bar
- Featured/New Packages Grid
- "Getting Started" Section
- Contributor CTA

#### Component Browser (`/components`)

- Filter Sidebar (Category, Tags, Framework)
- Search
- Grid/List Toggle
- Package Cards mit Preview, Stats, Quick-Install Command

#### Component Detail (`/components/[name]`)

- Package Info (Name, Description, Author, Version)
- README Rendered
- Schema Preview (collapsible JSON)
- Prompt Preview (collapsible Markdown)
- Dependencies List
- Install Instructions
- "Copy Schema" / "Copy Prompt" Buttons

#### Plugin Browser (`/plugins`)

- Ähnlich Component Browser
- Status-Badge (maintained/stable/deprecated)
- Link zu Source Repository
- Installation Instructions

#### Documentation (`/docs`)

- Getting Started
- CLI Reference
- Contributing Guide
- Package Specification
- FAQ

### Design

- Clean, minimal (shadcn/ui Ästhetik)
- Dark Mode Support
- Mobile Responsive
- Syntax Highlighting für Code/JSON/Markdown

---

## GitHub Actions

### PR Validation (`.github/workflows/validate.yml`)

```yaml
name: Validate Packages

on:
  pull_request:
    paths:
      - 'registry/**'

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          
      - name: Install CLI
        run: npm install -g @bloktastic/cli
        
      - name: Get changed packages
        id: changed
        uses: dorny/paths-filter@v3
        with:
          list-files: json
          filters: |
            packages:
              - 'registry/**'
              
      - name: Validate changed packages
        run: |
          for dir in $(echo '${{ steps.changed.outputs.packages_files }}' | jq -r '.[]' | xargs -n1 dirname | sort -u); do
            if [ -f "$dir/bloktastic.json" ]; then
              bloktastic validate "$dir"
            fi
          done
```

### Build Registry (`.github/workflows/build-registry.yml`)

```yaml
name: Build Registry

on:
  push:
    branches: [main]
    paths:
      - 'registry/**'

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          
      - name: Build registry.json
        run: node scripts/build-registry.js
        
      - name: Commit updated registry
        uses: stefanzweifel/git-auto-commit-action@v5
        with:
          commit_message: "chore: rebuild registry.json"
          file_pattern: registry/registry.json
```

---

## Implementation Phases

### Phase 1: Foundation (Week 1-2)

**Deliverables:**
- [ ] GitHub Repository Setup (`bloktastic/bloktastic`)
- [ ] JSON Schemas finalisieren und publizieren
- [ ] CLI Grundgerüst:
  - [ ] `bloktastic init`
  - [ ] `bloktastic validate`
  - [ ] `bloktastic create`
- [ ] 3-5 Beispiel-Components erstellen (hero, accordion, teaser, button, image)
- [ ] Basic README und CONTRIBUTING Guide

**Tech Tasks:**
- CLI mit Commander.js oder Oclif
- JSON Schema Validation mit Ajv
- Storyblok API Integration mit `storyblok-js-client`

### Phase 2: Core Functionality + E-Commerce (Week 3-4)

**Deliverables:**
- [ ] CLI vollständig:
  - [ ] `bloktastic add` mit Storyblok Push
  - [ ] `bloktastic search`
  - [ ] `bloktastic list`
  - [ ] `bloktastic info`
- [ ] GitHub Actions für Validation
- [ ] registry.json Auto-Build
- [ ] 10-15 Components im Registry
- [ ] 5-10 curated Plugins gelistet

**E-Commerce Killer Feature (Differenzierung):**
- [ ] E-Commerce Preset: `@bloktastic/ecommerce-starter`
- [ ] Ziel-Plattformen: **Shopware 6**, **Emporix** (DACH-Markt Fokus)
- [ ] Components:
  - [ ] `@bloktastic/product-card`
  - [ ] `@bloktastic/product-grid`
  - [ ] `@bloktastic/add-to-cart`
  - [ ] `@bloktastic/mini-cart`
  - [ ] `@bloktastic/checkout-steps`

**Warum E-Commerce:**
- Storyblok wird oft mit Headless Commerce kombiniert
- Shopware + Emporix sind stark im DACH-Raum → weniger US-Konkurrenz
- E-Commerce Components sind komplex → hoher Mehrwert durch Bloktastic

### Phase 3: Website (Week 5-6)

**Deliverables:**
- [ ] Astro Website Setup
- [ ] Homepage
- [ ] Component/Plugin Browser
- [ ] Detail Pages
- [ ] Documentation Section
- [ ] Search Functionality
- [ ] Deploy auf Vercel/Netlify

### Phase 4: Launch & Community (Week 7-8)

**Deliverables:**
- [ ] Storyblok DevRel informieren
- [ ] Launch-Post auf LinkedIn
- [ ] Storyblok Discord ankündigen
- [ ] Twitter/X Announcement
- [ ] Erste externe Contributions einladen
- [ ] Feedback sammeln und iterieren

---

## Starter Components (Phase 1)

Diese Components sollten initial erstellt werden:

| Component | Kategorie | Beschreibung |
|-----------|-----------|--------------|
| `hero` | sections | Full-width Hero mit Headline, CTA, Background |
| `button` | content | Universeller Button (Primary, Secondary, Ghost) |
| `image` | media | Responsive Image mit Caption |
| `teaser` | content | Card-Style Teaser mit Bild, Titel, Text |
| `accordion` | content | Expandable Accordion mit Items |
| `accordion-item` | content | Einzelnes Accordion Item |
| `rich-text` | content | Styled Rich Text Block |
| `cta-banner` | sections | Call-to-Action Banner |
| `feature-grid` | sections | Grid von Feature Cards |
| `testimonial` | content | Zitat mit Autor |

---

## API Endpoints (Registry)

Die Registry wird statisch über GitHub/CDN gehostet:

```
https://bloktastic.dev/registry.json
https://bloktastic.dev/components/hero/bloktastic.json
https://bloktastic.dev/components/hero/schema.json
https://bloktastic.dev/components/hero/prompt.md
https://bloktastic.dev/components/hero/README.md
```

Kein Backend nötig - alles statische Files.

---

## Storyblok API Integration

### Component Push

```typescript
import StoryblokClient from 'storyblok-js-client'

const Storyblok = new StoryblokClient({
  oauthToken: process.env.STORYBLOK_OAUTH_TOKEN
})

async function pushComponent(spaceId: string, schema: object) {
  // Check if component exists
  const existing = await Storyblok.get(`spaces/${spaceId}/components`, {
    search: schema.name
  })
  
  if (existing.data.components.find(c => c.name === schema.name)) {
    // Update existing
    const component = existing.data.components.find(c => c.name === schema.name)
    await Storyblok.put(`spaces/${spaceId}/components/${component.id}`, {
      component: schema
    })
  } else {
    // Create new
    await Storyblok.post(`spaces/${spaceId}/components`, {
      component: schema
    })
  }
}
```

### Authentication

OAuth Token wird benötigt:
1. User generiert Personal Access Token in Storyblok
2. Token wird in Environment Variable oder Config gespeichert
3. CLI nutzt Token für Management API Calls

---

## Legal & Compliance

### Storyblok Terms

✅ **Kein Verstoß** - Bloktastic:
- Verkauft kein Storyblok
- Nutzt die Management API wie vorgesehen
- Ist ein Community-Tool wie von Storyblok gewünscht (siehe `awesome-storyblok`)

### Trademark

- "Bloktastic" ist eigenständiger Name (kein "Storyblok" im Namen)
- Kein Storyblok Logo ohne Genehmigung verwenden
- Klare Kommunikation: "Community project, not affiliated with Storyblok GmbH"

### MVP Status

Benedikt ist Storyblok MVP - das gibt:
- Direkten Draht zu DevRel für Feedback
- Potentielle Promotion durch Storyblok
- Credibility in der Community

---

## Success Metrics

### Launch (Month 1)
- 20+ Components in Registry
- 10+ Plugins gelistet
- 100+ CLI Downloads
- 5+ External Contributors

### Growth (Month 3)
- 50+ Components
- 20+ Plugins
- 500+ CLI Downloads
- 20+ Contributors
- Storyblok Docs Verlinkung

### Maturity (Month 6)
- 100+ Components
- Community-driven Curation
- Regelmäßige Contributions
- Präsenz auf Storyblok Events/Blog

---

## Future Features (Post-Launch)

### Private Registry (Phase X - Potential Monetization)

**Problem:** Agenturen und Enterprises wollen interne Components teilen ohne sie zu veröffentlichen.

**Lösung:** Self-hosted oder Bloktastic-hosted Private Registry

```bash
# Team-Config
bloktastic config set registry https://registry.acme-agency.com

# Oder Bloktastic Pro
bloktastic login --team acme-agency
bloktastic add @acme-agency/internal-hero  # Private Package
```

**Pricing-Idee (falls Monetarisierung nötig):**
| Tier | Preis | Features |
|------|-------|----------|
| Open Source | Free | Public Registry |
| Team | $29/mo | Private Namespace, 10 private packages |
| Agency | $99/mo | Unlimited private packages, Priority Support |

**Note:** Dies ist ein optionales Future Feature. Bloktastic startet als reines Open-Source Passion Project.

---

## Appendix: JSON Schemas

### bloktastic.schema.json

Siehe `/schema/bloktastic.schema.json` im Repository.

### Key Validation Rules

1. `name`: lowercase, hyphens only, 2-50 chars
2. `version`: semver format (x.y.z)
3. `type`: enum ["component", "plugin", "preset"]
4. `author.github`: valid GitHub username
5. Components require: `files.schema`, `files.prompt`
6. Plugins require: `source`, `status`
7. Presets require: `includes` array

---

## Prompt Quality & Validation

### Required Prompt Sections

Jeder Prompt muss diese Sections enthalten (automatisch validiert):

| Section | Required | Beschreibung |
|---------|----------|--------------|
| `# Component Name` | ✓ | Titel |
| `## Purpose` | ✓ | Wofür wird der Component verwendet? |
| `## Storyblok Schema Fields` | ✓ | Alle Felder dokumentiert |
| `## Visual Requirements` | ✓ | Layout, Spacing, Responsive |
| `## Accessibility` | ✓ | A11y-Anforderungen |
| `## Example Props Structure` | | TypeScript Interface |
| `## Styling Considerations` | | CSS-Hinweise |
| `## Edge Cases` | | Empty States, Long Content |

### Community Feedback System

**Problem:** JSON Schemas sind objektiv validierbar, Prompts nicht.

**Lösung:** Community-Feedback auf Website:

```
@bloktastic/hero  ⭐ 4.8 (23 ratings)

Works well with:
✓ Claude (18 reports)
✓ GPT-4 (12 reports)
✓ Copilot (5 reports)

"Prompt generated clean Vue 3 code on first try" - @devuser
```

**Feedback-Mechanik:**
1. User installiert Component via CLI
2. CLI fragt optional: "Did the prompt work well? (y/n/skip)"
3. Feedback wird anonym aggregiert
4. Website zeigt Ratings und "Works with" Tags

**Prompt Versioning:**
- Prompts können verbessert werden ohne Schema-Change
- `prompt.md` hat eigene Version in Frontmatter
- Changelog für Prompt-Verbesserungen

---

## Appendix: Example Prompt Structure

Jeder Prompt sollte diese Sections haben:

```markdown
# Component Name

## Purpose
Was macht der Component? Wofür wird er verwendet?

## Storyblok Schema Fields
Alle Felder mit Typ und Beschreibung.

## Visual Requirements
Layout, Spacing, Responsive Verhalten.

## Accessibility
A11y Anforderungen: Semantik, ARIA, Keyboard.

## Example Props Structure
TypeScript Interface.

## Styling Considerations
CSS-Hinweise, Custom Properties, Theming.

## Common Variations
Alternative Implementierungen.

## Edge Cases
Empty States, Long Content, etc.
```

---

## Contact

**Maintainer:** Benedikt Müller
**GitHub:** @bmueller
**Status:** Storyblok MVP

---

*Document Version: 1.0*
*Last Updated: 2026-01-28*
