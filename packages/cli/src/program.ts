import { Command } from 'commander';
import { addCommand } from './commands/add.js';
import { createCommand } from './commands/create.js';
import { infoCommand } from './commands/info.js';
import { initCommand } from './commands/init.js';
import { listCommand } from './commands/list.js';
import { searchCommand } from './commands/search.js';
import { validateCommand } from './commands/validate.js';
import packageJson from '../package.json' with { type: 'json' };

export function createProgram(): Command {
  const program = new Command();

  program
    .name('bloktastic')
    .description('CLI for Bloktastic - Storyblok Registry')
    .version(packageJson.version);

  program.addCommand(initCommand);
  program.addCommand(addCommand);
  program.addCommand(validateCommand);
  program.addCommand(createCommand);
  program.addCommand(searchCommand);
  program.addCommand(listCommand);
  program.addCommand(infoCommand);

  return program;
}
