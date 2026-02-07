import { Command } from 'commander';
import chalk from 'chalk';
import { addCommand } from './commands/add.js';
import { createCommand } from './commands/create.js';
import { infoCommand } from './commands/info.js';
import { initCommand } from './commands/init.js';
import { listCommand } from './commands/list.js';
import { searchCommand } from './commands/search.js';
import { validateCommand } from './commands/validate.js';

const program = new Command();

program.name('bloktastic').description('CLI for Bloktastic - Storyblok Registry').version('0.1.0');

program.addCommand(initCommand);
program.addCommand(addCommand);
program.addCommand(validateCommand);
program.addCommand(createCommand);
program.addCommand(searchCommand);
program.addCommand(listCommand);
program.addCommand(infoCommand);

await program.parseAsync(process.argv).catch((err: unknown) => {
  if (err instanceof Error) {
    console.error(chalk.red('Error:'), err.message);
  } else {
    console.error(chalk.red('Error:'), String(err));
  }
  process.exit(1);
});
