import { promises as fs } from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const registryRoot = path.join(root, 'registry');
const packageKinds = ['components', 'plugins', 'presets'];

async function readJson(filePath) {
  const data = await fs.readFile(filePath, 'utf8');
  return JSON.parse(data);
}

async function readEntries(kind) {
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
      entries.push({
        name: manifest.name,
        path: `${kind}/${dirName}`,
        version: manifest.version,
        title: manifest.title,
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

async function main() {
  const [components, plugins, presets] = await Promise.all(
    packageKinds.map((kind) => readEntries(kind))
  );

  const registry = {
    $schema: 'https://bloktastic.dev/schema/registry.schema.json',
    name: 'bloktastic',
    version: '1.0.0',
    homepage: 'https://bloktastic.dev',
    repository: 'https://github.com/bloktastic/bloktastic',
    packages: {
      components,
      plugins,
      presets
    },
    categories: {
      components: ['sections', 'content', 'navigation', 'forms', 'media', 'layout', 'commerce'],
      plugins: ['field-plugins', 'tool-plugins', 'sidebar-plugins']
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
