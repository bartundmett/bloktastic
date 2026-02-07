import fs from 'node:fs/promises';
import path from 'node:path';
import { type BloktasticConfig, type InstalledPackage } from '../types/index.js';
import { CONFIG_FILE, pathExists } from './utils.js';

export function getConfigPath(dir = process.cwd()): string {
  return path.join(dir, CONFIG_FILE);
}

export async function configExists(dir = process.cwd()): Promise<boolean> {
  return pathExists(getConfigPath(dir));
}

export async function loadConfig(dir = process.cwd()): Promise<BloktasticConfig | null> {
  const configPath = getConfigPath(dir);
  if (!(await pathExists(configPath))) return null;

  const raw = await fs.readFile(configPath, 'utf8');
  return JSON.parse(raw) as BloktasticConfig;
}

export async function saveConfig(config: BloktasticConfig, dir = process.cwd()): Promise<void> {
  const configPath = getConfigPath(dir);
  await fs.writeFile(configPath, `${JSON.stringify(config, null, 2)}\n`, 'utf8');
}

export async function addInstalledPackage(pkg: InstalledPackage, dir = process.cwd()): Promise<void> {
  const config = await loadConfig(dir);
  if (!config) return;

  const installed = config.installedPackages ?? [];
  const deduped = installed.filter((item) => item.name !== pkg.name);
  deduped.push(pkg);

  config.installedPackages = deduped.sort((a, b) => a.name.localeCompare(b.name));
  await saveConfig(config, dir);
}
