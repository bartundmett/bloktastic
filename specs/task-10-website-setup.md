# Task 10: Website Setup (Astro)

## Ziel
Erstelle das Grundgerüst der Bloktastic Website mit Astro.

## Voraussetzungen
- Task 9 abgeschlossen (GitHub Actions)

## Tech Stack

- **Framework:** Astro 4.x
- **Styling:** Tailwind CSS
- **UI Components:** Custom (shadcn-inspired)
- **Syntax Highlighting:** Shiki
- **Search:** Client-side (Fuse.js)

## Website-Struktur

```
packages/website/
├── src/
│   ├── components/
│   │   ├── Header.astro
│   │   ├── Footer.astro
│   │   ├── Search.astro
│   │   ├── PackageCard.astro
│   │   ├── CodeBlock.astro
│   │   └── ui/
│   │       ├── Button.astro
│   │       ├── Badge.astro
│   │       └── Card.astro
│   ├── layouts/
│   │   ├── BaseLayout.astro
│   │   ├── DocsLayout.astro
│   │   └── PackageLayout.astro
│   ├── pages/
│   │   ├── index.astro           # Homepage
│   │   ├── components/
│   │   │   ├── index.astro       # Component Browser
│   │   │   └── [...slug].astro   # Component Detail
│   │   ├── plugins/
│   │   │   └── index.astro       # Plugin Browser
│   │   └── docs/
│   │       ├── index.astro       # Docs Index
│   │       ├── getting-started.astro
│   │       ├── cli.astro
│   │       └── contributing.astro
│   ├── styles/
│   │   └── global.css
│   └── lib/
│       ├── registry.ts           # Registry data loader
│       └── utils.ts
├── public/
│   ├── favicon.svg
│   └── og-image.png
├── astro.config.mjs
├── tailwind.config.mjs
├── package.json
└── tsconfig.json
```

## Zu erstellende Dateien

### `/packages/website/package.json`

```json
{
  "name": "website",
  "type": "module",
  "version": "0.1.0",
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview"
  },
  "dependencies": {
    "astro": "^4.5.0",
    "@astrojs/tailwind": "^5.1.0",
    "tailwindcss": "^3.4.0",
    "fuse.js": "^7.0.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "typescript": "^5.3.0"
  }
}
```

### `/packages/website/astro.config.mjs`

```javascript
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://bloktastic.dev',
  integrations: [tailwind()],
  output: 'static',
  build: {
    assets: '_assets',
  },
});
```

### `/packages/website/tailwind.config.mjs`

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
          950: '#082f49',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
    },
  },
  plugins: [],
};
```

### `/packages/website/src/styles/global.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --border: 214.3 31.8% 91.4%;
    --ring: 222.2 84% 4.9%;
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
    --border: 217.2 32.6% 17.5%;
    --ring: 212.7 26.8% 83.9%;
  }

  body {
    @apply bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-100;
    font-feature-settings: "rlig" 1, "calt" 1;
  }
}

@layer utilities {
  .text-balance {
    text-wrap: balance;
  }
}
```

### `/packages/website/src/layouts/BaseLayout.astro`

```astro
---
import Header from '../components/Header.astro';
import Footer from '../components/Footer.astro';
import '../styles/global.css';

interface Props {
  title: string;
  description?: string;
}

const { title, description = 'Community Registry for Storyblok Components' } = Astro.props;
---

<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content={description} />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <title>{title} | Bloktastic</title>

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
      rel="stylesheet"
    />

    <!-- Open Graph -->
    <meta property="og:title" content={`${title} | Bloktastic`} />
    <meta property="og:description" content={description} />
    <meta property="og:image" content="/og-image.png" />
    <meta property="og:type" content="website" />

    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image" />
  </head>
  <body class="min-h-screen flex flex-col">
    <Header />
    <main class="flex-1">
      <slot />
    </main>
    <Footer />
  </body>
</html>
```

### `/packages/website/src/components/Header.astro`

```astro
---
const navItems = [
  { href: '/components', label: 'Components' },
  { href: '/plugins', label: 'Plugins' },
  { href: '/docs', label: 'Docs' },
];
---

<header class="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur dark:border-gray-800 dark:bg-gray-950/80">
  <div class="container mx-auto flex h-16 items-center justify-between px-4">
    <!-- Logo -->
    <a href="/" class="flex items-center gap-2 font-bold text-xl">
      <span class="text-brand-600">Bloktastic</span>
    </a>

    <!-- Navigation -->
    <nav class="hidden md:flex items-center gap-6">
      {navItems.map(({ href, label }) => (
        <a
          href={href}
          class="text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
        >
          {label}
        </a>
      ))}
    </nav>

    <!-- Actions -->
    <div class="flex items-center gap-4">
      <a
        href="https://github.com/bloktastic/bloktastic"
        target="_blank"
        rel="noopener"
        class="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
      >
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
        </svg>
      </a>
    </div>
  </div>
</header>
```

### `/packages/website/src/components/Footer.astro`

```astro
---
const currentYear = new Date().getFullYear();
---

<footer class="border-t border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900">
  <div class="container mx-auto px-4 py-8">
    <div class="flex flex-col md:flex-row items-center justify-between gap-4">
      <p class="text-sm text-gray-600 dark:text-gray-400">
        © {currentYear} Bloktastic. MIT License.
      </p>
      <p class="text-sm text-gray-500 dark:text-gray-500">
        Community project, not affiliated with Storyblok GmbH.
      </p>
    </div>
  </div>
</footer>
```

### `/packages/website/src/lib/registry.ts`

```typescript
import registryData from '../../../registry/registry.json';

export interface PackageEntry {
  name: string;
  path: string;
  version: string;
  title: string;
  tags?: string[];
  category?: string;
  status?: string;
  includes?: string[];
}

export interface Registry {
  name: string;
  version: string;
  packages: {
    components: PackageEntry[];
    plugins: PackageEntry[];
    presets: PackageEntry[];
  };
  stats: {
    totalComponents: number;
    totalPlugins: number;
    totalPresets: number;
    lastUpdated: string;
  };
}

export function getRegistry(): Registry {
  return registryData as Registry;
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

export function getComponentBySlug(slug: string): PackageEntry | undefined {
  return getComponents().find(c => c.name === `@bloktastic/${slug}` || c.path.endsWith(`/${slug}`));
}

export function getStats() {
  return getRegistry().stats;
}
```

### `/packages/website/src/components/PackageCard.astro`

```astro
---
interface Props {
  name: string;
  title: string;
  version: string;
  category?: string;
  tags?: string[];
  status?: string;
  href: string;
}

const { name, title, version, category, tags = [], status, href } = Astro.props;
---

<a
  href={href}
  class="group block p-4 rounded-lg border border-gray-200 hover:border-brand-500 hover:shadow-md transition-all dark:border-gray-800 dark:hover:border-brand-500"
>
  <div class="flex items-start justify-between gap-2 mb-2">
    <h3 class="font-semibold text-gray-900 group-hover:text-brand-600 dark:text-gray-100">
      {name}
    </h3>
    <span class="text-xs text-gray-500 font-mono">v{version}</span>
  </div>

  <p class="text-sm text-gray-600 dark:text-gray-400 mb-3">
    {title}
  </p>

  <div class="flex flex-wrap gap-1.5">
    {category && (
      <span class="px-2 py-0.5 text-xs rounded-full bg-brand-100 text-brand-700 dark:bg-brand-900 dark:text-brand-300">
        {category}
      </span>
    )}
    {tags.slice(0, 3).map(tag => (
      <span class="px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400">
        {tag}
      </span>
    ))}
    {status === 'deprecated' && (
      <span class="px-2 py-0.5 text-xs rounded-full bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300">
        deprecated
      </span>
    )}
  </div>
</a>
```

### `/packages/website/src/pages/index.astro`

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import PackageCard from '../components/PackageCard.astro';
import { getComponents, getStats } from '../lib/registry';

const components = getComponents().slice(0, 6);
const stats = getStats();
---

<BaseLayout title="Home">
  <!-- Hero -->
  <section class="py-20 px-4">
    <div class="container mx-auto text-center max-w-3xl">
      <h1 class="text-4xl md:text-5xl font-bold mb-6 text-balance">
        Community Registry for
        <span class="text-brand-600">Storyblok Components</span>
      </h1>
      <p class="text-xl text-gray-600 dark:text-gray-400 mb-8 text-balance">
        Install pre-built component schemas and AI-powered generation prompts via CLI.
        Stop rebuilding the same components from scratch.
      </p>
      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <a
          href="/docs/getting-started"
          class="px-6 py-3 bg-brand-600 text-white rounded-lg font-medium hover:bg-brand-700 transition-colors"
        >
          Get Started
        </a>
        <a
          href="/components"
          class="px-6 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800 transition-colors"
        >
          Browse Components
        </a>
      </div>
    </div>
  </section>

  <!-- Stats -->
  <section class="py-12 bg-gray-50 dark:bg-gray-900">
    <div class="container mx-auto px-4">
      <div class="grid grid-cols-3 gap-8 max-w-2xl mx-auto text-center">
        <div>
          <div class="text-3xl font-bold text-brand-600">{stats.totalComponents}</div>
          <div class="text-sm text-gray-600 dark:text-gray-400">Components</div>
        </div>
        <div>
          <div class="text-3xl font-bold text-brand-600">{stats.totalPlugins}</div>
          <div class="text-sm text-gray-600 dark:text-gray-400">Plugins</div>
        </div>
        <div>
          <div class="text-3xl font-bold text-brand-600">{stats.totalPresets}</div>
          <div class="text-sm text-gray-600 dark:text-gray-400">Presets</div>
        </div>
      </div>
    </div>
  </section>

  <!-- Quick Install -->
  <section class="py-16 px-4">
    <div class="container mx-auto max-w-2xl">
      <h2 class="text-2xl font-bold text-center mb-8">Quick Install</h2>
      <div class="bg-gray-900 rounded-lg p-4 font-mono text-sm">
        <pre class="text-gray-300"><span class="text-gray-500"># Install CLI</span>
<span class="text-green-400">npm</span> install -g @bloktastic/cli

<span class="text-gray-500"># Initialize in your project</span>
<span class="text-green-400">bloktastic</span> init

<span class="text-gray-500"># Add a component</span>
<span class="text-green-400">bloktastic</span> add @bloktastic/hero</pre>
      </div>
    </div>
  </section>

  <!-- Featured Components -->
  <section class="py-16 px-4 bg-gray-50 dark:bg-gray-900">
    <div class="container mx-auto">
      <div class="flex items-center justify-between mb-8">
        <h2 class="text-2xl font-bold">Featured Components</h2>
        <a href="/components" class="text-brand-600 hover:text-brand-700 font-medium">
          View all →
        </a>
      </div>
      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {components.map(pkg => (
          <PackageCard
            name={pkg.name}
            title={pkg.title}
            version={pkg.version}
            category={pkg.category}
            tags={pkg.tags}
            status={pkg.status}
            href={`/components/${pkg.path.split('/').pop()}`}
          />
        ))}
      </div>
    </div>
  </section>

  <!-- How it Works -->
  <section class="py-16 px-4">
    <div class="container mx-auto max-w-4xl">
      <h2 class="text-2xl font-bold text-center mb-12">How It Works</h2>
      <div class="grid md:grid-cols-3 gap-8">
        <div class="text-center">
          <div class="w-12 h-12 bg-brand-100 rounded-full flex items-center justify-center mx-auto mb-4 text-brand-600 font-bold">
            1
          </div>
          <h3 class="font-semibold mb-2">Install Schema</h3>
          <p class="text-sm text-gray-600 dark:text-gray-400">
            CLI pushes the component schema directly to your Storyblok space.
          </p>
        </div>
        <div class="text-center">
          <div class="w-12 h-12 bg-brand-100 rounded-full flex items-center justify-center mx-auto mb-4 text-brand-600 font-bold">
            2
          </div>
          <h3 class="font-semibold mb-2">Get the Prompt</h3>
          <p class="text-sm text-gray-600 dark:text-gray-400">
            Receive a structured AI prompt describing the component's requirements.
          </p>
        </div>
        <div class="text-center">
          <div class="w-12 h-12 bg-brand-100 rounded-full flex items-center justify-center mx-auto mb-4 text-brand-600 font-bold">
            3
          </div>
          <h3 class="font-semibold mb-2">Generate Code</h3>
          <p class="text-sm text-gray-600 dark:text-gray-400">
            Use Claude, ChatGPT, or Cursor to generate code for your stack.
          </p>
        </div>
      </div>
    </div>
  </section>
</BaseLayout>
```

## Acceptance Criteria

- [ ] `pnpm dev` startet Development Server
- [ ] `pnpm build` erstellt statische Site
- [ ] Homepage zeigt Hero, Stats, Quick Install, Featured Components
- [ ] Responsive Design (Mobile, Tablet, Desktop)
- [ ] Dark Mode Support via CSS Variables
- [ ] Registry-Daten werden korrekt geladen
- [ ] Header und Footer auf allen Seiten

## Test Commands

```bash
cd packages/website
pnpm install
pnpm dev    # http://localhost:4321
pnpm build
```

## Nächster Task
→ Task 11: Website Component Browser
