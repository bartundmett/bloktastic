import chalk from 'chalk';
import { createProgram } from './program.js';

export async function run(argv: string[] = process.argv): Promise<void> {
  const program = createProgram();

  await program.parseAsync(argv).catch((err: unknown) => {
    if (err instanceof Error) {
      console.error(chalk.red('Error:'), err.message);
    } else {
      console.error(chalk.red('Error:'), String(err));
    }
    process.exit(1);
  });
}

await run();
