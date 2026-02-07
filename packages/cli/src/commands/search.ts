import { Command } from 'commander';
import chalk from 'chalk';
import { searchPackages } from '../lib/registry.js';
import type { PackageType } from '../types/index.js';
import { error, info, spinner } from '../lib/utils.js';

interface SearchOptions {
  type?: PackageType;
  category?: string;
  tag?: string;
}

export const searchCommand = new Command('search')
  .description('Search packages in the Bloktastic registry')
  .argument('<query>', 'Search query')
  .option('-t, --type <type>', 'Filter by type (component, plugin, preset)')
  .option('-c, --category <category>', 'Filter by category')
  .option('--tag <tag>', 'Filter by tag')
  .action(async (query: string, options: SearchOptions) => {
    const spin = spinner('Searching registry...');
    spin.start();

    try {
      const results = await searchPackages(query, {
        type: options.type,
        category: options.category,
        tag: options.tag
      });

      spin.stop();

      if (results.length === 0) {
        info(`No packages found matching "${query}"`);
        console.log(chalk.dim('\nTry another query or use `bloktastic list` to browse all packages.'));
        return;
      }

      console.log(`\nFound ${chalk.cyan(results.length)} package${results.length > 1 ? 's' : ''} matching "${query}":\n`);

      results.forEach((pkg) => {
        const typeLabel = chalk.dim(pkg._type);
        const category = chalk.yellow(pkg.category ?? 'uncategorized');
        const status =
          pkg.status === 'deprecated'
            ? chalk.red(' [deprecated]')
            : pkg.status === 'unmaintained'
              ? chalk.yellow(' [unmaintained]')
              : '';

        console.log(`  ${chalk.cyan(pkg.name)} ${chalk.dim(`(v${pkg.version})`)} · ${typeLabel} · ${category}${status}`);
        console.log(`  ${pkg.title}`);

        if (pkg.tags?.length) {
          console.log(chalk.dim(`  Tags: ${pkg.tags.join(', ')}`));
        }

        console.log('');
      });

      console.log(chalk.dim('Run `bloktastic add <name>` to install.'));
    } catch (err) {
      spin.fail();
      error(`Search failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
      process.exit(1);
    }
  });
