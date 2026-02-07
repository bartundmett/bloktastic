import fs from 'node:fs/promises';
import path from 'node:path';
import { Command } from 'commander';
import prompts from 'prompts';
import {
  error,
  formatDate,
  formatPackageName,
  pathExists,
  success,
  toPascalCase
} from '../lib/utils.js';
import type { PackageManifest, PackageType } from '../types/index.js';

const COMPONENT_CATEGORIES = [
  { title: 'sections', value: 'sections' },
  { title: 'content', value: 'content' },
  { title: 'navigation', value: 'navigation' },
  { title: 'forms', value: 'forms' },
  { title: 'media', value: 'media' },
  { title: 'layout', value: 'layout' },
  { title: 'commerce', value: 'commerce' }
] ;

const PLUGIN_CATEGORIES = [
  { title: 'field-plugins', value: 'field-plugins' },
  { title: 'tool-plugins', value: 'tool-plugins' },
  { title: 'sidebar-plugins', value: 'sidebar-plugins' }
] ;

interface CreateOptions {
  namespace?: string;
  output?: string;
  yes?: boolean;
  title?: string;
  description?: string;
  category?: string;
  tags?: string;
  authorName?: string;
  authorGithub?: string;
}

function assertType(type: string): asserts type is PackageType {
  if (!['component', 'plugin', 'preset'].includes(type)) {
    throw new Error('Type must be component, plugin, or preset.');
  }
}

function toDisplayTitle(name: string): string {
  return name
    .split('-')
    .filter(Boolean)
    .map((word) => `${word[0]?.toUpperCase() || ''}${word.slice(1)}`)
    .join(' ');
}

function validateName(name: string): boolean {
  return /^[a-z0-9-]{2,50}$/.test(name);
}

function tagsToArray(raw: string): string[] {
  return raw
    .split(',')
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean)
    .slice(0, 10);
}

function buildComponentSchema(name: string, title: string): string {
  return `${JSON.stringify(
    {
      $bloktastic: { version: '1.0.0' },
      name,
      display_name: title,
      is_root: false,
      is_nestable: true,
      schema: {
        headline: {
          type: 'text',
          pos: 0,
          required: true,
          display_name: 'Headline',
          description: 'Primary heading text'
        },
        body: {
          type: 'richtext',
          pos: 1,
          display_name: 'Body',
          description: 'Supporting content'
        }
      },
      preview_field: 'headline'
    },
    null,
    2
  )}\n`;
}

function buildComponentPrompt(title: string, description: string, pascalName: string): string {
  return `# ${title}

## Purpose
${description}

## Storyblok Schema Fields
- \`headline\` (text, required): Main heading
- \`body\` (richtext): Supporting content

## Visual Requirements
- Define spacing, typography, and responsive behavior.
- Include empty-state treatment for optional content.

## Accessibility
- Semantic heading hierarchy.
- Keyboard/focus-safe interactions.
- Contrast-compliant color usage.

## Example Props Structure
\`\`\`typescript
interface ${pascalName}Props {
  headline: string;
  body?: unknown;
}
\`\`\`

## Edge Cases
- Missing body content
- Very long headline text
- Nested rich text links
`;
}

function buildComponentReadme(fullName: string, title: string, description: string): string {
  return `# ${fullName}

${description}

## Installation

\`\`\`bash
bloktastic add ${fullName}
\`\`\`

## About

${title} is scaffolded by \`bloktastic create component\`.
Update \`schema.json\` and \`prompt.md\` before publishing.
`;
}

function buildPluginReadme(fullName: string, description: string): string {
  return `# ${fullName}

${description}

## Installation

This is a plugin listing package. Add setup steps and links for the external plugin.
`;
}

function buildPresetReadme(fullName: string, description: string): string {
  return `# ${fullName}

${description}

## Included Packages

Add package names to the \`includes\` array in \`bloktastic.json\`.

## Installation

\`\`\`bash
bloktastic add ${fullName}
\`\`\`
`;
}

export const createCommand = new Command('create')
  .description('Create a new Bloktastic package scaffold')
  .argument('<type>', 'Package type (component, plugin, preset)')
  .argument('<name>', 'Package name (lowercase, hyphens)')
  .option('-n, --namespace <namespace>', 'Package namespace (default: bloktastic)')
  .option('-o, --output <path>', 'Output base directory')
  .option('-y, --yes', 'Use defaults and skip interactive prompts')
  .option('--title <title>', 'Display title (used with --yes)')
  .option('--description <description>', 'Package description (used with --yes)')
  .option('--category <category>', 'Category (used with --yes)')
  .option('--tags <tags>', 'Comma-separated tags (used with --yes)')
  .option('--author-name <name>', 'Author name (used with --yes)')
  .option('--author-github <username>', 'Author GitHub username (used with --yes)')
  .action(async (typeArg: string, name: string, options: CreateOptions) => {
    try {
      assertType(typeArg);
    } catch (err) {
      error(err instanceof Error ? err.message : 'Invalid type');
      process.exit(1);
    }

    if (!validateName(name)) {
      error('Name must be lowercase, alphanumeric, hyphenated, and 2-50 chars.');
      process.exit(1);
    }

    const type = typeArg as PackageType;
    const namespaceDefault = (options.namespace ?? 'bloktastic').replace(/^@/, '');

    let answers: Record<string, string> = {};

    if (options.yes) {
      answers = {
        namespace: namespaceDefault,
        title: options.title ?? toDisplayTitle(name),
        description: options.description ?? `${toDisplayTitle(name)} package scaffold`,
        category: options.category ?? COMPONENT_CATEGORIES[0].value,
        pluginCategory: options.category ?? PLUGIN_CATEGORIES[0].value,
        tags: options.tags ?? name,
        authorName: options.authorName ?? 'Bloktastic Contributor',
        authorGithub: options.authorGithub ?? 'bloktastic'
      };
    } else {
      answers = await prompts(
        [
          {
            type: 'text',
            name: 'namespace',
            message: 'Package namespace:',
            initial: namespaceDefault,
            validate: (value: string) =>
              /^[a-z0-9-]+$/.test(value) ? true : 'Namespace must be lowercase with hyphens'
          },
          {
            type: 'text',
            name: 'title',
            message: 'Display title:',
            initial: toDisplayTitle(name)
          },
          {
            type: 'text',
            name: 'description',
            message: 'Description:',
            validate: (value: string) =>
              value.trim().length >= 10 ? true : 'Description must be at least 10 characters'
          },
          {
            type: type === 'component' ? 'select' : null,
            name: 'category',
            message: 'Component category:',
            choices: COMPONENT_CATEGORIES,
            initial: 0
          },
          {
            type: type === 'plugin' ? 'select' : null,
            name: 'pluginCategory',
            message: 'Plugin category:',
            choices: PLUGIN_CATEGORIES,
            initial: 0
          },
          {
            type: 'text',
            name: 'tags',
            message: 'Tags (comma-separated):',
            initial: name
          },
          {
            type: 'text',
            name: 'authorName',
            message: 'Author name:',
            initial: 'Bloktastic Contributor'
          },
          {
            type: 'text',
            name: 'authorGithub',
            message: 'GitHub username:',
            validate: (value: string) =>
              /^[a-zA-Z0-9-]+$/.test(value) ? true : 'GitHub username is invalid'
          }
        ],
        {
          onCancel: () => {
            error('Creation cancelled.');
            process.exit(1);
          }
        }
      );
    }

    if (!/^[a-z0-9-]+$/.test(String(answers.namespace ?? ''))) {
      error('Namespace must be lowercase with hyphens.');
      process.exit(1);
    }

    if (!String(answers.description ?? '').trim() || String(answers.description).trim().length < 10) {
      error('Description must be at least 10 characters.');
      process.exit(1);
    }

    if (!/^[a-zA-Z0-9-]+$/.test(String(answers.authorGithub ?? ''))) {
      error('GitHub username is invalid.');
      process.exit(1);
    }

    const namespace = String(answers.namespace ?? namespaceDefault).replace(/^@/, '');
    const fullName = formatPackageName(namespace, name);
    const tags = tagsToArray(String(answers.tags ?? name));
    const date = formatDate();

    const baseDir =
      options.output ??
      path.join(process.cwd(), 'registry', type === 'component' ? 'components' : type === 'plugin' ? 'plugins' : 'presets');
    const outputDir = path.join(baseDir, name);

    if (await pathExists(outputDir)) {
      error(`Directory already exists: ${outputDir}`);
      process.exit(1);
    }

    await fs.mkdir(outputDir, { recursive: true });

    const manifest: PackageManifest = {
      $schema: 'https://bloktastic.dev/schema/bloktastic.schema.json',
      name: fullName,
      type,
      version: '1.0.0',
      title: String(answers.title),
      description: String(answers.description),
      author: {
        name: String(answers.authorName),
        github: String(answers.authorGithub)
      },
      compatibility:
        type === 'plugin'
          ? {
              storyblok: '>=2.0.0',
              frameworks: ['agnostic']
            }
          : {
              storyblok: '>=2.0.0',
              frameworks: ['vue', 'nuxt', 'react', 'nextjs', 'astro', 'svelte', 'agnostic']
            },
      tags,
      category:
        type === 'component'
          ? String(answers.category)
          : type === 'plugin'
            ? String(answers.pluginCategory)
            : undefined,
      files:
        type === 'component'
          ? { schema: 'schema.json', prompt: 'prompt.md', readme: 'README.md' }
          : { readme: 'README.md' },
      dependencies: {
        bloktastic: []
      },
      includes: type === 'preset' ? [] : undefined,
      links:
        type === 'plugin'
          ? {
              website: 'https://example.com',
              docs: 'https://example.com/docs'
            }
          : undefined,
      metadata: {
        created: date,
        updated: date,
        status: type === 'plugin' ? 'maintained' : 'stable'
      }
    };

    await fs.writeFile(path.join(outputDir, 'bloktastic.json'), `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');

    if (type === 'component') {
      const pascal = toPascalCase(name);
      await fs.writeFile(path.join(outputDir, 'schema.json'), buildComponentSchema(name, String(answers.title)), 'utf8');
      await fs.writeFile(
        path.join(outputDir, 'prompt.md'),
        buildComponentPrompt(String(answers.title), String(answers.description), pascal),
        'utf8'
      );
      await fs.writeFile(
        path.join(outputDir, 'README.md'),
        buildComponentReadme(fullName, String(answers.title), String(answers.description)),
        'utf8'
      );
    } else if (type === 'plugin') {
      await fs.writeFile(
        path.join(outputDir, 'README.md'),
        buildPluginReadme(fullName, String(answers.description)),
        'utf8'
      );
    } else {
      await fs.writeFile(
        path.join(outputDir, 'README.md'),
        buildPresetReadme(fullName, String(answers.description)),
        'utf8'
      );
    }

    const relativeDir = path.relative(process.cwd(), outputDir);
    success(`Created package scaffold: ${relativeDir}`);

    console.log('\nNext steps:');
    if (type === 'component') {
      console.log(`  1. Edit ${path.join(relativeDir, 'schema.json')}`);
      console.log(`  2. Edit ${path.join(relativeDir, 'prompt.md')}`);
      console.log(`  3. Run bloktastic validate ${relativeDir}`);
      console.log('  4. Rebuild index with pnpm registry:build');
    } else {
      console.log(`  1. Edit ${path.join(relativeDir, 'bloktastic.json')}`);
      console.log(`  2. Edit ${path.join(relativeDir, 'README.md')}`);
      console.log(`  3. Run bloktastic validate ${relativeDir}`);
      console.log('  4. Rebuild index with pnpm registry:build');
    }
  });
