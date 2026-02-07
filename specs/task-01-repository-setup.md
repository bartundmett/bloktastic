# Task 1: Repository-Struktur & Monorepo Setup

## Ziel
Erstelle die grundlegende Monorepo-Struktur für Bloktastic mit pnpm workspaces.

## Voraussetzungen
- Keine (erster Task)

## Technische Details

### Tech Stack
- **Package Manager:** pnpm (für Monorepo Workspaces)
- **Node Version:** 20 LTS
- **TypeScript:** Für CLI und Build-Scripts

### Zu erstellende Struktur

```
bloktastic/
├── packages/
│   ├── cli/                      # @bloktastic/cli npm package
│   │   ├── src/
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── website/                  # bloktastic.dev
│       ├── src/
│       ├── package.json
│       └── astro.config.mjs
│
├── registry/                     # Community Packages
│   ├── registry.json             # Master index (leer initial)
│   └── components/               # Component packages
│
├── schema/                       # JSON Schemas for validation
│   └── (wird in Task 2 befüllt)
│
├── scripts/                      # Build scripts
│   └── build-registry.js
│
├── .github/
│   └── workflows/                # (wird in Task 9 befüllt)
│
├── package.json                  # Root package.json
├── pnpm-workspace.yaml
├── tsconfig.base.json
├── .gitignore
├── .nvmrc
└── LICENSE
```

## Acceptance Criteria

- [ ] `pnpm install` läuft ohne Fehler
- [ ] Workspace-Pakete sind korrekt verlinkt
- [ ] TypeScript Base Config existiert
- [ ] `.gitignore` enthält node_modules, dist, .env
- [ ] MIT License file existiert
- [ ] `.nvmrc` zeigt Node 20

## Dateien

### `/package.json`
```json
{
  "name": "bloktastic",
  "private": true,
  "scripts": {
    "build": "pnpm -r build",
    "dev": "pnpm -r dev",
    "lint": "pnpm -r lint",
    "test": "pnpm -r test"
  },
  "devDependencies": {
    "typescript": "^5.3.0"
  },
  "engines": {
    "node": ">=20.0.0",
    "pnpm": ">=8.0.0"
  }
}
```

### `/pnpm-workspace.yaml`
```yaml
packages:
  - 'packages/*'
```

### `/tsconfig.base.json`
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  }
}
```

### `/packages/cli/package.json`
```json
{
  "name": "@bloktastic/cli",
  "version": "0.1.0",
  "description": "CLI for Bloktastic - Storyblok Component Registry",
  "type": "module",
  "bin": {
    "bloktastic": "./dist/index.js"
  },
  "scripts": {
    "build": "tsc",
    "dev": "tsc --watch",
    "lint": "eslint src"
  },
  "dependencies": {},
  "devDependencies": {
    "typescript": "^5.3.0"
  }
}
```

### `/registry/registry.json`
```json
{
  "$schema": "https://bloktastic.dev/schema/registry.schema.json",
  "name": "bloktastic",
  "version": "1.0.0",
  "homepage": "https://bloktastic.dev",
  "repository": "https://github.com/bloktastic/bloktastic",
  "packages": {
    "components": [],
    "plugins": [],
    "presets": []
  },
  "categories": {
    "components": ["sections", "content", "navigation", "forms", "media", "layout", "commerce"],
    "plugins": ["field-plugins", "tool-plugins", "sidebar-plugins"]
  },
  "stats": {
    "totalComponents": 0,
    "totalPlugins": 0,
    "totalPresets": 0,
    "lastUpdated": ""
  }
}
```

## Commands zum Testen

```bash
# Nach Abschluss sollte funktionieren:
pnpm install
pnpm build  # (wird noch fehlschlagen, da keine src files)
```

## Nächster Task
→ Task 2: JSON Schemas definieren
