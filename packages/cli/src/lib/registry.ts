import fs from 'node:fs/promises';
import path from 'node:path';
import {
  type PackageEntry,
  type PackageManifest,
  type PackageType,
  type RegistryData,
  type RegistryPackage
} from '../types/index.js';
import { DEFAULT_REGISTRY_URL, findUpwards, pathExists } from './utils.js';

interface LocalSource {
  type: 'local';
  registryRoot: string;
}

interface RemoteSource {
  type: 'remote';
  baseUrl: string;
}

type RegistrySource = LocalSource | RemoteSource;

let sourceCache: RegistrySource | null = null;
let registryCache: RegistryData | null = null;

async function resolveRegistrySource(): Promise<RegistrySource> {
  if (sourceCache) return sourceCache;

  const envPath = process.env.BLOKTASTIC_REGISTRY_PATH;
  if (envPath) {
    const absolute = path.resolve(envPath);
    if (await pathExists(path.join(absolute, 'registry.json'))) {
      sourceCache = { type: 'local', registryRoot: absolute };
      return sourceCache;
    }
  }

  const localRegistryFile = await findUpwards(process.cwd(), path.join('registry', 'registry.json'));
  if (localRegistryFile) {
    sourceCache = {
      type: 'local',
      registryRoot: path.dirname(localRegistryFile)
    };
    return sourceCache;
  }

  sourceCache = {
    type: 'remote',
    baseUrl: DEFAULT_REGISTRY_URL
  };
  return sourceCache;
}

async function fetchJson<T>(sourcePath: string): Promise<T> {
  const source = await resolveRegistrySource();

  if (source.type === 'local') {
    const absolutePath = path.join(source.registryRoot, sourcePath);
    const raw = await fs.readFile(absolutePath, 'utf8');
    return JSON.parse(raw) as T;
  }

  const url = `${source.baseUrl}/${sourcePath}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed fetching ${url}: ${response.status} ${response.statusText}`);
  }
  return (await response.json()) as T;
}

async function fetchText(sourcePath: string): Promise<string> {
  const source = await resolveRegistrySource();

  if (source.type === 'local') {
    const absolutePath = path.join(source.registryRoot, sourcePath);
    return fs.readFile(absolutePath, 'utf8');
  }

  const url = `${source.baseUrl}/${sourcePath}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed fetching ${url}: ${response.status} ${response.statusText}`);
  }
  return response.text();
}

export async function fetchRegistry(force = false): Promise<RegistryData> {
  if (registryCache && !force) return registryCache;
  registryCache = await fetchJson<RegistryData>('registry.json');
  return registryCache;
}

export async function fetchPackageManifest(packagePath: string): Promise<PackageManifest> {
  return fetchJson<PackageManifest>(`${packagePath}/bloktastic.json`);
}

export async function fetchPackageSchema(packagePath: string): Promise<Record<string, unknown>> {
  return fetchJson<Record<string, unknown>>(`${packagePath}/schema.json`);
}

export async function fetchPackagePrompt(packagePath: string): Promise<string> {
  return fetchText(`${packagePath}/prompt.md`);
}

export async function fetchPackageReadme(packagePath: string): Promise<string> {
  return fetchText(`${packagePath}/README.md`);
}

export async function findPackage(name: string): Promise<PackageEntry | null> {
  const registry = await fetchRegistry();
  const all = [
    ...registry.packages.components,
    ...registry.packages.plugins,
    ...registry.packages.presets
  ];
  return all.find((item) => item.name === name) ?? null;
}

export async function getAllPackages(type?: PackageType): Promise<RegistryPackage[]> {
  const registry = await fetchRegistry();
  const list: RegistryPackage[] = [];

  if (!type || type === 'component') {
    list.push(...registry.packages.components.map((item) => ({ ...item, _type: 'component' as const })));
  }
  if (!type || type === 'plugin') {
    list.push(...registry.packages.plugins.map((item) => ({ ...item, _type: 'plugin' as const })));
  }
  if (!type || type === 'preset') {
    list.push(...registry.packages.presets.map((item) => ({ ...item, _type: 'preset' as const })));
  }

  return list;
}

export async function searchPackages(
  query: string,
  options?: { type?: PackageType; category?: string; tag?: string }
): Promise<RegistryPackage[]> {
  const normalizedQuery = query.toLowerCase();
  const all = await getAllPackages(options?.type);

  return all.filter((item) => {
    const queryMatches =
      item.name.toLowerCase().includes(normalizedQuery) ||
      item.title.toLowerCase().includes(normalizedQuery) ||
      (item.tags ?? []).some((tag) => tag.toLowerCase().includes(normalizedQuery));

    if (!queryMatches) return false;
    if (options?.category && item.category !== options.category) return false;
    if (options?.tag && !(item.tags ?? []).includes(options.tag)) return false;
    return true;
  });
}

export async function hasLocalRegistry(): Promise<boolean> {
  const source = await resolveRegistrySource();
  return source.type === 'local';
}
