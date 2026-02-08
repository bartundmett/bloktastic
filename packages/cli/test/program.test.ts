import { describe, expect, it } from 'vitest';
import { createProgram } from '../src/program.js';
import packageJson from '../package.json' with { type: 'json' };

describe('createProgram', () => {
  it('registers CLI metadata and top-level commands', () => {
    const program = createProgram();

    expect(program.name()).toBe('bloktastic');
    expect(program.description()).toBe('CLI for Bloktastic - Storyblok Registry');
    expect(program.version()).toBe(packageJson.version);
    expect(program.commands.map((command) => command.name())).toEqual([
      'init',
      'add',
      'validate',
      'create',
      'search',
      'list',
      'info'
    ]);
  });
});
