# Task 3: CLI Package Setup (Grundgerüst)

## Ziel
Erstelle das CLI-Grundgerüst mit Commander.js, Projektstruktur und grundlegenden Utilities.

## Voraussetzungen
- Task 1 abgeschlossen (Repository-Struktur)
- Task 2 abgeschlossen (JSON Schemas)

## Technische Details

### Dependencies
```json
{
  "dependencies": {
    "commander": "^12.0.0",
    "chalk": "^5.3.0",
    "ora": "^8.0.0",
    "prompts": "^2.4.2",
    "ajv": "^8.12.0",
    "ajv-formats": "^2.1.1",
    "clipboardy": "^4.0.0",
    "storyblok-js-client": "^6.0.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/prompts": "^2.4.0",
    "typescript": "^5.3.0",
    "tsup": "^8.0.0"
  }
}
```

### CLI-Struktur

```
packages/cli/
├── src/
│   ├── index.ts              # Entry point, Commander setup
│   ├── commands/
│   │   ├── init.ts           # bloktastic init
│   │   ├── add.ts            # bloktastic add <package>
│   │   ├── validate.ts       # bloktastic validate <path>
│   │   ├── create.ts         # bloktastic create <type> <name>
│   │   ├── search.ts         # bloktastic search <query>
│   │   ├── list.ts           # bloktastic list
│   │   └── info.ts           # bloktastic info <package>
│   ├── lib/
│   │   ├── config.ts         # Config file handling
│   │   ├── registry.ts       # Registry API client
│   │   ├── storyblok.ts      # Storyblok API wrapper
│   │   ├── validator.ts      # JSON Schema validation
│   │   └── utils.ts          # Shared utilities
│   └── types/
│       └── index.ts          # TypeScript types
├── package.json
├── tsconfig.json
└── tsup.config.ts
```

## Zu erstellende Dateien

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
  "files": [
    "dist"
  ],
  "scripts": {
    "build": "tsup",
    "dev": "tsup --watch",
    "lint": "tsc --noEmit",
    "prepublishOnly": "pnpm build"
  },
  "dependencies": {
    "commander": "^12.0.0",
    "chalk": "^5.3.0",
    "ora": "^8.0.0",
    "prompts": "^2.4.2",
    "ajv": "^8.12.0",
    "ajv-formats": "^2.1.1",
    "clipboardy": "^4.0.0",
    "storyblok-js-client": "^6.0.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/prompts": "^2.4.9",
    "typescript": "^5.3.0",
    "tsup": "^8.0.0"
  },
  "engines": {
    "node": ">=20.0.0"
  },
  "keywords": [
    "storyblok",
    "cli",
    "components",
    "registry"
  ],
  "repository": {
    "type": "git",
    "url": "https://github.com/bloktastic/bloktastic"
  },
  "license": "MIT"
}
```

### `/packages/cli/tsconfig.json`
```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"]
}
```

### `/packages/cli/tsup.config.ts`
```typescript
import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  dts: true,
  clean: true,
  shims: true,
  banner: {
    js: '#!/usr/bin/env node',
  },
});
```

### `/packages/cli/src/index.ts`
```typescript
import { Command } from 'commander';
import chalk from 'chalk';
import { initCommand } from './commands/init.js';
import { addCommand } from './commands/add.js';
import { validateCommand } from './commands/validate.js';
import { createCommand } from './commands/create.js';
import { searchCommand } from './commands/search.js';
import { listCommand } from './commands/list.js';
import { infoCommand } from './commands/info.js';

const program = new Command();

program
  .name('bloktastic')
  .description('CLI for Bloktastic - Storyblok Component Registry')
  .version('0.1.0');

// Register commands
program.addCommand(initCommand);
program.addCommand(addCommand);
program.addCommand(validateCommand);
program.addCommand(createCommand);
program.addCommand(searchCommand);
program.addCommand(listCommand);
program.addCommand(infoCommand);

// Error handling
program.exitOverride();

try {
  await program.parseAsync(process.argv);
} catch (error) {
  if (error instanceof Error && error.message !== 'commander.help') {
    console.error(chalk.red('Error:'), error.message);
    process.exit(1);
  }
}
```

### `/packages/cli/src/types/index.ts`
```typescript
export interface BloktasticConfig {
  $schema?: string;
  space?: {
    id: string;
    region: 'eu' | 'us' | 'ca' | 'ap';
  };
  preferences?: {
    defaultFramework?: string;
    outputDirectory?: string;
    promptOutput?: 'clipboard' | 'file' | 'stdout';
  };
  installedPackages?: InstalledPackage[];
}

export interface InstalledPackage {
  name: string;
  version: string;
  installedAt: string;
}

export interface PackageManifest {
  $schema?: string;
  name: string;
  type: 'component' | 'plugin' | 'preset';
  version: string;
  title: string;
  description: string;
  author: {
    name: string;
    github: string;
    url?: string;
  };
  compatibility?: {
    storyblok?: string;
    storyblokMax?: string;
    frameworks?: string[];
  };
  tags?: string[];
  category?: string;
  files?: {
    schema?: string;
    prompt?: string;
    readme?: string;
  };
  dependencies?: {
    bloktastic?: string[];
  };
  metadata?: {
    created?: string;
    updated?: string;
    status?: 'stable' | 'unmaintained' | 'deprecated' | 'archived';
  };
  includes?: string[]; // For presets
}

export interface RegistryData {
  name: string;
  version: string;
  homepage: string;
  repository: string;
  packages: {
    components: PackageEntry[];
    plugins: PackageEntry[];
    presets: PackageEntry[];
  };
  categories: {
    components: string[];
    plugins: string[];
  };
  stats: {
    totalComponents: number;
    totalPlugins: number;
    totalPresets: number;
    lastUpdated: string;
  };
}

export interface PackageEntry {
  name: string;
  path: string;
  version: string;
  title: string;
  tags?: string[];
  category?: string;
  status?: string;
}
```

### `/packages/cli/src/lib/utils.ts`
```typescript
import chalk from 'chalk';
import ora, { Ora } from 'ora';

export const REGISTRY_URL = 'https://raw.githubusercontent.com/bloktastic/bloktastic/main/registry';
export const CONFIG_FILE = 'bloktastic.config.json';

export function log(message: string): void {
  console.log(message);
}

export function success(message: string): void {
  console.log(chalk.green('✓'), message);
}

export function warning(message: string): void {
  console.log(chalk.yellow('⚠'), message);
}

export function error(message: string): void {
  console.error(chalk.red('✗'), message);
}

export function info(message: string): void {
  console.log(chalk.blue('ℹ'), message);
}

export function spinner(text: string): Ora {
  return ora({ text, color: 'cyan' });
}

export function parsePackageName(name: string): { namespace: string; packageName: string } | null {
  const match = name.match(/^@([a-z0-9-]+)\/([a-z0-9-]+)$/);
  if (!match) return null;
  return {
    namespace: match[1],
    packageName: match[2],
  };
}

export function formatPackageName(namespace: string, packageName: string): string {
  return `@${namespace}/${packageName}`;
}
```

### `/packages/cli/src/lib/config.ts`
```typescript
import fs from 'fs/promises';
import path from 'path';
import { BloktasticConfig, InstalledPackage } from '../types/index.js';
import { CONFIG_FILE } from './utils.js';

export async function loadConfig(dir: string = process.cwd()): Promise<BloktasticConfig | null> {
  const configPath = path.join(dir, CONFIG_FILE);

  try {
    const content = await fs.readFile(configPath, 'utf-8');
    return JSON.parse(content) as BloktasticConfig;
  } catch {
    return null;
  }
}

export async function saveConfig(config: BloktasticConfig, dir: string = process.cwd()): Promise<void> {
  const configPath = path.join(dir, CONFIG_FILE);
  await fs.writeFile(configPath, JSON.stringify(config, null, 2) + '\n');
}

export async function configExists(dir: string = process.cwd()): Promise<boolean> {
  const configPath = path.join(dir, CONFIG_FILE);
  try {
    await fs.access(configPath);
    return true;
  } catch {
    return false;
  }
}

export async function addInstalledPackage(
  pkg: InstalledPackage,
  dir: string = process.cwd()
): Promise<void> {
  const config = await loadConfig(dir);
  if (!config) return;

  config.installedPackages = config.installedPackages || [];

  // Remove existing entry if present
  config.installedPackages = config.installedPackages.filter(p => p.name !== pkg.name);

  // Add new entry
  config.installedPackages.push(pkg);

  await saveConfig(config, dir);
}
```

### `/packages/cli/src/lib/validator.ts`
```typescript
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

let ajv: Ajv | null = null;

async function getAjv(): Promise<Ajv> {
  if (ajv) return ajv;

  ajv = new Ajv({ allErrors: true, strict: false });
  addFormats(ajv);

  // Load schemas from the schema directory
  const schemaDir = path.resolve(__dirname, '../../../../schema');

  const bloktasticSchema = JSON.parse(
    await fs.readFile(path.join(schemaDir, 'bloktastic.schema.json'), 'utf-8')
  );
  const registrySchema = JSON.parse(
    await fs.readFile(path.join(schemaDir, 'registry.schema.json'), 'utf-8')
  );
  const configSchema = JSON.parse(
    await fs.readFile(path.join(schemaDir, 'config.schema.json'), 'utf-8')
  );

  ajv.addSchema(bloktasticSchema, 'bloktastic');
  ajv.addSchema(registrySchema, 'registry');
  ajv.addSchema(configSchema, 'config');

  return ajv;
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export async function validatePackageManifest(data: unknown): Promise<ValidationResult> {
  const validator = await getAjv();
  const validate = validator.getSchema('bloktastic');

  if (!validate) {
    return { valid: false, errors: ['Schema not loaded'] };
  }

  const valid = validate(data);

  if (valid) {
    return { valid: true, errors: [] };
  }

  const errors = validate.errors?.map(e => {
    return `${e.instancePath || '/'}: ${e.message}`;
  }) || [];

  return { valid: false, errors };
}

export async function validateConfig(data: unknown): Promise<ValidationResult> {
  const validator = await getAjv();
  const validate = validator.getSchema('config');

  if (!validate) {
    return { valid: false, errors: ['Schema not loaded'] };
  }

  const valid = validate(data);

  if (valid) {
    return { valid: true, errors: [] };
  }

  const errors = validate.errors?.map(e => {
    return `${e.instancePath || '/'}: ${e.message}`;
  }) || [];

  return { valid: false, errors };
}
```

### `/packages/cli/src/lib/registry.ts`
```typescript
import { RegistryData, PackageManifest, PackageEntry } from '../types/index.js';
import { REGISTRY_URL } from './utils.js';

let registryCache: RegistryData | null = null;

export async function fetchRegistry(): Promise<RegistryData> {
  if (registryCache) return registryCache;

  const response = await fetch(`${REGISTRY_URL}/registry.json`);

  if (!response.ok) {
    throw new Error(`Failed to fetch registry: ${response.statusText}`);
  }

  registryCache = await response.json() as RegistryData;
  return registryCache;
}

export async function fetchPackageManifest(packagePath: string): Promise<PackageManifest> {
  const response = await fetch(`${REGISTRY_URL}/${packagePath}/bloktastic.json`);

  if (!response.ok) {
    throw new Error(`Failed to fetch package manifest: ${response.statusText}`);
  }

  return await response.json() as PackageManifest;
}

export async function fetchPackageSchema(packagePath: string): Promise<object> {
  const response = await fetch(`${REGISTRY_URL}/${packagePath}/schema.json`);

  if (!response.ok) {
    throw new Error(`Failed to fetch package schema: ${response.statusText}`);
  }

  return await response.json();
}

export async function fetchPackagePrompt(packagePath: string): Promise<string> {
  const response = await fetch(`${REGISTRY_URL}/${packagePath}/prompt.md`);

  if (!response.ok) {
    throw new Error(`Failed to fetch package prompt: ${response.statusText}`);
  }

  return await response.text();
}

export async function findPackage(name: string): Promise<PackageEntry | null> {
  const registry = await fetchRegistry();

  // Search in all package types
  const allPackages = [
    ...registry.packages.components,
    ...registry.packages.plugins,
    ...registry.packages.presets,
  ];

  return allPackages.find(p => p.name === name) || null;
}

export async function searchPackages(query: string, type?: string): Promise<PackageEntry[]> {
  const registry = await fetchRegistry();
  const queryLower = query.toLowerCase();

  let packages: PackageEntry[] = [];

  if (!type || type === 'component') {
    packages.push(...registry.packages.components);
  }
  if (!type || type === 'plugin') {
    packages.push(...registry.packages.plugins);
  }
  if (!type || type === 'preset') {
    packages.push(...registry.packages.presets);
  }

  return packages.filter(p => {
    const nameMatch = p.name.toLowerCase().includes(queryLower);
    const titleMatch = p.title.toLowerCase().includes(queryLower);
    const tagMatch = p.tags?.some(t => t.toLowerCase().includes(queryLower));
    return nameMatch || titleMatch || tagMatch;
  });
}
```

### Placeholder Commands (werden in späteren Tasks implementiert)

Erstelle für jeden Command eine Placeholder-Datei:

### `/packages/cli/src/commands/init.ts`
```typescript
import { Command } from 'commander';

export const initCommand = new Command('init')
  .description('Initialize Bloktastic in your project')
  .action(async () => {
    console.log('Init command - will be implemented in Task 4');
  });
```

### `/packages/cli/src/commands/validate.ts`
```typescript
import { Command } from 'commander';

export const validateCommand = new Command('validate')
  .description('Validate a package')
  .argument('<path>', 'Path to package directory')
  .action(async (packagePath: string) => {
    console.log(`Validate command for ${packagePath} - will be implemented in Task 4`);
  });
```

### `/packages/cli/src/commands/create.ts`
```typescript
import { Command } from 'commander';

export const createCommand = new Command('create')
  .description('Create a new package')
  .argument('<type>', 'Package type (component, plugin, preset)')
  .argument('<name>', 'Package name')
  .action(async (type: string, name: string) => {
    console.log(`Create command - will be implemented in Task 5`);
  });
```

### `/packages/cli/src/commands/add.ts`
```typescript
import { Command } from 'commander';

export const addCommand = new Command('add')
  .description('Add a package to your Storyblok space')
  .argument('<package>', 'Package name (e.g. @bloktastic/hero)')
  .option('--prompt-only', 'Only show the prompt, do not push schema')
  .option('--skip-schema', 'Skip pushing schema to Storyblok')
  .option('--force', 'Overwrite existing components')
  .action(async (packageName: string, options) => {
    console.log(`Add command - will be implemented in Task 6`);
  });
```

### `/packages/cli/src/commands/search.ts`
```typescript
import { Command } from 'commander';

export const searchCommand = new Command('search')
  .description('Search the registry')
  .argument('<query>', 'Search query')
  .option('-t, --type <type>', 'Filter by type (component, plugin, preset)')
  .option('-c, --category <category>', 'Filter by category')
  .action(async (query: string, options) => {
    console.log(`Search command - will be implemented in Task 7`);
  });
```

### `/packages/cli/src/commands/list.ts`
```typescript
import { Command } from 'commander';

export const listCommand = new Command('list')
  .description('List available packages')
  .option('-t, --type <type>', 'Filter by type')
  .option('-c, --category <category>', 'Filter by category')
  .option('--installed', 'Show only installed packages')
  .action(async (options) => {
    console.log(`List command - will be implemented in Task 7`);
  });
```

### `/packages/cli/src/commands/info.ts`
```typescript
import { Command } from 'commander';

export const infoCommand = new Command('info')
  .description('Show package details')
  .argument('<package>', 'Package name')
  .action(async (packageName: string) => {
    console.log(`Info command - will be implemented in Task 7`);
  });
```

## Acceptance Criteria

- [ ] `pnpm install` in packages/cli läuft ohne Fehler
- [ ] `pnpm build` erstellt dist/index.js
- [ ] `node dist/index.js --help` zeigt alle Commands
- [ ] `node dist/index.js --version` zeigt 0.1.0
- [ ] Types kompilieren ohne Fehler
- [ ] Utils (log, success, error, etc.) funktionieren

## Commands zum Testen

```bash
cd packages/cli
pnpm install
pnpm build
node dist/index.js --help
node dist/index.js --version
```

## Nächster Task
→ Task 4: CLI init & validate Commands
