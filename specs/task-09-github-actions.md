# Task 9: GitHub Actions (Validation, Registry Build)

## Ziel
Erstelle GitHub Actions für automatische PR-Validierung und Registry-Build.

## Voraussetzungen
- Task 8 abgeschlossen (Starter Components)

## Workflows zu erstellen

### 1. PR Validation (`validate.yml`)
### 2. Registry Build (`build-registry.yml`)
### 3. Website Deploy (`deploy.yml`)

---

## Workflow 1: PR Validation

Läuft bei jedem PR der Registry-Dateien ändert.

### `/.github/workflows/validate.yml`

```yaml
name: Validate Packages

on:
  pull_request:
    paths:
      - 'registry/**'
      - 'schema/**'

jobs:
  validate:
    name: Validate Changed Packages
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Setup pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 8

      - name: Install dependencies
        run: pnpm install

      - name: Build CLI
        run: pnpm --filter @bloktastic/cli build

      - name: Get changed files
        id: changed-files
        uses: tj-actions/changed-files@v42
        with:
          files: |
            registry/**

      - name: Find changed packages
        id: packages
        run: |
          PACKAGES=""
          for file in ${{ steps.changed-files.outputs.all_changed_files }}; do
            # Extract package directory (e.g., registry/components/hero)
            PKG_DIR=$(echo "$file" | grep -oP 'registry/(components|plugins|presets)/[^/]+' | head -1)
            if [ -n "$PKG_DIR" ] && [ -d "$PKG_DIR" ]; then
              if [[ ! "$PACKAGES" =~ "$PKG_DIR" ]]; then
                PACKAGES="$PACKAGES $PKG_DIR"
              fi
            fi
          done
          echo "packages=$PACKAGES" >> $GITHUB_OUTPUT

      - name: Validate packages
        if: steps.packages.outputs.packages != ''
        run: |
          echo "Validating packages: ${{ steps.packages.outputs.packages }}"
          for pkg in ${{ steps.packages.outputs.packages }}; do
            echo "::group::Validating $pkg"
            node packages/cli/dist/index.js validate "$pkg"
            echo "::endgroup::"
          done

      - name: Check for duplicate names
        run: |
          echo "Checking for duplicate package names..."
          node scripts/check-duplicates.js

      - name: Validate JSON Schemas
        run: |
          echo "Validating JSON schemas..."
          npx ajv validate -s schema/bloktastic.schema.json -r schema/*.json --strict=false -d "registry/**/bloktastic.json"
```

---

## Workflow 2: Registry Build

Baut `registry.json` automatisch nach Merge in `main`.

### `/.github/workflows/build-registry.yml`

```yaml
name: Build Registry

on:
  push:
    branches: [main]
    paths:
      - 'registry/**'

  # Allow manual trigger
  workflow_dispatch:

jobs:
  build:
    name: Build registry.json
    runs-on: ubuntu-latest

    permissions:
      contents: write

    steps:
      - name: Checkout
        uses: actions/checkout@v4
        with:
          token: ${{ secrets.GITHUB_TOKEN }}

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Setup pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 8

      - name: Install dependencies
        run: pnpm install

      - name: Build registry.json
        run: node scripts/build-registry.js

      - name: Check for changes
        id: git-check
        run: |
          git diff --exit-code registry/registry.json || echo "changed=true" >> $GITHUB_OUTPUT

      - name: Commit updated registry
        if: steps.git-check.outputs.changed == 'true'
        run: |
          git config --local user.email "github-actions[bot]@users.noreply.github.com"
          git config --local user.name "github-actions[bot]"
          git add registry/registry.json
          git commit -m "chore: rebuild registry.json [skip ci]"
          git push
```

---

## Workflow 3: Website Deploy

Deployed die Astro Website bei Änderungen.

### `/.github/workflows/deploy.yml`

```yaml
name: Deploy Website

on:
  push:
    branches: [main]
    paths:
      - 'packages/website/**'
      - 'registry/**'

  # Allow manual trigger
  workflow_dispatch:

jobs:
  build:
    name: Build Website
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Setup pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 8

      - name: Install dependencies
        run: pnpm install

      - name: Build website
        run: pnpm --filter website build

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: packages/website/dist

  deploy:
    name: Deploy to GitHub Pages
    needs: build
    runs-on: ubuntu-latest

    permissions:
      pages: write
      id-token: write

    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}

    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

---

## Build Scripts

### `/scripts/build-registry.js`

```javascript
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const REGISTRY_DIR = path.join(ROOT, 'registry');

async function buildRegistry() {
  console.log('Building registry.json...\n');

  const registry = {
    $schema: 'https://bloktastic.dev/schema/registry.schema.json',
    name: 'bloktastic',
    version: '1.0.0',
    homepage: 'https://bloktastic.dev',
    repository: 'https://github.com/bloktastic/bloktastic',
    packages: {
      components: [],
      plugins: [],
      presets: [],
    },
    categories: {
      components: ['sections', 'content', 'navigation', 'forms', 'media', 'layout', 'commerce'],
      plugins: ['field-plugins', 'tool-plugins', 'sidebar-plugins'],
    },
    stats: {
      totalComponents: 0,
      totalPlugins: 0,
      totalPresets: 0,
      lastUpdated: new Date().toISOString(),
    },
  };

  // Process each package type
  for (const type of ['components', 'plugins', 'presets']) {
    const typeDir = path.join(REGISTRY_DIR, type);

    try {
      const packages = await fs.readdir(typeDir);

      for (const pkgName of packages) {
        const pkgDir = path.join(typeDir, pkgName);
        const stat = await fs.stat(pkgDir);

        if (!stat.isDirectory()) continue;

        const manifestPath = path.join(pkgDir, 'bloktastic.json');

        try {
          const manifestContent = await fs.readFile(manifestPath, 'utf-8');
          const manifest = JSON.parse(manifestContent);

          const entry = {
            name: manifest.name,
            path: `${type}/${pkgName}`,
            version: manifest.version,
            title: manifest.title,
            tags: manifest.tags || [],
            category: manifest.category,
            status: manifest.metadata?.status || 'stable',
          };

          // Add includes for presets
          if (type === 'presets' && manifest.includes) {
            entry.includes = manifest.includes;
          }

          registry.packages[type].push(entry);
          console.log(`  ✓ ${manifest.name}`);

        } catch (e) {
          console.warn(`  ⚠ Skipping ${pkgName}: ${e.message}`);
        }
      }
    } catch (e) {
      // Directory doesn't exist, skip
    }
  }

  // Update stats
  registry.stats.totalComponents = registry.packages.components.length;
  registry.stats.totalPlugins = registry.packages.plugins.length;
  registry.stats.totalPresets = registry.packages.presets.length;

  // Sort packages by name
  for (const type of ['components', 'plugins', 'presets']) {
    registry.packages[type].sort((a, b) => a.name.localeCompare(b.name));
  }

  // Write registry.json
  const outputPath = path.join(REGISTRY_DIR, 'registry.json');
  await fs.writeFile(outputPath, JSON.stringify(registry, null, 2) + '\n');

  console.log('\n✓ Built registry.json');
  console.log(`  Components: ${registry.stats.totalComponents}`);
  console.log(`  Plugins: ${registry.stats.totalPlugins}`);
  console.log(`  Presets: ${registry.stats.totalPresets}`);
}

buildRegistry().catch(console.error);
```

### `/scripts/check-duplicates.js`

```javascript
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const REGISTRY_DIR = path.join(ROOT, 'registry');

async function checkDuplicates() {
  const names = new Map();
  let hasDuplicates = false;

  for (const type of ['components', 'plugins', 'presets']) {
    const typeDir = path.join(REGISTRY_DIR, type);

    try {
      const packages = await fs.readdir(typeDir);

      for (const pkgName of packages) {
        const pkgDir = path.join(typeDir, pkgName);
        const stat = await fs.stat(pkgDir);

        if (!stat.isDirectory()) continue;

        const manifestPath = path.join(pkgDir, 'bloktastic.json');

        try {
          const manifestContent = await fs.readFile(manifestPath, 'utf-8');
          const manifest = JSON.parse(manifestContent);

          if (names.has(manifest.name)) {
            console.error(`✗ Duplicate name: ${manifest.name}`);
            console.error(`  - ${names.get(manifest.name)}`);
            console.error(`  - ${type}/${pkgName}`);
            hasDuplicates = true;
          } else {
            names.set(manifest.name, `${type}/${pkgName}`);
          }

        } catch (e) {
          // Skip invalid packages
        }
      }
    } catch (e) {
      // Directory doesn't exist
    }
  }

  if (hasDuplicates) {
    process.exit(1);
  }

  console.log('✓ No duplicate package names found');
}

checkDuplicates().catch(console.error);
```

---

## Acceptance Criteria

### validate.yml
- [ ] Läuft bei PRs die registry/ ändern
- [ ] Findet geänderte Packages korrekt
- [ ] Führt `bloktastic validate` für jedes Package aus
- [ ] Prüft auf Duplicate Names
- [ ] Validiert JSON Schemas
- [ ] Blockiert PR bei Fehlern

### build-registry.yml
- [ ] Läuft nach Push auf main
- [ ] Baut registry.json korrekt
- [ ] Committed nur wenn Änderungen vorhanden
- [ ] `[skip ci]` verhindert Loop

### deploy.yml
- [ ] Baut Astro Website
- [ ] Deployed zu GitHub Pages
- [ ] Läuft bei Website- und Registry-Änderungen

### Scripts
- [ ] `build-registry.js` erstellt korrektes registry.json
- [ ] `check-duplicates.js` findet Duplikate

## Test Commands

```bash
# Registry lokal bauen
node scripts/build-registry.js

# Duplikate prüfen
node scripts/check-duplicates.js
```

## Nächster Task
→ Task 10: Website Setup (Astro)
