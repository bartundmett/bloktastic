import { Command } from 'commander';
import chalk from 'chalk';
import prompts from 'prompts';
import { configExists, saveConfig } from '../lib/config.js';
import { error, info, success, warning } from '../lib/utils.js';
import type { BloktasticConfig, PromptOutput, Region } from '../types/index.js';

const LOGO = `
  ____  _       _    _            _   _
 | __ )| | ___ | | _| |_ __ _ ___| |_(_) ___
 |  _ \\| |/ _ \\| |/ / __/ _\` / __| __| |/ __|
 | |_) | | (_) |   <| || (_| \\__ \\ |_| | (__
 |____/|_|\\___/|_|\\_\\__\\__,_|___/\\__|_|\\___|
`;

const REGIONS: Array<{ title: string; value: Region }> = [
  { title: 'EU (eu.storyblok.com)', value: 'eu' },
  { title: 'US (us.storyblok.com)', value: 'us' },
  { title: 'Canada (ca.storyblok.com)', value: 'ca' },
  { title: 'Asia-Pacific (ap.storyblok.com)', value: 'ap' }
];

const FRAMEWORKS = [
  { title: 'Vue', value: 'vue' },
  { title: 'Nuxt', value: 'nuxt' },
  { title: 'React', value: 'react' },
  { title: 'Next.js', value: 'nextjs' },
  { title: 'Astro', value: 'astro' },
  { title: 'Svelte', value: 'svelte' },
  { title: 'Agnostic', value: 'agnostic' }
];

const PROMPT_OUTPUTS: Array<{ title: string; value: PromptOutput }> = [
  { title: 'Copy to clipboard', value: 'clipboard' },
  { title: 'Save to file', value: 'file' },
  { title: 'Print to stdout', value: 'stdout' }
];

interface InitOptions {
  yes?: boolean;
  space?: string;
  region?: Region;
}

export const initCommand = new Command('init')
  .description('Initialize Bloktastic in your project')
  .option('-y, --yes', 'Skip prompts and use defaults')
  .option('--space <id>', 'Storyblok Space ID')
  .option('--region <region>', 'Storyblok region (eu, us, ca, ap)')
  .action(async (options: InitOptions) => {
    console.log(chalk.cyan(LOGO));
    console.log(chalk.white("Welcome to Bloktastic! Let's set up your project.\n"));

    if (await configExists()) {
      const { overwrite } = await prompts({
        type: 'confirm',
        name: 'overwrite',
        message: 'bloktastic.config.json already exists. Overwrite?',
        initial: false
      });

      if (!overwrite) {
        info('Initialization cancelled.');
        return;
      }
    }

    let config: BloktasticConfig;

    if (options.yes) {
      if (!options.space || !/^\d+$/.test(options.space)) {
        error('With --yes, a numeric --space <id> is required.');
        process.exit(1);
      }

      config = {
        $schema: 'https://bloktastic.dev/schema/config.schema.json',
        space: {
          id: options.space,
          region: options.region ?? 'eu'
        },
        preferences: {
          defaultFramework: 'astro',
          outputDirectory: './components/storyblok',
          promptOutput: 'clipboard'
        },
        installedPackages: []
      };
    } else {
      const answers = await prompts(
        [
          {
            type: 'text',
            name: 'spaceId',
            message: 'Storyblok Space ID:',
            validate: (value: string) => (/^\d+$/.test(value) ? true : 'Space ID must be numeric')
          },
          {
            type: 'select',
            name: 'region',
            message: 'Region:',
            choices: REGIONS,
            initial: 0
          },
          {
            type: 'select',
            name: 'framework',
            message: 'Default Framework:',
            choices: FRAMEWORKS,
            initial: 4
          },
          {
            type: 'select',
            name: 'promptOutput',
            message: 'Prompt output preference:',
            choices: PROMPT_OUTPUTS,
            initial: 0
          }
        ],
        {
          onCancel: () => {
            error('Initialization cancelled.');
            process.exit(1);
          }
        }
      );

      config = {
        $schema: 'https://bloktastic.dev/schema/config.schema.json',
        space: {
          id: answers.spaceId,
          region: answers.region as Region
        },
        preferences: {
          defaultFramework: answers.framework,
          outputDirectory: './components/storyblok',
          promptOutput: answers.promptOutput as PromptOutput
        },
        installedPackages: []
      };
    }

    await saveConfig(config);
    success('Created bloktastic.config.json');

    if (!process.env.STORYBLOK_OAUTH_TOKEN) {
      console.log('');
      warning('STORYBLOK_OAUTH_TOKEN not found in environment.');
      info("You'll need this to push components to Storyblok.");
      console.log(chalk.dim('  Generate one at: https://app.storyblok.com/#/me/account?tab=token'));
    }

    console.log('');
    console.log(chalk.white('Next steps:'));
    console.log(chalk.dim('  1. Set STORYBLOK_OAUTH_TOKEN in your environment'));
    console.log(chalk.dim('  2. Run `bloktastic add @bloktastic/hero` to install your first component'));
  });
