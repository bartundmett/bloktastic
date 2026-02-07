# Task 6: CLI add Command mit Storyblok API

## Ziel
Implementiere den `bloktastic add` Command, der Packages aus der Registry lädt und in Storyblok pusht.

## Voraussetzungen
- Task 5 abgeschlossen (create Command)
- Storyblok OAuth Token verfügbar (STORYBLOK_OAUTH_TOKEN)

## Command: `bloktastic add`

### Beschreibung
Lädt ein Package aus der Registry, pusht das Schema zu Storyblok, und kopiert den Prompt.

### Usage

```bash
# Component installieren
bloktastic add @bloktastic/hero

# Nur Prompt anzeigen (kein Storyblok Push)
bloktastic add @bloktastic/hero --prompt-only

# Schema nicht pushen
bloktastic add @bloktastic/hero --skip-schema

# Existierenden Component überschreiben
bloktastic add @bloktastic/hero --force

# Preset installieren (mehrere Components)
bloktastic add @bloktastic/blog-starter
```

### Flow

```
$ bloktastic add @bloktastic/hero

Installing @bloktastic/hero...

  ↓ Fetching package from registry...
  ✓ Found @bloktastic/hero v1.0.0

Checking dependencies:
  ✓ @bloktastic/button (not installed, will install)
  ⚠ @bloktastic/image (already exists in Space)
    → Skipping installation (existing component preserved)

Installing @bloktastic/button...
  ↓ Pushing schema to Storyblok...
  ✓ Component "button" created in Space 123456

Installing @bloktastic/hero...
  ↓ Pushing schema to Storyblok...
  ✓ Component "hero" created in Space 123456

? Copy prompt to clipboard? (Y/n) y
✓ Prompt copied to clipboard!

Tip: Paste the prompt into Claude, ChatGPT, or Cursor with your project context.

✓ Installation complete!
```

### Implementation

```typescript
// /packages/cli/src/lib/storyblok.ts
import StoryblokClient from 'storyblok-js-client';

let client: StoryblokClient | null = null;

export function getStoryblokClient(): StoryblokClient {
  if (client) return client;

  const token = process.env.STORYBLOK_OAUTH_TOKEN;

  if (!token) {
    throw new Error(
      'STORYBLOK_OAUTH_TOKEN not found. Generate one at https://app.storyblok.com/#/me/account?tab=token'
    );
  }

  client = new StoryblokClient({
    oauthToken: token,
  });

  return client;
}

export interface StoryblokComponent {
  id: number;
  name: string;
  display_name: string;
  schema: Record<string, unknown>;
}

export async function getComponents(spaceId: string): Promise<StoryblokComponent[]> {
  const client = getStoryblokClient();

  const response = await client.get(`spaces/${spaceId}/components`, {});

  return response.data.components || [];
}

export async function componentExists(spaceId: string, componentName: string): Promise<boolean> {
  const components = await getComponents(spaceId);
  return components.some(c => c.name === componentName);
}

export async function getComponent(
  spaceId: string,
  componentName: string
): Promise<StoryblokComponent | null> {
  const components = await getComponents(spaceId);
  return components.find(c => c.name === componentName) || null;
}

export async function createComponent(
  spaceId: string,
  schema: Record<string, unknown>
): Promise<StoryblokComponent> {
  const client = getStoryblokClient();

  // Remove $bloktastic metadata before pushing
  const cleanSchema = { ...schema };
  delete cleanSchema.$bloktastic;

  const response = await client.post(`spaces/${spaceId}/components`, {
    component: cleanSchema,
  });

  return response.data.component;
}

export async function updateComponent(
  spaceId: string,
  componentId: number,
  schema: Record<string, unknown>
): Promise<StoryblokComponent> {
  const client = getStoryblokClient();

  // Remove $bloktastic metadata before pushing
  const cleanSchema = { ...schema };
  delete cleanSchema.$bloktastic;

  const response = await client.put(`spaces/${spaceId}/components/${componentId}`, {
    component: cleanSchema,
  });

  return response.data.component;
}

export async function pushComponent(
  spaceId: string,
  schema: Record<string, unknown>,
  force: boolean = false
): Promise<{ created: boolean; updated: boolean; skipped: boolean }> {
  const componentName = schema.name as string;
  const existing = await getComponent(spaceId, componentName);

  if (existing) {
    if (force) {
      await updateComponent(spaceId, existing.id, schema);
      return { created: false, updated: true, skipped: false };
    } else {
      return { created: false, updated: false, skipped: true };
    }
  }

  await createComponent(spaceId, schema);
  return { created: true, updated: false, skipped: false };
}
```

```typescript
// /packages/cli/src/commands/add.ts
import { Command } from 'commander';
import chalk from 'chalk';
import prompts from 'prompts';
import clipboard from 'clipboardy';
import { loadConfig, addInstalledPackage } from '../lib/config.js';
import {
  findPackage,
  fetchPackageManifest,
  fetchPackageSchema,
  fetchPackagePrompt,
} from '../lib/registry.js';
import { pushComponent, componentExists } from '../lib/storyblok.js';
import { success, error, warning, info, spinner, parsePackageName } from '../lib/utils.js';
import { PackageManifest } from '../types/index.js';

interface InstallOptions {
  promptOnly: boolean;
  skipSchema: boolean;
  force: boolean;
}

async function installPackage(
  packageName: string,
  spaceId: string,
  options: InstallOptions,
  installedInSession: Set<string>
): Promise<boolean> {
  // Prevent circular dependencies
  if (installedInSession.has(packageName)) {
    return true;
  }

  const spin = spinner(`Fetching ${packageName} from registry...`);
  spin.start();

  // Find package in registry
  const packageEntry = await findPackage(packageName);

  if (!packageEntry) {
    spin.fail();
    error(`Package not found: ${packageName}`);
    return false;
  }

  // Fetch manifest
  const manifest = await fetchPackageManifest(packageEntry.path);
  spin.succeed(`Found ${packageName} v${manifest.version}`);

  // Handle dependencies first
  if (manifest.dependencies?.bloktastic?.length) {
    console.log('\nChecking dependencies:');

    for (const dep of manifest.dependencies.bloktastic) {
      // Check if already exists in Storyblok
      const depParsed = parsePackageName(dep);
      if (!depParsed) continue;

      const exists = await componentExists(spaceId, depParsed.packageName);

      if (exists) {
        warning(`${dep} (already exists in Space)`);
        console.log(chalk.dim('    → Skipping installation (existing component preserved)'));
      } else if (installedInSession.has(dep)) {
        success(`${dep} (installed this session)`);
      } else {
        info(`${dep} (will install)`);

        // Recursively install dependency
        const depResult = await installPackage(dep, spaceId, options, installedInSession);
        if (!depResult) {
          error(`Failed to install dependency: ${dep}`);
          return false;
        }
      }
    }
    console.log('');
  }

  installedInSession.add(packageName);

  // Handle based on package type
  if (manifest.type === 'component') {
    return await installComponent(manifest, packageEntry.path, spaceId, options);
  } else if (manifest.type === 'preset') {
    return await installPreset(manifest, spaceId, options, installedInSession);
  }

  return true;
}

async function installComponent(
  manifest: PackageManifest,
  packagePath: string,
  spaceId: string,
  options: InstallOptions
): Promise<boolean> {
  const parsed = parsePackageName(manifest.name);
  if (!parsed) return false;

  console.log(`Installing ${chalk.cyan(manifest.name)}...`);

  // Push schema to Storyblok (unless skipped)
  if (!options.promptOnly && !options.skipSchema) {
    const spin = spinner('Pushing schema to Storyblok...');
    spin.start();

    try {
      const schema = await fetchPackageSchema(packagePath);
      const result = await pushComponent(spaceId, schema, options.force);

      if (result.created) {
        spin.succeed(`Component "${parsed.packageName}" created in Space ${spaceId}`);
      } else if (result.updated) {
        spin.succeed(`Component "${parsed.packageName}" updated in Space ${spaceId}`);
      } else if (result.skipped) {
        spin.warn(`Component "${parsed.packageName}" already exists (use --force to overwrite)`);
      }
    } catch (e) {
      spin.fail();
      error(`Failed to push schema: ${e instanceof Error ? e.message : 'Unknown error'}`);
      return false;
    }
  }

  // Handle prompt
  try {
    const promptContent = await fetchPackagePrompt(packagePath);

    // Determine output method from config or options
    const config = await loadConfig();
    const outputMethod = config?.preferences?.promptOutput || 'clipboard';

    if (options.promptOnly) {
      // Just output the prompt
      console.log('\n' + chalk.dim('─'.repeat(60)));
      console.log(promptContent);
      console.log(chalk.dim('─'.repeat(60)) + '\n');
    } else {
      // Ask about clipboard
      const { copyPrompt } = await prompts({
        type: 'confirm',
        name: 'copyPrompt',
        message: 'Copy prompt to clipboard?',
        initial: true,
      });

      if (copyPrompt) {
        await clipboard.write(promptContent);
        success('Prompt copied to clipboard!');
        console.log(chalk.dim('\nTip: Paste the prompt into Claude, ChatGPT, or Cursor with your project context.'));
      }
    }
  } catch (e) {
    warning('Could not fetch prompt');
  }

  // Track installation
  await addInstalledPackage({
    name: manifest.name,
    version: manifest.version,
    installedAt: new Date().toISOString(),
  });

  return true;
}

async function installPreset(
  manifest: PackageManifest,
  spaceId: string,
  options: InstallOptions,
  installedInSession: Set<string>
): Promise<boolean> {
  if (!manifest.includes?.length) {
    warning('Preset has no included components');
    return true;
  }

  console.log(`Installing preset ${chalk.cyan(manifest.name)} (${manifest.includes.length} components)...\n`);

  for (const componentName of manifest.includes) {
    const result = await installPackage(componentName, spaceId, options, installedInSession);
    if (!result) {
      error(`Failed to install ${componentName} from preset`);
      return false;
    }
  }

  return true;
}

export const addCommand = new Command('add')
  .description('Add a package to your Storyblok space')
  .argument('<package>', 'Package name (e.g. @bloktastic/hero)')
  .option('--prompt-only', 'Only show the prompt, do not push schema')
  .option('--skip-schema', 'Skip pushing schema to Storyblok')
  .option('--force', 'Overwrite existing components')
  .action(async (packageName: string, options) => {
    // Validate package name format
    if (!packageName.startsWith('@')) {
      error('Package name must include namespace (e.g. @bloktastic/hero)');
      process.exit(1);
    }

    // Load config
    const config = await loadConfig();

    if (!config?.space?.id) {
      error('No Storyblok space configured. Run `bloktastic init` first.');
      process.exit(1);
    }

    const spaceId = config.space.id;

    console.log(`\nInstalling ${chalk.cyan(packageName)}...\n`);

    const installedInSession = new Set<string>();

    try {
      const result = await installPackage(
        packageName,
        spaceId,
        {
          promptOnly: options.promptOnly || false,
          skipSchema: options.skipSchema || false,
          force: options.force || false,
        },
        installedInSession
      );

      if (result) {
        console.log('');
        success('Installation complete!');
      } else {
        process.exit(1);
      }
    } catch (e) {
      error(`Installation failed: ${e instanceof Error ? e.message : 'Unknown error'}`);
      process.exit(1);
    }
  });
```

## Environment Variable

Der Command benötigt `STORYBLOK_OAUTH_TOKEN`:

```bash
export STORYBLOK_OAUTH_TOKEN="your-token-here"
```

## Acceptance Criteria

- [ ] Lädt Package von Registry (GitHub Raw)
- [ ] Pusht Schema zu Storyblok via Management API
- [ ] Handhabt Dependencies rekursiv
- [ ] Überspringt existierende Components (mit Warning)
- [ ] `--force` überschreibt existierende Components
- [ ] `--prompt-only` zeigt nur Prompt an
- [ ] `--skip-schema` pusht kein Schema
- [ ] Kopiert Prompt in Clipboard
- [ ] Trackt installierte Packages in Config
- [ ] Presets installieren alle enthaltenen Components
- [ ] Fehler wenn kein Space konfiguriert
- [ ] Fehler wenn Token fehlt

## Test Commands

```bash
# Voraussetzung: Config existiert
bloktastic init

# Token setzen
export STORYBLOK_OAUTH_TOKEN="your-token"

# Component installieren (wenn Registry online)
bloktastic add @bloktastic/hero

# Nur Prompt anzeigen
bloktastic add @bloktastic/hero --prompt-only
```

## Nächster Task
→ Task 7: CLI search, list, info Commands
