import { Command } from 'commander';
import chalk from 'chalk';
import { loadConfig } from '../lib/config.js';
import { getAllPackages } from '../lib/registry.js';
import type { PackageType, RegistryPackage } from '../types/index.js';
import { error, spinner } from '../lib/utils.js';

interface ListOptions {
  type?: PackageType;
  category?: string;
  installed?: boolean;
}

function printTypeGroup(title: string, list: RegistryPackage[], installedNames: Set<string>): void {
  if (!list.length) return;

  console.log(`\n${title} (${list.length})\n`);

  const byCategory = new Map<string, RegistryPackage[]>();

  list.forEach((pkg) => {
    const category = pkg.category ?? 'uncategorized';
    if (!byCategory.has(category)) byCategory.set(category, []);
    byCategory.get(category)?.push(pkg);
  });

  const categories = [...byCategory.keys()].sort((a, b) => a.localeCompare(b));

  categories.forEach((category) => {
    console.log(chalk.dim(`  ${category}`));

    const entries = byCategory.get(category) ?? [];
    entries
      .sort((a, b) => a.name.localeCompare(b.name))
      .forEach((pkg) => {
        const installed = installedNames.has(pkg.name) ? chalk.green(' ✓') : '';
        const status =
          pkg.status === 'deprecated'
            ? chalk.red(' [deprecated]')
            : pkg.status === 'unmaintained'
              ? chalk.yellow(' [unmaintained]')
              : '';

        const name = pkg.name.padEnd(32, ' ');
        const version = `v${pkg.version}`.padEnd(8, ' ');

        console.log(`    ${chalk.cyan(name)} ${chalk.dim(version)} ${pkg.title}${installed}${status}`);
      });

    console.log('');
  });
}

export const listCommand = new Command('list')
  .description('List available registry packages')
  .option('-t, --type <type>', 'Filter by type (component, plugin, preset)')
  .option('-c, --category <category>', 'Filter by category')
  .option('--installed', 'Show only installed packages from config')
  .action(async (options: ListOptions) => {
    const spin = spinner('Loading packages...');
    spin.start();

    try {
      const all = await getAllPackages(options.type);
      const config = await loadConfig();
      const installedNames = new Set(config?.installedPackages?.map((item) => item.name) ?? []);

      let filtered = all;

      if (options.category) {
        filtered = filtered.filter((pkg) => pkg.category === options.category);
      }

      if (options.installed) {
        filtered = filtered.filter((pkg) => installedNames.has(pkg.name));
      }

      spin.stop();

      if (!filtered.length) {
        console.log(chalk.yellow('No packages match the selected filters.'));
        return;
      }

      printTypeGroup(
        chalk.cyan('Components'),
        filtered.filter((pkg) => pkg._type === 'component'),
        installedNames
      );
      printTypeGroup(
        chalk.magenta('Plugins'),
        filtered.filter((pkg) => pkg._type === 'plugin'),
        installedNames
      );
      printTypeGroup(
        chalk.yellow('Presets'),
        filtered.filter((pkg) => pkg._type === 'preset'),
        installedNames
      );

      console.log(chalk.dim('Run `bloktastic info <name>` for detailed package metadata.'));
    } catch (err) {
      spin.fail();
      error(`List failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
      process.exit(1);
    }
  });
