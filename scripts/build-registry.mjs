import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const packageKinds = ['components', 'plugins', 'presets'];

async function pathExists(target) {
  try {
    await fs.access(target);
    return true;
  } catch {
    return false;
  }
}

async function findWorkspaceRoot(start) {
  let current = path.resolve(start);

  while (true) {
    const registryDir = path.join(current, 'registry');
    if (await pathExists(path.join(registryDir, 'components'))) {
      return current;
    }

    const parent = path.dirname(current);
    if (parent === current) return null;
    current = parent;
  }
}

async function readJson(filePath) {
  const data = await fs.readFile(filePath, 'utf8');
  return JSON.parse(data);
}

async function readEntries(kind) {
  const root = await resolveRoot();
  const registryRoot = path.join(root, 'registry');
  const kindDir = path.join(registryRoot, kind);
  let names = [];
  try {
    names = await fs.readdir(kindDir);
  } catch {
    return [];
  }

  const dirs = names.sort();
  const entries = [];

  for (const dirName of dirs) {
    const manifestPath = path.join(kindDir, dirName, 'bloktastic.json');
    try {
      const manifest = await readJson(manifestPath);
      const description = typeof manifest.description === 'string' ? manifest.description.trim() : '';
      entries.push({
        name: manifest.name,
        path: `${kind}/${dirName}`,
        version: manifest.version,
        title: manifest.title,
        description: description || undefined,
        tags: manifest.tags ?? [],
        category: manifest.category ?? null,
        status: manifest.metadata?.status ?? 'stable'
      });
    } catch {
      // Skip invalid/incomplete directories.
    }
  }

  return entries;
}

let resolvedRoot = null;

async function resolveRoot() {
  if (resolvedRoot) return resolvedRoot;

  const cwdRoot = await findWorkspaceRoot(process.cwd());
  if (cwdRoot) {
    resolvedRoot = cwdRoot;
    return resolvedRoot;
  }

  const scriptDir = path.dirname(fileURLToPath(import.meta.url));
  const scriptRoot = await findWorkspaceRoot(scriptDir);
  if (scriptRoot) {
    resolvedRoot = scriptRoot;
    return resolvedRoot;
  }

  throw new Error('Unable to locate workspace root with registry directory.');
}

async function main() {
  const root = await resolveRoot();
  const registryRoot = path.join(root, 'registry');

  const [components, plugins, presets] = await Promise.all(
    packageKinds.map((kind) => readEntries(kind))
  );

  const registry = {
    $schema: 'https://bloktastic.com/schema/registry.schema.json',
    name: 'bloktastic',
    version: '1.0.0',
    homepage: 'https://bloktastic.com',
    repository: 'https://github.com/bloktastic/bloktastic',
    packages: {
      components,
      plugins,
      presets
    },
    categories: {
      components: ['sections', 'content', 'navigation', 'forms', 'media', 'layout', 'commerce'],
      plugins: ['field-plugins', 'tool-plugins', 'space-plugins']
    },
    stats: {
      totalComponents: components.length,
      totalPlugins: plugins.length,
      totalPresets: presets.length,
      lastUpdated: new Date().toISOString()
    }
  };

  const target = path.join(registryRoot, 'registry.json');
  await fs.writeFile(target, `${JSON.stringify(registry, null, 2)}\n`, 'utf8');
  console.log(`Registry rebuilt: ${target}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
