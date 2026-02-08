import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export type PackageKind = 'components' | 'plugins' | 'presets';
export const PLUGIN_CATEGORY_ORDER = ['space-plugins', 'tool-plugins', 'field-plugins'] as const;
export type PluginCategory = (typeof PLUGIN_CATEGORY_ORDER)[number];

export interface PackageEntry {
  name: string;
  path: string;
  version: string;
  title: string;
  description?: string;
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

let workspaceRootCache: string | null = null;

function hasRegistryRoot(dir: string): boolean {
  return fs.existsSync(path.join(dir, 'registry', 'registry.json'));
}

function findWorkspaceRoot(start: string): string | null {
  let current = path.resolve(start);

  while (true) {
    if (hasRegistryRoot(current)) return current;
    const parent = path.dirname(current);
    if (parent === current) return null;
    current = parent;
  }
}

function getWorkspaceRoot(): string {
  if (workspaceRootCache) return workspaceRootCache;

  const fromCwd = findWorkspaceRoot(process.cwd());
  if (fromCwd) {
    workspaceRootCache = fromCwd;
    return workspaceRootCache;
  }

  const moduleDir = path.dirname(fileURLToPath(import.meta.url));
  const fromModule = findWorkspaceRoot(moduleDir);
  if (fromModule) {
    workspaceRootCache = fromModule;
    return workspaceRootCache;
  }

  throw new Error('Unable to locate workspace root containing registry/registry.json');
}

function readJson(filePath: string): any {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

export function getRegistry(): RegistryData {
  const registryPath = path.join(getWorkspaceRoot(), 'registry', 'registry.json');
  return readJson(registryPath) as RegistryData;
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

const CATEGORY_LABELS: Record<string, string> = {
  sections: 'Sections',
  content: 'Content',
  navigation: 'Navigation',
  forms: 'Forms',
  media: 'Media',
  layout: 'Layout',
  commerce: 'Commerce',
  'field-plugins': 'Field Plugin',
  'tool-plugins': 'Tool Plugin',
  'space-plugins': 'Space Plugin'
};

export function formatCategoryLabel(category?: string | null): string {
  if (!category) return 'Uncategorized';
  return CATEGORY_LABELS[category] ?? category.replace(/-/g, ' ').replace(/\b\w/g, (m) => m.toUpperCase());
}

export function pluginCategoryDescription(category: PluginCategory): string {
  switch (category) {
    case 'space-plugins':
      return 'Workspace-wide assistants and quality tooling for editors and admins.';
    case 'tool-plugins':
      return 'Operational integrations and workflow automation for content operations.';
    case 'field-plugins':
      return 'Custom field inputs embedded directly in Storyblok schemas.';
  }
}
