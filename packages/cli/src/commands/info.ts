import { Command } from 'commander';
import chalk from 'chalk';
import { loadConfig } from '../lib/config.js';
import { fetchPackageManifest, findPackage } from '../lib/registry.js';
import { error, spinner } from '../lib/utils.js';

export const infoCommand = new Command('info')
  .description('Show detailed package information')
  .argument('<package>', 'Package name (e.g. @bloktastic/hero)')
  .action(async (packageName: string) => {
    if (!packageName.startsWith('@')) {
      error('Package name must include namespace (e.g. @bloktastic/hero)');
      process.exit(1);
    }

    const spin = spinner('Fetching package info...');
    spin.start();

    try {
      const entry = await findPackage(packageName);
      if (!entry) {
        spin.fail();
        error(`Package not found: ${packageName}`);
        process.exit(1);
      }

      const manifest = await fetchPackageManifest(entry.path);
      const config = await loadConfig();
      const installed = config?.installedPackages?.find((item) => item.name === packageName);

      spin.stop();

      console.log(`\n${chalk.cyan(manifest.name)} ${chalk.dim(`v${manifest.version}`)}`);
      if (installed) {
        console.log(chalk.green(`  ✓ Installed (${installed.installedAt.split('T')[0]})`));
      }

      console.log(`\n  ${manifest.description}\n`);

      const details: Array<[string, string]> = [
        ['Type', manifest.type],
        ['Author', `${manifest.author.name} (@${manifest.author.github})`],
        ['Category', manifest.category ?? 'uncategorized'],
        ['Tags', manifest.tags?.join(', ') ?? 'none'],
        ['Frameworks', manifest.compatibility?.frameworks?.join(', ') ?? 'agnostic'],
        ['Storyblok', manifest.compatibility?.storyblok ?? 'any'],
        ['Status', manifest.metadata?.status ?? 'stable']
      ];

      if (manifest.metadata?.created) {
        details.push(['Created', manifest.metadata.created]);
      }
      if (manifest.metadata?.updated) {
        details.push(['Updated', manifest.metadata.updated]);
      }

      const maxLabel = Math.max(...details.map(([label]) => label.length));
      details.forEach(([label, value]) => {
        console.log(`  ${chalk.dim(`${label}:`.padEnd(maxLabel + 2))} ${value}`);
      });

      if (manifest.dependencies?.bloktastic?.length) {
        console.log(`\n  ${chalk.dim('Dependencies:')}`);
        manifest.dependencies.bloktastic.forEach((dependency) => {
          console.log(`    • ${chalk.cyan(dependency)}`);
        });
      }

      if (manifest.includes?.length) {
        console.log(`\n  ${chalk.dim('Includes:')}`);
        manifest.includes.forEach((name) => {
          console.log(`    • ${chalk.cyan(name)}`);
        });
      }

      if (manifest.files) {
        console.log(`\n  ${chalk.dim('Files:')}`);
        if (manifest.files.schema) console.log(`    • ${manifest.files.schema}`);
        if (manifest.files.prompt) console.log(`    • ${manifest.files.prompt}`);
        if (manifest.files.readme) console.log(`    • ${manifest.files.readme}`);
      }

      if (manifest.links && Object.keys(manifest.links).length) {
        console.log(`\n  ${chalk.dim('Links:')}`);
        Object.entries(manifest.links).forEach(([label, value]) => {
          console.log(`    • ${label}: ${value}`);
        });
      }

      console.log(`\n  ${chalk.dim('Install:')}`);
      console.log(`    ${chalk.cyan(`bloktastic add ${manifest.name}`)}`);
      console.log('');
    } catch (err) {
      spin.fail();
      error(`Failed to fetch package info: ${err instanceof Error ? err.message : 'Unknown error'}`);
      process.exit(1);
    }
  });
