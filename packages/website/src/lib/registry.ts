import fs from 'node:fs';
import path from 'node:path';

export type PackageKind = 'components' | 'plugins' | 'presets';

export interface PackageEntry {
  name: string;
  path: string;
  version: string;
  title: string;
  tags?: string[];
  category?: string | null;
  status?: string;
}

export interface RegistryData {
  name: string;
  version: string;
  homepage: string;
  repository: string;
  packages: {
    components: PackageEntry[];
    plugins: PackageEntry[];
    presets: PackageEntry[];
  };
  categories: {
    components: string[];
    plugins: string[];
  };
  stats: {
    totalComponents: number;
    totalPlugins: number;
    totalPresets: number;
    lastUpdated: string;
  };
}

export interface PackageDetails {
  manifest: Record<string, unknown> | null;
  schema: Record<string, unknown> | null;
  prompt: string | null;
  readme: string | null;
}

let cache: RegistryData | null = null;

function getWorkspaceRoot(): string {
  return path.resolve(process.cwd(), '../..');
}

function readJson(filePath: string): any {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

export function getRegistry(): RegistryData {
  if (cache) return cache;
  const registryPath = path.join(getWorkspaceRoot(), 'registry', 'registry.json');
  cache = readJson(registryPath) as RegistryData;
  return cache;
}

export function getComponents(): PackageEntry[] {
  return getRegistry().packages.components;
}

export function getPlugins(): PackageEntry[] {
  return getRegistry().packages.plugins;
}

export function getPresets(): PackageEntry[] {
  return getRegistry().packages.presets;
}

export function getStats(): RegistryData['stats'] {
  return getRegistry().stats;
}

export function getPackageBySlug(kind: PackageKind, slug: string): PackageEntry | undefined {
  const list = getRegistry().packages[kind];
  return list.find((pkg) => pkg.path.endsWith(`/${slug}`) || pkg.name.endsWith(`/${slug}`));
}

export function getPackageDetails(pkgPath: string): PackageDetails {
  const absPath = path.join(getWorkspaceRoot(), 'registry', pkgPath);

  const readOptionalJson = (name: string): Record<string, unknown> | null => {
    const file = path.join(absPath, name);
    if (!fs.existsSync(file)) return null;
    try {
      return readJson(file);
    } catch {
      return null;
    }
  };

  const readOptionalText = (name: string): string | null => {
    const file = path.join(absPath, name);
    if (!fs.existsSync(file)) return null;
    return fs.readFileSync(file, 'utf8');
  };

  return {
    manifest: readOptionalJson('bloktastic.json'),
    schema: readOptionalJson('schema.json'),
    prompt: readOptionalText('prompt.md'),
    readme: readOptionalText('README.md')
  };
}

export function extractSlug(entryPath: string): string {
  return entryPath.split('/').pop() ?? entryPath;
}
