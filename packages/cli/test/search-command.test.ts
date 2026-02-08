import { Command } from 'commander';
import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('../src/lib/registry.js', () => ({
  searchPackages: vi.fn()
}));

vi.mock('../src/lib/utils.js', () => ({
  spinner: vi.fn(() => ({
    start: vi.fn(),
    stop: vi.fn(),
    fail: vi.fn()
  })),
  info: vi.fn(),
  error: vi.fn()
}));

import { searchCommand } from '../src/commands/search.js';
import { searchPackages } from '../src/lib/registry.js';
import { info, spinner } from '../src/lib/utils.js';

describe('search command', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('forwards query filters and reports empty results', async () => {
    vi.mocked(searchPackages).mockResolvedValue([]);
    vi.spyOn(console, 'log').mockImplementation(() => {});

    const program = new Command();
    program.name('bloktastic').addCommand(searchCommand);

    await program.parseAsync([
      'node',
      'bloktastic',
      'search',
      'hero',
      '--type',
      'component',
      '--category',
      'sections',
      '--tag',
      'landing'
    ]);

    expect(searchPackages).toHaveBeenCalledWith('hero', {
      type: 'component',
      category: 'sections',
      tag: 'landing'
    });
    expect(spinner).toHaveBeenCalledWith('Searching registry...');
    expect(info).toHaveBeenCalledWith('No packages found matching "hero"');
  });
});
