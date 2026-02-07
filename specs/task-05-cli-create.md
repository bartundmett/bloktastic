# Task 5: CLI create Command

## Ziel
Implementiere den `bloktastic create` Command zum Scaffolden neuer Packages.

## Voraussetzungen
- Task 4 abgeschlossen (init & validate Commands)

## Command: `bloktastic create`

### Beschreibung
Erstellt die Grundstruktur für ein neues Package im Registry-Format.

### Usage

```bash
# Component erstellen
bloktastic create component my-hero

# Mit Namespace
bloktastic create component hero --namespace mycompany

# Plugin erstellen
bloktastic create plugin color-picker

# Preset erstellen
bloktastic create preset blog-starter
```

### Interaktiver Flow

```
$ bloktastic create component my-hero

Creating new component package...

? Package namespace: (@bloktastic for official, @username for personal)
  > @bmueller
? Display title: My Hero Section
? Description: A customizable hero section with...
? Category: (Use arrow keys)
  ❯ sections
    content
    navigation
    forms
    media
    layout
    commerce
? Tags (comma-separated): hero, header, landing
? GitHub username (for author): bmueller

Created package structure:

  registry/components/my-hero/
  ├── bloktastic.json   ← Package manifest
  ├── schema.json       ← Storyblok schema (edit this!)
  ├── prompt.md         ← AI generation prompt (edit this!)
  └── README.md         ← Documentation

Next steps:
  1. Edit schema.json with your Storyblok component fields
  2. Edit prompt.md with AI generation instructions
  3. Run `bloktastic validate registry/components/my-hero`
  4. Submit a PR to github.com/bloktastic/bloktastic
```

### Implementation

```typescript
// /packages/cli/src/commands/create.ts
import { Command } from 'commander';
import prompts from 'prompts';
import chalk from 'chalk';
import fs from 'fs/promises';
import path from 'path';
import { PackageManifest } from '../types/index.js';
import { success, error, info, log, formatPackageName } from '../lib/utils.js';

const CATEGORIES = [
  { title: 'sections', value: 'sections' },
  { title: 'content', value: 'content' },
  { title: 'navigation', value: 'navigation' },
  { title: 'forms', value: 'forms' },
  { title: 'media', value: 'media' },
  { title: 'layout', value: 'layout' },
  { title: 'commerce', value: 'commerce' },
];

const COMPONENT_SCHEMA_TEMPLATE = `{
  "$bloktastic": {
    "version": "1.0.0"
  },
  "name": "{{name}}",
  "display_name": "{{title}}",
  "is_root": false,
  "is_nestable": true,
  "schema": {
    "headline": {
      "type": "text",
      "pos": 0,
      "required": true,
      "display_name": "Headline"
    },
    "content": {
      "type": "richtext",
      "pos": 1,
      "display_name": "Content"
    }
  },
  "preview_field": "headline"
}`;

const COMPONENT_PROMPT_TEMPLATE = `# {{title}}

## Purpose
{{description}}

## Storyblok Schema Fields
- \`headline\` (text, required): Main heading
- \`content\` (richtext): Body content

## Visual Requirements
- Describe the visual appearance
- Responsive behavior
- Spacing and layout

## Accessibility
- Semantic HTML structure
- ARIA attributes if needed
- Keyboard navigation considerations

## Example Props Structure
\`\`\`typescript
interface {{pascalName}}Props {
  headline: string;
  content?: string;
}
\`\`\`

## Styling Considerations
- CSS custom properties for theming
- Responsive breakpoints
- Animation/transition preferences

## Edge Cases
- Empty content handling
- Very long text handling
- Missing optional fields
`;

const COMPONENT_README_TEMPLATE = `# {{title}}

{{description}}

## Installation

\`\`\`bash
bloktastic add {{fullName}}
\`\`\`

## Schema Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| headline | text | Yes | Main heading |
| content | richtext | No | Body content |

## Usage

After installation, the component will be available in your Storyblok space.

Use the provided \`prompt.md\` to generate frontend code with your preferred AI tool.

## Author

Created by [{{authorName}}](https://github.com/{{authorGithub}})
`;

const PRESET_MANIFEST_TEMPLATE = `{
  "$schema": "https://bloktastic.dev/schema/bloktastic.schema.json",
  "name": "{{fullName}}",
  "type": "preset",
  "version": "1.0.0",
  "title": "{{title}}",
  "description": "{{description}}",
  "author": {
    "name": "{{authorName}}",
    "github": "{{authorGithub}}"
  },
  "includes": [],
  "tags": [{{tags}}],
  "category": "presets",
  "metadata": {
    "created": "{{date}}",
    "updated": "{{date}}",
    "status": "stable"
  }
}`;

function toPascalCase(str: string): string {
  return str
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
}

function formatDate(): string {
  return new Date().toISOString().split('T')[0];
}

function formatTags(tags: string[]): string {
  return tags.map(t => `"${t.trim()}"`).join(', ');
}

export const createCommand = new Command('create')
  .description('Create a new Bloktastic package')
  .argument('<type>', 'Package type (component, plugin, preset)')
  .argument('<name>', 'Package name (lowercase, hyphens)')
  .option('-n, --namespace <namespace>', 'Package namespace (default: @bloktastic)')
  .option('-o, --output <path>', 'Output directory (default: registry/<type>s)')
  .action(async (type: string, name: string, options) => {
    // Validate type
    if (!['component', 'plugin', 'preset'].includes(type)) {
      error(`Invalid type: ${type}. Must be component, plugin, or preset.`);
      process.exit(1);
    }

    // Validate name
    if (!/^[a-z0-9-]+$/.test(name)) {
      error('Package name must be lowercase with hyphens only.');
      process.exit(1);
    }

    console.log(`\nCreating new ${chalk.cyan(type)} package...\n`);

    // Interactive prompts
    const answers = await prompts([
      {
        type: 'text',
        name: 'namespace',
        message: 'Package namespace:',
        initial: options.namespace || 'bloktastic',
        validate: (value) => /^[a-z0-9-]+$/.test(value) ? true : 'Namespace must be lowercase with hyphens',
      },
      {
        type: 'text',
        name: 'title',
        message: 'Display title:',
        initial: name.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
      },
      {
        type: 'text',
        name: 'description',
        message: 'Description:',
        validate: (value) => value.length >= 10 ? true : 'Description must be at least 10 characters',
      },
      {
        type: type === 'component' ? 'select' : null,
        name: 'category',
        message: 'Category:',
        choices: CATEGORIES,
      },
      {
        type: 'text',
        name: 'tags',
        message: 'Tags (comma-separated):',
        initial: name,
      },
      {
        type: 'text',
        name: 'authorName',
        message: 'Your name:',
      },
      {
        type: 'text',
        name: 'authorGithub',
        message: 'GitHub username:',
        validate: (value) => /^[a-zA-Z0-9-]+$/.test(value) ? true : 'Invalid GitHub username',
      },
    ], {
      onCancel: () => {
        error('Creation cancelled.');
        process.exit(1);
      },
    });

    const fullName = formatPackageName(answers.namespace, name);
    const tags = answers.tags.split(',').map((t: string) => t.trim()).filter(Boolean);
    const pascalName = toPascalCase(name);
    const date = formatDate();

    // Determine output path
    const outputBase = options.output || path.join(process.cwd(), 'registry', `${type}s`);
    const outputPath = path.join(outputBase, name);

    // Check if directory exists
    try {
      await fs.access(outputPath);
      error(`Directory already exists: ${outputPath}`);
      process.exit(1);
    } catch {
      // Directory doesn't exist, good
    }

    // Create directory
    await fs.mkdir(outputPath, { recursive: true });

    // Create files based on type
    if (type === 'component') {
      // bloktastic.json
      const manifest: PackageManifest = {
        $schema: 'https://bloktastic.dev/schema/bloktastic.schema.json',
        name: fullName,
        type: 'component',
        version: '1.0.0',
        title: answers.title,
        description: answers.description,
        author: {
          name: answers.authorName,
          github: answers.authorGithub,
        },
        compatibility: {
          storyblok: '>=2.0.0',
          frameworks: ['vue', 'nuxt', 'react', 'nextjs', 'astro', 'agnostic'],
        },
        tags,
        category: answers.category,
        files: {
          schema: 'schema.json',
          prompt: 'prompt.md',
          readme: 'README.md',
        },
        dependencies: {
          bloktastic: [],
        },
        metadata: {
          created: date,
          updated: date,
          status: 'stable',
        },
      };

      await fs.writeFile(
        path.join(outputPath, 'bloktastic.json'),
        JSON.stringify(manifest, null, 2) + '\n'
      );

      // schema.json
      const schema = COMPONENT_SCHEMA_TEMPLATE
        .replace(/\{\{name\}\}/g, name)
        .replace(/\{\{title\}\}/g, answers.title);

      await fs.writeFile(path.join(outputPath, 'schema.json'), schema);

      // prompt.md
      const prompt = COMPONENT_PROMPT_TEMPLATE
        .replace(/\{\{title\}\}/g, answers.title)
        .replace(/\{\{description\}\}/g, answers.description)
        .replace(/\{\{pascalName\}\}/g, pascalName);

      await fs.writeFile(path.join(outputPath, 'prompt.md'), prompt);

      // README.md
      const readme = COMPONENT_README_TEMPLATE
        .replace(/\{\{title\}\}/g, answers.title)
        .replace(/\{\{description\}\}/g, answers.description)
        .replace(/\{\{fullName\}\}/g, fullName)
        .replace(/\{\{authorName\}\}/g, answers.authorName)
        .replace(/\{\{authorGithub\}\}/g, answers.authorGithub);

      await fs.writeFile(path.join(outputPath, 'README.md'), readme);

    } else if (type === 'preset') {
      // Preset only needs bloktastic.json and README.md
      const manifest = PRESET_MANIFEST_TEMPLATE
        .replace(/\{\{fullName\}\}/g, fullName)
        .replace(/\{\{title\}\}/g, answers.title)
        .replace(/\{\{description\}\}/g, answers.description)
        .replace(/\{\{authorName\}\}/g, answers.authorName)
        .replace(/\{\{authorGithub\}\}/g, answers.authorGithub)
        .replace(/\{\{tags\}\}/g, formatTags(tags))
        .replace(/\{\{date\}\}/g, date);

      await fs.writeFile(path.join(outputPath, 'bloktastic.json'), manifest);

      const readme = `# ${answers.title}\n\n${answers.description}\n\n## Included Components\n\n- (Add components to the \`includes\` array in bloktastic.json)\n\n## Installation\n\n\`\`\`bash\nbloktastic add ${fullName}\n\`\`\`\n`;

      await fs.writeFile(path.join(outputPath, 'README.md'), readme);
    }

    // Success output
    console.log('\n' + chalk.green('Created package structure:') + '\n');

    const relativePath = path.relative(process.cwd(), outputPath);
    console.log(chalk.dim(`  ${relativePath}/`));

    const files = await fs.readdir(outputPath);
    for (const file of files) {
      const desc = file === 'bloktastic.json' ? '← Package manifest'
        : file === 'schema.json' ? '← Storyblok schema (edit this!)'
        : file === 'prompt.md' ? '← AI generation prompt (edit this!)'
        : file === 'README.md' ? '← Documentation'
        : '';
      console.log(chalk.dim(`  ├── ${file}   ${chalk.yellow(desc)}`));
    }

    console.log('\n' + chalk.white('Next steps:'));
    if (type === 'component') {
      console.log(chalk.dim('  1. Edit schema.json with your Storyblok component fields'));
      console.log(chalk.dim('  2. Edit prompt.md with AI generation instructions'));
      console.log(chalk.dim(`  3. Run \`bloktastic validate ${relativePath}\``));
      console.log(chalk.dim('  4. Submit a PR to github.com/bloktastic/bloktastic'));
    } else if (type === 'preset') {
      console.log(chalk.dim('  1. Add component names to the `includes` array'));
      console.log(chalk.dim(`  2. Run \`bloktastic validate ${relativePath}\``));
      console.log(chalk.dim('  3. Submit a PR to github.com/bloktastic/bloktastic'));
    }
  });
```

## Template Files

Die Templates sind im Code eingebettet. Bei Bedarf können sie auch als externe Dateien im CLI-Package gespeichert werden.

## Acceptance Criteria

- [ ] `bloktastic create component <name>` erstellt vollständige Struktur
- [ ] `bloktastic create preset <name>` erstellt Preset-Struktur
- [ ] Interaktive Prompts für alle Felder
- [ ] `--namespace` Option funktioniert
- [ ] `--output` Option funktioniert
- [ ] Validierung von Namen (lowercase, hyphens)
- [ ] Erstellte `bloktastic.json` ist valide (kann mit validate geprüft werden)
- [ ] Fehler wenn Verzeichnis existiert

## Test Commands

```bash
# Component erstellen
bloktastic create component test-hero

# Validieren
bloktastic validate registry/components/test-hero

# Aufräumen
rm -rf registry/components/test-hero
```

## Nächster Task
→ Task 6: CLI add Command mit Storyblok API
