# Task 7: CLI search, list, info Commands

## Ziel
Implementiere die Discovery-Commands `search`, `list`, und `info`.

## Voraussetzungen
- Task 6 abgeschlossen (add Command)

## Command: `bloktastic search`

### Beschreibung
Durchsucht die Registry nach Packages.

### Usage

```bash
bloktastic search hero
bloktastic search --type plugin color
bloktastic search --category sections
bloktastic search --tag faq
```

### Output

```
$ bloktastic search hero

Found 3 packages matching "hero":

  @bloktastic/hero (v1.0.0) · sections
  Full-width hero with headline, subline, CTA and background image
  Tags: hero, header, landing

  @bloktastic/hero-video (v1.2.0) · sections
  Hero section with video background
  Tags: hero, video, landing

  @bloktastic/hero-split (v0.9.0) · sections
  Split-screen hero with image on one side
  Tags: hero, split, landing

Run `bloktastic add <name>` to install.
```

### Implementation

```typescript
// /packages/cli/src/commands/search.ts
import { Command } from 'commander';
import chalk from 'chalk';
import { fetchRegistry } from '../lib/registry.js';
import { PackageEntry } from '../types/index.js';
import { info, error, spinner } from '../lib/utils.js';

export const searchCommand = new Command('search')
  .description('Search the registry')
  .argument('<query>', 'Search query')
  .option('-t, --type <type>', 'Filter by type (component, plugin, preset)')
  .option('-c, --category <category>', 'Filter by category')
  .option('--tag <tag>', 'Filter by tag')
  .action(async (query: string, options) => {
    const spin = spinner('Searching registry...');
    spin.start();

    try {
      const registry = await fetchRegistry();
      const queryLower = query.toLowerCase();

      // Gather all packages based on type filter
      let packages: PackageEntry[] = [];
      const type = options.type?.toLowerCase();

      if (!type || type === 'component') {
        packages.push(...registry.packages.components.map(p => ({ ...p, _type: 'component' })));
      }
      if (!type || type === 'plugin') {
        packages.push(...registry.packages.plugins.map(p => ({ ...p, _type: 'plugin' })));
      }
      if (!type || type === 'preset') {
        packages.push(...registry.packages.presets.map(p => ({ ...p, _type: 'preset' })));
      }

      // Filter by search query
      let results = packages.filter(p => {
        const nameMatch = p.name.toLowerCase().includes(queryLower);
        const titleMatch = p.title.toLowerCase().includes(queryLower);
        const tagMatch = p.tags?.some(t => t.toLowerCase().includes(queryLower));
        return nameMatch || titleMatch || tagMatch;
      });

      // Filter by category
      if (options.category) {
        results = results.filter(p => p.category === options.category);
      }

      // Filter by tag
      if (options.tag) {
        results = results.filter(p => p.tags?.includes(options.tag));
      }

      spin.stop();

      if (results.length === 0) {
        info(`No packages found matching "${query}"`);
        console.log(chalk.dim('\nTry a different search term or browse with `bloktastic list`'));
        return;
      }

      console.log(`\nFound ${chalk.cyan(results.length)} package${results.length > 1 ? 's' : ''} matching "${query}":\n`);

      for (const pkg of results) {
        // Package name and version
        console.log(`  ${chalk.cyan(pkg.name)} ${chalk.dim(`(v${pkg.version})`)} · ${chalk.yellow(pkg.category || 'uncategorized')}`);

        // Title/description - fetch from manifest would be ideal but we use title from registry
        console.log(chalk.dim(`  ${pkg.title}`));

        // Tags
        if (pkg.tags?.length) {
          console.log(chalk.dim(`  Tags: ${pkg.tags.join(', ')}`));
        }

        // Status warning
        if (pkg.status === 'unmaintained') {
          console.log(chalk.yellow('  ⚠ Unmaintained'));
        } else if (pkg.status === 'deprecated') {
          console.log(chalk.red('  ⚠ Deprecated'));
        }

        console.log('');
      }

      console.log(chalk.dim('Run `bloktastic add <name>` to install.'));

    } catch (e) {
      spin.fail();
      error(`Search failed: ${e instanceof Error ? e.message : 'Unknown error'}`);
      process.exit(1);
    }
  });
```

## Command: `bloktastic list`

### Beschreibung
Listet verfügbare Packages mit Filteroptionen.

### Usage

```bash
bloktastic list                    # Alle Packages
bloktastic list --type component   # Nur Components
bloktastic list --category sections
bloktastic list --installed        # Nur installierte
```

### Output

```
$ bloktastic list --type component

Components (15)

  sections
    @bloktastic/hero           v1.0.0   Hero Section
    @bloktastic/hero-video     v1.2.0   Hero with Video Background
    @bloktastic/cta-banner     v1.0.0   Call-to-Action Banner

  content
    @bloktastic/accordion      v1.0.0   Expandable Accordion
    @bloktastic/teaser         v1.1.0   Card-style Teaser
    @bloktastic/testimonial    v1.0.0   Quote with Author

  media
    @bloktastic/image          v1.0.0   Responsive Image

Run `bloktastic info <name>` for details.
```

### Implementation

```typescript
// /packages/cli/src/commands/list.ts
import { Command } from 'commander';
import chalk from 'chalk';
import { fetchRegistry } from '../lib/registry.js';
import { loadConfig } from '../lib/config.js';
import { PackageEntry } from '../types/index.js';
import { error, spinner } from '../lib/utils.js';

export const listCommand = new Command('list')
  .description('List available packages')
  .option('-t, --type <type>', 'Filter by type (component, plugin, preset)')
  .option('-c, --category <category>', 'Filter by category')
  .option('--installed', 'Show only installed packages')
  .action(async (options) => {
    const spin = spinner('Fetching registry...');
    spin.start();

    try {
      const registry = await fetchRegistry();
      const config = options.installed ? await loadConfig() : null;
      const installedNames = new Set(config?.installedPackages?.map(p => p.name) || []);

      spin.stop();

      const type = options.type?.toLowerCase();

      // Helper to display a package list
      const displayPackages = (
        packages: PackageEntry[],
        typeName: string,
        typeColor: (s: string) => string
      ) => {
        if (packages.length === 0) return;

        // Filter by installed if needed
        let filtered = options.installed
          ? packages.filter(p => installedNames.has(p.name))
          : packages;

        // Filter by category
        if (options.category) {
          filtered = filtered.filter(p => p.category === options.category);
        }

        if (filtered.length === 0) return;

        console.log(`\n${typeColor(typeName)} (${filtered.length})\n`);

        // Group by category
        const byCategory: Record<string, PackageEntry[]> = {};
        for (const pkg of filtered) {
          const cat = pkg.category || 'uncategorized';
          if (!byCategory[cat]) byCategory[cat] = [];
          byCategory[cat].push(pkg);
        }

        // Sort categories
        const categories = Object.keys(byCategory).sort();

        for (const category of categories) {
          console.log(chalk.dim(`  ${category}`));

          for (const pkg of byCategory[category]) {
            const installed = installedNames.has(pkg.name) ? chalk.green(' ✓') : '';
            const status = pkg.status === 'deprecated' ? chalk.red(' [deprecated]')
              : pkg.status === 'unmaintained' ? chalk.yellow(' [unmaintained]')
              : '';

            // Format: name (padded) version title
            const name = pkg.name.padEnd(30);
            const version = `v${pkg.version}`.padEnd(8);

            console.log(`    ${chalk.cyan(name)} ${chalk.dim(version)} ${pkg.title}${installed}${status}`);
          }
          console.log('');
        }
      };

      // Display based on type filter
      if (!type || type === 'component') {
        displayPackages(registry.packages.components, 'Components', chalk.cyan);
      }
      if (!type || type === 'plugin') {
        displayPackages(registry.packages.plugins, 'Plugins', chalk.magenta);
      }
      if (!type || type === 'preset') {
        displayPackages(registry.packages.presets, 'Presets', chalk.yellow);
      }

      console.log(chalk.dim('Run `bloktastic info <name>` for details.'));

    } catch (e) {
      spin.fail();
      error(`Failed to fetch registry: ${e instanceof Error ? e.message : 'Unknown error'}`);
      process.exit(1);
    }
  });
```

## Command: `bloktastic info`

### Beschreibung
Zeigt detaillierte Informationen zu einem Package.

### Usage

```bash
bloktastic info @bloktastic/hero
```

### Output

```
$ bloktastic info @bloktastic/hero

@bloktastic/hero v1.0.0

  Full-width hero with headline, subline, CTA and background image

  Author:       Benedikt Müller (@bmueller)
  Category:     sections
  Tags:         hero, header, landing, marketing
  Frameworks:   vue, nuxt, react, nextjs, astro
  Status:       stable
  Created:      2026-01-28
  Updated:      2026-01-28

  Dependencies:
    • @bloktastic/button
    • @bloktastic/image

  Files:
    • schema.json
    • prompt.md
    • README.md

  Install:
    bloktastic add @bloktastic/hero
```

### Implementation

```typescript
// /packages/cli/src/commands/info.ts
import { Command } from 'commander';
import chalk from 'chalk';
import { findPackage, fetchPackageManifest } from '../lib/registry.js';
import { loadConfig } from '../lib/config.js';
import { error, spinner, parsePackageName } from '../lib/utils.js';

export const infoCommand = new Command('info')
  .description('Show package details')
  .argument('<package>', 'Package name (e.g. @bloktastic/hero)')
  .action(async (packageName: string) => {
    // Validate format
    if (!packageName.startsWith('@')) {
      error('Package name must include namespace (e.g. @bloktastic/hero)');
      process.exit(1);
    }

    const spin = spinner('Fetching package info...');
    spin.start();

    try {
      const packageEntry = await findPackage(packageName);

      if (!packageEntry) {
        spin.fail();
        error(`Package not found: ${packageName}`);
        process.exit(1);
      }

      const manifest = await fetchPackageManifest(packageEntry.path);
      const config = await loadConfig();
      const installed = config?.installedPackages?.find(p => p.name === packageName);

      spin.stop();

      // Header
      console.log(`\n${chalk.cyan(manifest.name)} ${chalk.dim(`v${manifest.version}`)}`);

      if (installed) {
        console.log(chalk.green(`  ✓ Installed (${installed.installedAt.split('T')[0]})`));
      }

      console.log(`\n  ${manifest.description}\n`);

      // Details
      const details = [
        ['Author', `${manifest.author.name} (@${manifest.author.github})`],
        ['Category', manifest.category || 'uncategorized'],
        ['Tags', manifest.tags?.join(', ') || 'none'],
        ['Frameworks', manifest.compatibility?.frameworks?.join(', ') || 'agnostic'],
        ['Status', manifest.metadata?.status || 'stable'],
        ['Storyblok', manifest.compatibility?.storyblok || 'any'],
      ];

      if (manifest.metadata?.created) {
        details.push(['Created', manifest.metadata.created]);
      }
      if (manifest.metadata?.updated) {
        details.push(['Updated', manifest.metadata.updated]);
      }

      const maxLabelLength = Math.max(...details.map(d => d[0].length));

      for (const [label, value] of details) {
        const paddedLabel = label.padEnd(maxLabelLength + 2);
        console.log(`  ${chalk.dim(paddedLabel)}${value}`);
      }

      // Dependencies
      if (manifest.dependencies?.bloktastic?.length) {
        console.log(`\n  ${chalk.dim('Dependencies:')}`);
        for (const dep of manifest.dependencies.bloktastic) {
          console.log(`    • ${chalk.cyan(dep)}`);
        }
      }

      // Files
      if (manifest.files) {
        console.log(`\n  ${chalk.dim('Files:')}`);
        if (manifest.files.schema) console.log(`    • ${manifest.files.schema}`);
        if (manifest.files.prompt) console.log(`    • ${manifest.files.prompt}`);
        if (manifest.files.readme) console.log(`    • ${manifest.files.readme}`);
      }

      // Included components (for presets)
      if (manifest.includes?.length) {
        console.log(`\n  ${chalk.dim('Includes:')}`);
        for (const inc of manifest.includes) {
          console.log(`    • ${chalk.cyan(inc)}`);
        }
      }

      // Install command
      console.log(`\n  ${chalk.dim('Install:')}`);
      console.log(`    ${chalk.cyan(`bloktastic add ${manifest.name}`)}`);

      console.log('');

    } catch (e) {
      spin.fail();
      error(`Failed to fetch package info: ${e instanceof Error ? e.message : 'Unknown error'}`);
      process.exit(1);
    }
  });
```

## Acceptance Criteria

### `bloktastic search`
- [ ] Sucht in name, title, tags
- [ ] `--type` filtert nach Typ
- [ ] `--category` filtert nach Kategorie
- [ ] `--tag` filtert nach Tag
- [ ] Zeigt Status-Warnings (deprecated, unmaintained)
- [ ] Zeigt hilfreiche Meldung wenn keine Ergebnisse

### `bloktastic list`
- [ ] Listet alle Packages gruppiert nach Typ
- [ ] `--type` zeigt nur bestimmten Typ
- [ ] `--category` filtert nach Kategorie
- [ ] `--installed` zeigt nur installierte
- [ ] Gruppiert nach Kategorie
- [ ] Zeigt ✓ bei installierten Packages

### `bloktastic info`
- [ ] Zeigt alle Package-Details
- [ ] Zeigt Dependencies
- [ ] Zeigt Installed-Status
- [ ] Zeigt Install-Command
- [ ] Für Presets: zeigt included Components

## Test Commands

```bash
# Search
bloktastic search hero
bloktastic search --type component hero
bloktastic search --category sections

# List
bloktastic list
bloktastic list --type component
bloktastic list --installed

# Info
bloktastic info @bloktastic/hero
```

## Nächster Task
→ Task 8: Starter Components erstellen
