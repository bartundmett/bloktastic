import fs from 'node:fs/promises';
import path from 'node:path';
import chalk from 'chalk';
import ora, { type Ora } from 'ora';

export const CONFIG_FILE = 'bloktastic.config.json';
export const DEFAULT_REGISTRY_URL =
  process.env.BLOKTASTIC_REGISTRY_URL || 'https://raw.githubusercontent.com/bartundmett/bloktastic/main/registry';

export function log(message: string): void {
  console.log(message);
}

export function success(message: string): void {
  console.log(chalk.green('✓'), message);
}

export function warning(message: string): void {
  console.log(chalk.yellow('⚠'), message);
}

export function info(message: string): void {
  console.log(chalk.blue('ℹ'), message);
}

export function error(message: string): void {
  console.error(chalk.red('✗'), message);
}

export function spinner(text: string): Ora {
  return ora({ text, color: 'cyan' });
}

export function parsePackageName(name: string): { namespace: string; packageName: string } | null {
  const match = name.match(/^@([a-z0-9-]+)\/([a-z0-9-]+)$/);
  if (!match) return null;
  return { namespace: match[1], packageName: match[2] };
}

export function formatPackageName(namespace: string, packageName: string): string {
  const cleanNamespace = namespace.replace(/^@/, '');
  return `@${cleanNamespace}/${packageName}`;
}

export function toPascalCase(input: string): string {
  return input
    .split('-')
    .filter(Boolean)
    .map((word) => `${word[0]?.toUpperCase() || ''}${word.slice(1)}`)
    .join('');
}

export function formatDate(date = new Date()): string {
  return date.toISOString().split('T')[0];
}

export async function pathExists(target: string): Promise<boolean> {
  try {
    await fs.access(target);
    return true;
  } catch {
    return false;
  }
}

export async function findUpwards(startDir: string, relativeTarget: string): Promise<string | null> {
  let current = path.resolve(startDir);

  while (true) {
    const candidate = path.join(current, relativeTarget);
    if (await pathExists(candidate)) return candidate;

    const parent = path.dirname(current);
    if (parent === current) break;
    current = parent;
  }

  return null;
}
