import fs from 'node:fs/promises';
import path from 'node:path';
import { Command } from 'commander';
import chalk from 'chalk';
import { findPackage } from '../lib/registry.js';
import { validatePackageManifest } from '../lib/validator.js';
import type { PackageManifest } from '../types/index.js';
import { error, success, warning } from '../lib/utils.js';

const REQUIRED_PROMPT_SECTIONS = [
  '## Purpose',
  '## Storyblok Schema Fields',
  '## Visual Requirements',
  '## Accessibility'
];

interface ValidateOptions {
  quiet?: boolean;
}

export const validateCommand = new Command('validate')
  .description('Validate a Bloktastic package')
  .argument('<path>', 'Path to package directory')
  .option('--quiet', 'Only output errors')
  .action(async (packagePath: string, options: ValidateOptions) => {
    const absolutePath = path.resolve(process.cwd(), packagePath);
    const quiet = Boolean(options.quiet);

    const log = (message: string) => {
      if (!quiet) console.log(message);
    };

    let hasErrors = false;
    let manifest: PackageManifest | null = null;

    try {
      const stat = await fs.stat(absolutePath);
      if (!stat.isDirectory()) {
        error(`${packagePath} is not a directory`);
        process.exit(1);
      }
    } catch {
      error(`Directory not found: ${packagePath}`);
      process.exit(1);
    }

    try {
      const manifestRaw = await fs.readFile(path.join(absolutePath, 'bloktastic.json'), 'utf8');
      manifest = JSON.parse(manifestRaw) as PackageManifest;
    } catch (err) {
      error('bloktastic.json not found or invalid JSON');
      process.exit(1);
    }

    log(`\nValidating ${chalk.cyan(manifest.name)}...\n`);

    const manifestValidation = await validatePackageManifest(manifest);
    if (!manifestValidation.valid) {
      error('bloktastic.json validation failed:');
      manifestValidation.errors.forEach((entry) => console.error(chalk.red(`  - ${entry}`)));
      hasErrors = true;
    } else {
      log(`  ${chalk.green('✓')} bloktastic.json valid`);
    }

    if (manifest.type === 'component') {
      const schemaFile = manifest.files?.schema ?? 'schema.json';
      try {
        const schemaRaw = await fs.readFile(path.join(absolutePath, schemaFile), 'utf8');
        const schema = JSON.parse(schemaRaw) as Record<string, unknown>;

        if (
          typeof schema.name === 'string' &&
          typeof schema.schema === 'object' &&
          schema.schema !== null
        ) {
          log(`  ${chalk.green('✓')} ${schemaFile} valid (Storyblok format)`);
        } else {
          error(`${schemaFile} is missing required Storyblok fields (name, schema)`);
          hasErrors = true;
        }
      } catch {
        error(`${schemaFile} not found or invalid JSON`);
        hasErrors = true;
      }

      const promptFile = manifest.files?.prompt ?? 'prompt.md';
      try {
        const prompt = await fs.readFile(path.join(absolutePath, promptFile), 'utf8');
        log(`  ${chalk.green('✓')} ${promptFile} exists (${(prompt.length / 1024).toFixed(1)}kb)`);

        REQUIRED_PROMPT_SECTIONS.forEach((section) => {
          if (prompt.includes(section)) {
            log(`    ${chalk.green('✓')} Contains required section: ${section.replace('## ', '')}`);
          } else {
            warning(`Missing recommended prompt section: ${section.replace('## ', '')}`);
          }
        });
      } catch {
        error(`${promptFile} not found`);
        hasErrors = true;
      }
    }

    const readmeFile = manifest.files?.readme ?? 'README.md';
    try {
      const readme = await fs.readFile(path.join(absolutePath, readmeFile), 'utf8');
      log(`  ${chalk.green('✓')} ${readmeFile} exists (${(readme.length / 1024).toFixed(1)}kb)`);
    } catch {
      warning(`${readmeFile} not found (recommended)`);
    }

    if (manifest.dependencies?.bloktastic?.length) {
      let missing = 0;
      for (const dep of manifest.dependencies.bloktastic) {
        const found = await findPackage(dep);
        if (!found) {
          error(`Dependency not found in registry: ${dep}`);
          missing += 1;
        }
      }

      if (missing === 0) {
        log(
          `  ${chalk.green('✓')} Dependencies available: ${manifest.dependencies.bloktastic.join(', ')}`
        );
      } else {
        hasErrors = true;
      }
    }

    console.log('');
    if (hasErrors) {
      error('Package has validation errors. Please fix them before submitting.');
      process.exit(1);
    }

    success('Package is valid and ready for submission!');
  });
