import { afterEach, describe, expect, it, vi } from 'vitest';
import { createProgram } from '../src/program.js';

describe('info command', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('requires namespaced package names', async () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(console, 'log').mockImplementation(() => {});

    vi.spyOn(process, 'exit').mockImplementation(((code?: number) => {
      throw new Error(`process.exit:${code ?? 0}`);
    }) as never);

    const program = createProgram();

    await expect(program.parseAsync(['node', 'bloktastic', 'info', 'hero'])).rejects.toThrow(
      'process.exit:1'
    );

    const stderr = errorSpy.mock.calls.flat().join(' ');
    expect(stderr).toContain('Package name must include namespace');
  });
});
