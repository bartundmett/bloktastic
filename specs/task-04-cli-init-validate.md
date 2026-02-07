# Task 4: CLI init & validate Commands

## Ziel
Implementiere die `bloktastic init` und `bloktastic validate` Commands vollständig.

## Voraussetzungen
- Task 3 abgeschlossen (CLI Grundgerüst)

## Command: `bloktastic init`

### Beschreibung
Initialisiert Bloktastic in einem Projekt durch Erstellen einer `bloktastic.config.json`.

### Interaktiver Flow

```
$ bloktastic init

  ____  _       _    _            _   _
 | __ )| | ___ | | _| |_ __ _ ___| |_(_) ___
 |  _ \| |/ _ \| |/ / __/ _` / __| __| |/ __|
 | |_) | | (_) |   <| || (_| \__ \ |_| | (__
 |____/|_|\___/|_|\_\\__\__,_|___/\__|_|\___|

Welcome to Bloktastic! Let's set up your project.

? Storyblok Space ID: 123456
? Region: (Use arrow keys)
  ❯ EU (eu.storyblok.com)
    US (us.storyblok.com)
    Canada (ca.storyblok.com)
    Asia-Pacific (ap.storyblok.com)
? Default Framework: (Use arrow keys)
  ❯ Vue
    Nuxt
    React
    Next.js
    Astro
    Svelte
? Prompt output preference: (Use arrow keys)
  ❯ Copy to clipboard
    Save to file
    Print to stdout

✓ Created bloktastic.config.json

Next steps:
  1. Set STORYBLOK_OAUTH_TOKEN in your environment
  2. Run `bloktastic add @bloktastic/hero` to install your first component
```

### Implementation

```typescript
// /packages/cli/src/commands/init.ts
import { Command } from 'commander';
import prompts from 'prompts';
import chalk from 'chalk';
import fs from 'fs/promises';
import path from 'path';
import { BloktasticConfig } from '../types/index.js';
import { configExists, saveConfig } from '../lib/config.js';
import { success, error, warning, info } from '../lib/utils.js';

const LOGO = `
  ____  _       _    _            _   _
 | __ )| | ___ | | _| |_ __ _ ___| |_(_) ___
 |  _ \\| |/ _ \\| |/ / __/ _\` / __| __| |/ __|
 | |_) | | (_) |   <| || (_| \\__ \\ |_| | (__
 |____/|_|\\___/|_|\\_\\\\__\\__,_|___/\\__|_|\\___|
`;

const REGIONS = [
  { title: 'EU (eu.storyblok.com)', value: 'eu' },
  { title: 'US (us.storyblok.com)', value: 'us' },
  { title: 'Canada (ca.storyblok.com)', value: 'ca' },
  { title: 'Asia-Pacific (ap.storyblok.com)', value: 'ap' },
];

const FRAMEWORKS = [
  { title: 'Vue', value: 'vue' },
  { title: 'Nuxt', value: 'nuxt' },
  { title: 'React', value: 'react' },
  { title: 'Next.js', value: 'nextjs' },
  { title: 'Astro', value: 'astro' },
  { title: 'Svelte', value: 'svelte' },
];

const PROMPT_OUTPUTS = [
  { title: 'Copy to clipboard', value: 'clipboard' },
  { title: 'Save to file', value: 'file' },
  { title: 'Print to stdout', value: 'stdout' },
];

export const initCommand = new Command('init')
  .description('Initialize Bloktastic in your project')
  .option('-y, --yes', 'Skip prompts and use defaults')
  .option('--space <id>', 'Storyblok Space ID')
  .option('--region <region>', 'Storyblok region (eu, us, ca, ap)')
  .action(async (options) => {
    console.log(chalk.cyan(LOGO));
    console.log(chalk.white('Welcome to Bloktastic! Let\'s set up your project.\n'));

    // Check if config already exists
    if (await configExists()) {
      const { overwrite } = await prompts({
        type: 'confirm',
        name: 'overwrite',
        message: 'bloktastic.config.json already exists. Overwrite?',
        initial: false,
      });

      if (!overwrite) {
        info('Initialization cancelled.');
        return;
      }
    }

    let config: BloktasticConfig;

    if (options.yes) {
      // Use defaults or provided options
      config = {
        $schema: 'https://bloktastic.dev/schema/config.schema.json',
        space: {
          id: options.space || '',
          region: options.region || 'eu',
        },
        preferences: {
          defaultFramework: 'vue',
          outputDirectory: './components/storyblok',
          promptOutput: 'clipboard',
        },
        installedPackages: [],
      };

      if (!config.space?.id) {
        error('Space ID is required. Use --space <id> or run without -y for interactive mode.');
        process.exit(1);
      }
    } else {
      // Interactive mode
      const answers = await prompts([
        {
          type: 'text',
          name: 'spaceId',
          message: 'Storyblok Space ID:',
          validate: (value) => /^\d+$/.test(value) ? true : 'Space ID must be numeric',
        },
        {
          type: 'select',
          name: 'region',
          message: 'Region:',
          choices: REGIONS,
          initial: 0,
        },
        {
          type: 'select',
          name: 'framework',
          message: 'Default Framework:',
          choices: FRAMEWORKS,
          initial: 0,
        },
        {
          type: 'select',
          name: 'promptOutput',
          message: 'Prompt output preference:',
          choices: PROMPT_OUTPUTS,
          initial: 0,
        },
      ], {
        onCancel: () => {
          error('Initialization cancelled.');
          process.exit(1);
        },
      });

      config = {
        $schema: 'https://bloktastic.dev/schema/config.schema.json',
        space: {
          id: answers.spaceId,
          region: answers.region,
        },
        preferences: {
          defaultFramework: answers.framework,
          outputDirectory: './components/storyblok',
          promptOutput: answers.promptOutput,
        },
        installedPackages: [],
      };
    }

    // Save config
    await saveConfig(config);
    success('Created bloktastic.config.json');

    // Check for OAuth token
    if (!process.env.STORYBLOK_OAUTH_TOKEN) {
      console.log('');
      warning('STORYBLOK_OAUTH_TOKEN not found in environment.');
      info('You\'ll need this to push components to Storyblok.');
      console.log(chalk.dim('  Generate a token at: https://app.storyblok.com/#/me/account?tab=token'));
    }

    console.log('');
    console.log(chalk.white('Next steps:'));
    console.log(chalk.dim('  1. Set STORYBLOK_OAUTH_TOKEN in your environment'));
    console.log(chalk.dim('  2. Run `bloktastic add @bloktastic/hero` to install your first component'));
  });
```

## Command: `bloktastic validate`

### Beschreibung
Validiert ein Package-Verzeichnis gegen die Bloktastic Schemas.

### Usage

```
$ bloktastic validate registry/components/hero

Validating @bloktastic/hero...

  ✓ bloktastic.json valid
  ✓ schema.json valid (Storyblok format)
  ✓ prompt.md exists (2.4kb)
    ✓ Contains required section: Purpose
    ✓ Contains required section: Storyblok Schema Fields
    ✓ Contains required section: Visual Requirements
    ✓ Contains required section: Accessibility
  ✓ README.md exists (1.8kb)
  ✓ Dependencies available: @bloktastic/button

Package is valid and ready for submission! ✓
```

### Implementation

```typescript
// /packages/cli/src/commands/validate.ts
import { Command } from 'commander';
import fs from 'fs/promises';
import path from 'path';
import chalk from 'chalk';
import { validatePackageManifest } from '../lib/validator.js';
import { PackageManifest } from '../types/index.js';
import { success, error, warning, info, log } from '../lib/utils.js';

const REQUIRED_PROMPT_SECTIONS = [
  '## Purpose',
  '## Storyblok Schema Fields',
  '## Visual Requirements',
  '## Accessibility',
];

export const validateCommand = new Command('validate')
  .description('Validate a Bloktastic package')
  .argument('<path>', 'Path to package directory')
  .option('--quiet', 'Only output errors')
  .action(async (packagePath: string, options) => {
    const absolutePath = path.resolve(process.cwd(), packagePath);
    let hasErrors = false;
    let manifest: PackageManifest | null = null;

    // Helper for conditional logging
    const logIfNotQuiet = (msg: string) => {
      if (!options.quiet) console.log(msg);
    };

    try {
      // Check directory exists
      const stat = await fs.stat(absolutePath);
      if (!stat.isDirectory()) {
        error(`${packagePath} is not a directory`);
        process.exit(1);
      }

      // Load and validate bloktastic.json
      const manifestPath = path.join(absolutePath, 'bloktastic.json');
      let manifestContent: string;

      try {
        manifestContent = await fs.readFile(manifestPath, 'utf-8');
      } catch {
        error('bloktastic.json not found');
        process.exit(1);
      }

      try {
        manifest = JSON.parse(manifestContent) as PackageManifest;
      } catch (e) {
        error('bloktastic.json is not valid JSON');
        process.exit(1);
      }

      logIfNotQuiet(`\nValidating ${chalk.cyan(manifest.name)}...\n`);

      // Validate against schema
      const validation = await validatePackageManifest(manifest);

      if (validation.valid) {
        logIfNotQuiet(`  ${chalk.green('✓')} bloktastic.json valid`);
      } else {
        error('bloktastic.json validation failed:');
        validation.errors.forEach(e => console.log(chalk.red(`    - ${e}`)));
        hasErrors = true;
      }

      // For components, check schema.json
      if (manifest.type === 'component') {
        const schemaPath = path.join(absolutePath, manifest.files?.schema || 'schema.json');

        try {
          const schemaContent = await fs.readFile(schemaPath, 'utf-8');
          const schema = JSON.parse(schemaContent);

          // Basic Storyblok schema checks
          if (schema.name && schema.schema && typeof schema.schema === 'object') {
            logIfNotQuiet(`  ${chalk.green('✓')} schema.json valid (Storyblok format)`);
          } else {
            error('schema.json missing required Storyblok fields (name, schema)');
            hasErrors = true;
          }
        } catch (e) {
          error(`schema.json not found or invalid JSON`);
          hasErrors = true;
        }

        // Check prompt.md
        const promptPath = path.join(absolutePath, manifest.files?.prompt || 'prompt.md');

        try {
          const promptContent = await fs.readFile(promptPath, 'utf-8');
          const promptSize = (promptContent.length / 1024).toFixed(1);
          logIfNotQuiet(`  ${chalk.green('✓')} prompt.md exists (${promptSize}kb)`);

          // Check required sections
          for (const section of REQUIRED_PROMPT_SECTIONS) {
            if (promptContent.includes(section)) {
              logIfNotQuiet(`    ${chalk.green('✓')} Contains required section: ${section.replace('## ', '')}`);
            } else {
              warning(`    Missing recommended section: ${section}`);
            }
          }
        } catch {
          error('prompt.md not found');
          hasErrors = true;
        }
      }

      // Check README.md
      const readmePath = path.join(absolutePath, manifest.files?.readme || 'README.md');

      try {
        const readmeContent = await fs.readFile(readmePath, 'utf-8');
        const readmeSize = (readmeContent.length / 1024).toFixed(1);
        logIfNotQuiet(`  ${chalk.green('✓')} README.md exists (${readmeSize}kb)`);
      } catch {
        warning('README.md not found (recommended)');
      }

      // Check dependencies (basic check - just log them)
      if (manifest.dependencies?.bloktastic?.length) {
        logIfNotQuiet(`  ${chalk.green('✓')} Dependencies declared: ${manifest.dependencies.bloktastic.join(', ')}`);
      }

      // Final result
      console.log('');
      if (hasErrors) {
        error('Package has validation errors. Please fix them before submitting.');
        process.exit(1);
      } else {
        success('Package is valid and ready for submission!');
      }

    } catch (e) {
      error(`Validation failed: ${e instanceof Error ? e.message : 'Unknown error'}`);
      process.exit(1);
    }
  });
```

## Acceptance Criteria

### `bloktastic init`
- [ ] Zeigt ASCII Logo
- [ ] Fragt interaktiv nach Space ID, Region, Framework, Prompt Output
- [ ] Erstellt valide `bloktastic.config.json`
- [ ] Warnt wenn Token fehlt
- [ ] `-y` Flag für non-interactive Mode
- [ ] Fragt bei existierender Config ob überschrieben werden soll

### `bloktastic validate`
- [ ] Validiert `bloktastic.json` gegen Schema
- [ ] Prüft ob `schema.json` valides Storyblok-Format hat
- [ ] Prüft ob `prompt.md` required sections enthält
- [ ] Prüft ob `README.md` existiert
- [ ] Listet Dependencies auf
- [ ] Exit Code 1 bei Fehlern
- [ ] `--quiet` Flag für nur Fehler

## Test Commands

```bash
# Init testen
cd /tmp/test-project
bloktastic init

# Validate testen (benötigt echtes Package)
bloktastic validate registry/components/hero
```

## Nächster Task
→ Task 5: CLI create Command
