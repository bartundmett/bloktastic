# Task 11: Website Component Browser & Detail Pages

## Ziel
Erstelle den Component Browser und die Detail-Seiten für einzelne Packages.

## Voraussetzungen
- Task 10 abgeschlossen (Website Setup)

## Seiten zu erstellen

### 1. Component Browser (`/components`)
### 2. Component Detail (`/components/[slug]`)
### 3. Plugin Browser (`/plugins`)

---

## Component Browser

### `/packages/website/src/pages/components/index.astro`

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import PackageCard from '../../components/PackageCard.astro';
import { getComponents } from '../../lib/registry';

const components = getComponents();

// Group by category
const byCategory = components.reduce((acc, pkg) => {
  const cat = pkg.category || 'uncategorized';
  if (!acc[cat]) acc[cat] = [];
  acc[cat].push(pkg);
  return acc;
}, {} as Record<string, typeof components>);

const categories = Object.keys(byCategory).sort();
---

<BaseLayout title="Components" description="Browse all Storyblok components in the Bloktastic registry">
  <div class="container mx-auto px-4 py-12">
    <!-- Header -->
    <div class="max-w-2xl mb-12">
      <h1 class="text-3xl font-bold mb-4">Components</h1>
      <p class="text-gray-600 dark:text-gray-400">
        Pre-built Storyblok component schemas with AI-powered generation prompts.
        Install any component with a single CLI command.
      </p>
    </div>

    <!-- Search & Filters -->
    <div class="mb-8 flex flex-col sm:flex-row gap-4">
      <div class="relative flex-1 max-w-md">
        <input
          type="text"
          id="search-input"
          placeholder="Search components..."
          class="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 dark:bg-gray-800 dark:border-gray-700"
        />
        <svg class="absolute left-3 top-2.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      <select
        id="category-filter"
        class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 dark:bg-gray-800 dark:border-gray-700"
      >
        <option value="">All Categories</option>
        {categories.map(cat => (
          <option value={cat}>{cat}</option>
        ))}
      </select>
    </div>

    <!-- Components Grid -->
    <div id="components-container">
      {categories.map(category => (
        <section class="mb-12 category-section" data-category={category}>
          <h2 class="text-xl font-semibold mb-4 capitalize">{category}</h2>
          <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {byCategory[category].map(pkg => (
              <div class="component-card" data-name={pkg.name} data-title={pkg.title} data-tags={pkg.tags?.join(' ')}>
                <PackageCard
                  name={pkg.name}
                  title={pkg.title}
                  version={pkg.version}
                  category={pkg.category}
                  tags={pkg.tags}
                  status={pkg.status}
                  href={`/components/${pkg.path.split('/').pop()}`}
                />
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>

    <!-- Empty State -->
    <div id="empty-state" class="hidden text-center py-12">
      <p class="text-gray-500 dark:text-gray-400">No components found matching your search.</p>
    </div>
  </div>

  <script>
    const searchInput = document.getElementById('search-input') as HTMLInputElement;
    const categoryFilter = document.getElementById('category-filter') as HTMLSelectElement;
    const container = document.getElementById('components-container');
    const emptyState = document.getElementById('empty-state');
    const sections = document.querySelectorAll('.category-section');
    const cards = document.querySelectorAll('.component-card');

    function filterComponents() {
      const query = searchInput.value.toLowerCase();
      const category = categoryFilter.value;
      let visibleCount = 0;

      sections.forEach(section => {
        const sectionCategory = section.getAttribute('data-category');
        const shouldShowSection = !category || category === sectionCategory;

        if (!shouldShowSection) {
          section.classList.add('hidden');
          return;
        }

        section.classList.remove('hidden');
        let sectionVisible = false;

        section.querySelectorAll('.component-card').forEach(card => {
          const name = card.getAttribute('data-name')?.toLowerCase() || '';
          const title = card.getAttribute('data-title')?.toLowerCase() || '';
          const tags = card.getAttribute('data-tags')?.toLowerCase() || '';

          const matchesQuery = !query ||
            name.includes(query) ||
            title.includes(query) ||
            tags.includes(query);

          if (matchesQuery) {
            (card as HTMLElement).style.display = 'block';
            sectionVisible = true;
            visibleCount++;
          } else {
            (card as HTMLElement).style.display = 'none';
          }
        });

        if (!sectionVisible) {
          section.classList.add('hidden');
        }
      });

      emptyState?.classList.toggle('hidden', visibleCount > 0);
    }

    searchInput?.addEventListener('input', filterComponents);
    categoryFilter?.addEventListener('change', filterComponents);
  </script>
</BaseLayout>
```

---

## Component Detail Page

### `/packages/website/src/pages/components/[...slug].astro`

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import { getComponents, getComponentBySlug } from '../../lib/registry';
import fs from 'fs/promises';
import path from 'path';

export async function getStaticPaths() {
  const components = getComponents();

  return components.map(pkg => ({
    params: { slug: pkg.path.split('/').pop() },
    props: { pkg },
  }));
}

const { pkg } = Astro.props;
const slug = pkg.path.split('/').pop();

// Load package files from registry
const registryPath = path.join(process.cwd(), '..', 'registry', pkg.path);

let manifest, schema, prompt, readme;

try {
  manifest = JSON.parse(await fs.readFile(path.join(registryPath, 'bloktastic.json'), 'utf-8'));
} catch (e) {
  manifest = null;
}

try {
  schema = JSON.parse(await fs.readFile(path.join(registryPath, 'schema.json'), 'utf-8'));
} catch (e) {
  schema = null;
}

try {
  prompt = await fs.readFile(path.join(registryPath, 'prompt.md'), 'utf-8');
} catch (e) {
  prompt = null;
}

try {
  readme = await fs.readFile(path.join(registryPath, 'README.md'), 'utf-8');
} catch (e) {
  readme = null;
}
---

<BaseLayout title={pkg.title} description={manifest?.description}>
  <div class="container mx-auto px-4 py-12">
    <!-- Breadcrumb -->
    <nav class="text-sm mb-8">
      <a href="/components" class="text-gray-500 hover:text-gray-700 dark:text-gray-400">Components</a>
      <span class="mx-2 text-gray-400">/</span>
      <span class="text-gray-900 dark:text-gray-100">{pkg.name}</span>
    </nav>

    <!-- Header -->
    <header class="mb-8">
      <div class="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 class="text-3xl font-bold mb-2">{pkg.title}</h1>
          <p class="text-gray-600 dark:text-gray-400 mb-4">{manifest?.description}</p>
          <div class="flex flex-wrap gap-2">
            {pkg.category && (
              <span class="px-3 py-1 text-sm rounded-full bg-brand-100 text-brand-700 dark:bg-brand-900 dark:text-brand-300">
                {pkg.category}
              </span>
            )}
            {pkg.tags?.map(tag => (
              <span class="px-3 py-1 text-sm rounded-full bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                {tag}
              </span>
            ))}
          </div>
        </div>
        <div class="text-right">
          <div class="text-sm text-gray-500 mb-1">Version</div>
          <div class="font-mono">{pkg.version}</div>
        </div>
      </div>
    </header>

    <!-- Quick Install -->
    <section class="mb-8 p-4 bg-gray-50 rounded-lg dark:bg-gray-900">
      <div class="flex items-center justify-between gap-4">
        <code class="font-mono text-sm text-brand-600">
          bloktastic add {pkg.name}
        </code>
        <button
          id="copy-install"
          class="px-3 py-1 text-sm bg-brand-600 text-white rounded hover:bg-brand-700 transition-colors"
          data-command={`bloktastic add ${pkg.name}`}
        >
          Copy
        </button>
      </div>
    </section>

    <!-- Main Content Grid -->
    <div class="grid lg:grid-cols-3 gap-8">
      <!-- Left Column (2/3) -->
      <div class="lg:col-span-2 space-y-8">
        <!-- Schema Preview -->
        {schema && (
          <section>
            <h2 class="text-xl font-semibold mb-4">Storyblok Schema</h2>
            <div class="bg-gray-900 rounded-lg p-4 overflow-x-auto">
              <pre class="text-sm text-gray-300 font-mono">{JSON.stringify(schema, null, 2)}</pre>
            </div>
            <button
              id="copy-schema"
              class="mt-2 text-sm text-brand-600 hover:text-brand-700"
              data-content={JSON.stringify(schema, null, 2)}
            >
              Copy Schema
            </button>
          </section>
        )}

        <!-- Prompt Preview -->
        {prompt && (
          <section>
            <h2 class="text-xl font-semibold mb-4">AI Generation Prompt</h2>
            <div class="bg-gray-50 border rounded-lg p-4 dark:bg-gray-900 dark:border-gray-800">
              <pre class="text-sm whitespace-pre-wrap">{prompt}</pre>
            </div>
            <button
              id="copy-prompt"
              class="mt-2 text-sm text-brand-600 hover:text-brand-700"
              data-content={prompt}
            >
              Copy Prompt
            </button>
          </section>
        )}
      </div>

      <!-- Right Column (1/3) - Sidebar -->
      <aside class="space-y-6">
        <!-- Package Info -->
        <section class="p-4 border rounded-lg dark:border-gray-800">
          <h3 class="font-semibold mb-4">Package Info</h3>
          <dl class="space-y-3 text-sm">
            <div>
              <dt class="text-gray-500 dark:text-gray-400">Author</dt>
              <dd>
                <a
                  href={`https://github.com/${manifest?.author?.github}`}
                  target="_blank"
                  class="text-brand-600 hover:underline"
                >
                  @{manifest?.author?.github}
                </a>
              </dd>
            </div>
            <div>
              <dt class="text-gray-500 dark:text-gray-400">Storyblok</dt>
              <dd class="font-mono">{manifest?.compatibility?.storyblok || '>=2.0.0'}</dd>
            </div>
            <div>
              <dt class="text-gray-500 dark:text-gray-400">Frameworks</dt>
              <dd>{manifest?.compatibility?.frameworks?.join(', ') || 'All'}</dd>
            </div>
            <div>
              <dt class="text-gray-500 dark:text-gray-400">Status</dt>
              <dd class="capitalize">{manifest?.metadata?.status || 'stable'}</dd>
            </div>
          </dl>
        </section>

        <!-- Dependencies -->
        {manifest?.dependencies?.bloktastic?.length > 0 && (
          <section class="p-4 border rounded-lg dark:border-gray-800">
            <h3 class="font-semibold mb-4">Dependencies</h3>
            <ul class="space-y-2 text-sm">
              {manifest.dependencies.bloktastic.map(dep => (
                <li>
                  <a href={`/components/${dep.split('/').pop()}`} class="text-brand-600 hover:underline">
                    {dep}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}

        <!-- Schema Fields -->
        {schema?.schema && (
          <section class="p-4 border rounded-lg dark:border-gray-800">
            <h3 class="font-semibold mb-4">Fields</h3>
            <ul class="space-y-2 text-sm">
              {Object.entries(schema.schema).map(([name, field]: [string, any]) => (
                <li class="flex justify-between">
                  <code class="text-brand-600">{name}</code>
                  <span class="text-gray-500">{field.type}</span>
                </li>
              ))}
            </ul>
          </section>
        )}
      </aside>
    </div>
  </div>

  <script>
    // Copy functionality
    document.querySelectorAll('[id^="copy-"]').forEach(btn => {
      btn.addEventListener('click', async () => {
        const content = btn.getAttribute('data-content') || btn.getAttribute('data-command');
        if (content) {
          await navigator.clipboard.writeText(content);
          const originalText = btn.textContent;
          btn.textContent = 'Copied!';
          setTimeout(() => {
            btn.textContent = originalText;
          }, 2000);
        }
      });
    });
  </script>
</BaseLayout>
```

---

## Plugin Browser

### `/packages/website/src/pages/plugins/index.astro`

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import { getPlugins } from '../../lib/registry';

const plugins = getPlugins();
---

<BaseLayout title="Plugins" description="Curated Storyblok plugins from the community">
  <div class="container mx-auto px-4 py-12">
    <div class="max-w-2xl mb-12">
      <h1 class="text-3xl font-bold mb-4">Plugins</h1>
      <p class="text-gray-600 dark:text-gray-400">
        Curated list of community Storyblok plugins. These are external plugins
        maintained by their respective authors.
      </p>
    </div>

    {plugins.length === 0 ? (
      <div class="text-center py-12 text-gray-500">
        No plugins listed yet. Check back soon!
      </div>
    ) : (
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {plugins.map(plugin => (
          <div class="p-4 border rounded-lg dark:border-gray-800">
            <h3 class="font-semibold mb-2">{plugin.title}</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-3">
              {plugin.name}
            </p>
            <div class="flex items-center gap-2">
              <span class={`px-2 py-0.5 text-xs rounded-full ${
                plugin.status === 'maintained'
                  ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                  : plugin.status === 'deprecated'
                  ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                  : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
              }`}>
                {plugin.status || 'unknown'}
              </span>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
</BaseLayout>
```

---

## Acceptance Criteria

### Component Browser
- [ ] Zeigt alle Components gruppiert nach Kategorie
- [ ] Such-Funktion filtert Components
- [ ] Kategorie-Filter funktioniert
- [ ] Empty State bei keinen Ergebnissen
- [ ] Links führen zu Detail-Seiten

### Component Detail
- [ ] Zeigt Package-Informationen
- [ ] Quick Install Command mit Copy-Button
- [ ] Schema-Preview mit Syntax-Highlighting
- [ ] Prompt-Preview
- [ ] Copy-Buttons funktionieren
- [ ] Dependencies verlinkt
- [ ] Field-Liste aus Schema extrahiert

### Plugin Browser
- [ ] Zeigt alle Plugins
- [ ] Status-Badge (maintained/deprecated)

## Test Commands

```bash
cd packages/website
pnpm dev
# Besuche http://localhost:4321/components
# Besuche http://localhost:4321/components/hero
# Besuche http://localhost:4321/plugins
```

## Nächster Task
→ Task 12: Website Documentation
