# Task 12: Website Documentation Section

## Ziel
Erstelle die Documentation-Seiten für Bloktastic.

## Voraussetzungen
- Task 11 abgeschlossen (Component Browser)

## Dokumentations-Seiten

### 1. Docs Index
### 2. Getting Started
### 3. CLI Reference
### 4. Contributing Guide

---

## Docs Layout

### `/packages/website/src/layouts/DocsLayout.astro`

```astro
---
import BaseLayout from './BaseLayout.astro';

interface Props {
  title: string;
  description?: string;
}

const { title, description } = Astro.props;

const navItems = [
  { href: '/docs', label: 'Overview' },
  { href: '/docs/getting-started', label: 'Getting Started' },
  { href: '/docs/cli', label: 'CLI Reference' },
  { href: '/docs/contributing', label: 'Contributing' },
];

const currentPath = Astro.url.pathname;
---

<BaseLayout title={title} description={description}>
  <div class="container mx-auto px-4 py-12">
    <div class="grid lg:grid-cols-4 gap-8">
      <!-- Sidebar -->
      <aside class="lg:col-span-1">
        <nav class="sticky top-24">
          <h3 class="font-semibold mb-4 text-sm uppercase tracking-wider text-gray-500">
            Documentation
          </h3>
          <ul class="space-y-2">
            {navItems.map(item => (
              <li>
                <a
                  href={item.href}
                  class={`block px-3 py-2 rounded-lg text-sm ${
                    currentPath === item.href
                      ? 'bg-brand-50 text-brand-700 font-medium dark:bg-brand-900/30 dark:text-brand-300'
                      : 'text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800'
                  }`}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      <!-- Main Content -->
      <main class="lg:col-span-3 prose prose-gray dark:prose-invert max-w-none">
        <slot />
      </main>
    </div>
  </div>
</BaseLayout>

<style is:global>
  .prose h1 { @apply text-3xl font-bold mb-6; }
  .prose h2 { @apply text-2xl font-semibold mt-12 mb-4; }
  .prose h3 { @apply text-xl font-semibold mt-8 mb-3; }
  .prose p { @apply mb-4 leading-relaxed; }
  .prose ul { @apply list-disc pl-6 mb-4 space-y-2; }
  .prose ol { @apply list-decimal pl-6 mb-4 space-y-2; }
  .prose code { @apply bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-sm font-mono; }
  .prose pre { @apply bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto mb-6; }
  .prose pre code { @apply bg-transparent p-0; }
  .prose a { @apply text-brand-600 hover:underline; }
  .prose table { @apply w-full border-collapse mb-6; }
  .prose th { @apply border-b border-gray-200 dark:border-gray-700 px-4 py-2 text-left font-semibold; }
  .prose td { @apply border-b border-gray-100 dark:border-gray-800 px-4 py-2; }
</style>
```

---

## Docs Index

### `/packages/website/src/pages/docs/index.astro`

```astro
---
import DocsLayout from '../../layouts/DocsLayout.astro';
---

<DocsLayout title="Documentation" description="Learn how to use Bloktastic">
  <h1>Documentation</h1>

  <p>
    Welcome to the Bloktastic documentation. Learn how to install, use, and contribute
    to the community registry for Storyblok components.
  </p>

  <h2>What is Bloktastic?</h2>

  <p>
    Bloktastic is an open-source community registry for Storyblok components. It provides:
  </p>

  <ul>
    <li><strong>Component Schemas</strong> – Ready-to-use Storyblok component definitions</li>
    <li><strong>AI-Powered Prompts</strong> – Structured prompts for generating frontend code</li>
    <li><strong>CLI Tool</strong> – Install components directly to your Storyblok space</li>
  </ul>

  <h2>Quick Links</h2>

  <div class="grid md:grid-cols-2 gap-4 not-prose">
    <a href="/docs/getting-started" class="block p-4 border rounded-lg hover:border-brand-500 transition-colors dark:border-gray-700">
      <h3 class="font-semibold mb-1">Getting Started</h3>
      <p class="text-sm text-gray-600 dark:text-gray-400">Install the CLI and add your first component</p>
    </a>
    <a href="/docs/cli" class="block p-4 border rounded-lg hover:border-brand-500 transition-colors dark:border-gray-700">
      <h3 class="font-semibold mb-1">CLI Reference</h3>
      <p class="text-sm text-gray-600 dark:text-gray-400">Complete command reference</p>
    </a>
    <a href="/docs/contributing" class="block p-4 border rounded-lg hover:border-brand-500 transition-colors dark:border-gray-700">
      <h3 class="font-semibold mb-1">Contributing</h3>
      <p class="text-sm text-gray-600 dark:text-gray-400">Add your own components to the registry</p>
    </a>
    <a href="/components" class="block p-4 border rounded-lg hover:border-brand-500 transition-colors dark:border-gray-700">
      <h3 class="font-semibold mb-1">Browse Components</h3>
      <p class="text-sm text-gray-600 dark:text-gray-400">Explore available components</p>
    </a>
  </div>

  <h2>The Prompt Approach</h2>

  <p>
    Unlike traditional component libraries that ship framework-specific code, Bloktastic uses
    a <strong>prompt-first approach</strong>:
  </p>

  <ol>
    <li><strong>Schema</strong> – The Storyblok component definition (universal)</li>
    <li><strong>Prompt</strong> – Structured instructions for AI code generation</li>
  </ol>

  <p>
    This means you get code that matches your exact stack (Vue, React, Astro, etc.) and
    coding style, generated by your preferred AI tool (Claude, ChatGPT, Cursor).
  </p>

  <h2>Community</h2>

  <p>
    Bloktastic is maintained by <a href="https://github.com/bmueller">Benedikt Müller</a> (Storyblok MVP)
    and the community. It's not affiliated with Storyblok GmbH.
  </p>

  <ul>
    <li><a href="https://github.com/bloktastic/bloktastic">GitHub Repository</a></li>
    <li><a href="https://github.com/bloktastic/bloktastic/issues">Report Issues</a></li>
    <li><a href="https://github.com/bloktastic/bloktastic/discussions">Discussions</a></li>
  </ul>
</DocsLayout>
```

---

## Getting Started

### `/packages/website/src/pages/docs/getting-started.astro`

```astro
---
import DocsLayout from '../../layouts/DocsLayout.astro';
---

<DocsLayout title="Getting Started" description="Install Bloktastic and add your first component">
  <h1>Getting Started</h1>

  <p>
    This guide will walk you through installing the Bloktastic CLI and adding your first
    component to a Storyblok space.
  </p>

  <h2>Prerequisites</h2>

  <ul>
    <li>Node.js 20 or later</li>
    <li>A Storyblok account with an existing space</li>
    <li>A Storyblok OAuth token (Personal Access Token)</li>
  </ul>

  <h2>Step 1: Install the CLI</h2>

  <p>Install the Bloktastic CLI globally:</p>

  <pre><code>npm install -g @bloktastic/cli</code></pre>

  <p>Or use it directly with npx:</p>

  <pre><code>npx @bloktastic/cli &lt;command&gt;</code></pre>

  <h2>Step 2: Get Your Storyblok Token</h2>

  <p>
    You'll need a Personal Access Token to push components to your Storyblok space.
  </p>

  <ol>
    <li>Go to <a href="https://app.storyblok.com/#/me/account?tab=token">Storyblok Account Settings</a></li>
    <li>Click "Generate new token"</li>
    <li>Copy the token</li>
  </ol>

  <p>Set it as an environment variable:</p>

  <pre><code>export STORYBLOK_OAUTH_TOKEN="your-token-here"</code></pre>

  <p>Or add it to your <code>.env</code> file.</p>

  <h2>Step 3: Initialize Bloktastic</h2>

  <p>In your project directory, run:</p>

  <pre><code>bloktastic init</code></pre>

  <p>You'll be prompted for:</p>

  <ul>
    <li><strong>Space ID</strong> – Find this in your Storyblok space settings</li>
    <li><strong>Region</strong> – EU, US, Canada, or Asia-Pacific</li>
    <li><strong>Default Framework</strong> – Your preferred frontend framework</li>
    <li><strong>Prompt Output</strong> – How to receive the AI prompt (clipboard, file, stdout)</li>
  </ul>

  <p>This creates a <code>bloktastic.config.json</code> file in your project.</p>

  <h2>Step 4: Add Your First Component</h2>

  <p>Let's add the Hero component:</p>

  <pre><code>bloktastic add @bloktastic/hero</code></pre>

  <p>This will:</p>

  <ol>
    <li>Download the component schema from the registry</li>
    <li>Install any dependencies (like <code>@bloktastic/button</code>)</li>
    <li>Push the schema to your Storyblok space</li>
    <li>Copy the AI generation prompt to your clipboard</li>
  </ol>

  <h2>Step 5: Generate Frontend Code</h2>

  <p>
    Paste the prompt into your preferred AI tool (Claude, ChatGPT, Cursor) along with
    your project context:
  </p>

  <pre><code>[Paste the Bloktastic prompt]

My project uses:
- Vue 3 with Composition API
- Tailwind CSS
- TypeScript

Please generate the Hero component for my project.</code></pre>

  <p>The AI will generate code that matches your exact setup.</p>

  <h2>Next Steps</h2>

  <ul>
    <li><a href="/components">Browse more components</a></li>
    <li><a href="/docs/cli">Learn all CLI commands</a></li>
    <li><a href="/docs/contributing">Contribute your own components</a></li>
  </ul>
</DocsLayout>
```

---

## CLI Reference

### `/packages/website/src/pages/docs/cli.astro`

```astro
---
import DocsLayout from '../../layouts/DocsLayout.astro';
---

<DocsLayout title="CLI Reference" description="Complete reference for all Bloktastic CLI commands">
  <h1>CLI Reference</h1>

  <p>
    Complete reference for all Bloktastic CLI commands.
  </p>

  <h2>Installation</h2>

  <pre><code>npm install -g @bloktastic/cli</code></pre>

  <h2>Commands</h2>

  <h3><code>bloktastic init</code></h3>

  <p>Initialize Bloktastic in your project.</p>

  <pre><code>bloktastic init [options]

Options:
  -y, --yes           Skip prompts and use defaults
  --space &lt;id&gt;        Storyblok Space ID
  --region &lt;region&gt;   Storyblok region (eu, us, ca, ap)</code></pre>

  <p>Creates a <code>bloktastic.config.json</code> file with your preferences.</p>

  <h3><code>bloktastic add</code></h3>

  <p>Add a package to your Storyblok space.</p>

  <pre><code>bloktastic add &lt;package&gt; [options]

Arguments:
  package              Package name (e.g., @bloktastic/hero)

Options:
  --prompt-only        Only show the prompt, don't push schema
  --skip-schema        Skip pushing schema to Storyblok
  --force              Overwrite existing components</code></pre>

  <p><strong>Examples:</strong></p>

  <pre><code># Add a component
bloktastic add @bloktastic/hero

# Just get the prompt
bloktastic add @bloktastic/hero --prompt-only

# Force overwrite existing component
bloktastic add @bloktastic/hero --force

# Add a preset (multiple components)
bloktastic add @bloktastic/blog-starter</code></pre>

  <h3><code>bloktastic search</code></h3>

  <p>Search the registry for packages.</p>

  <pre><code>bloktastic search &lt;query&gt; [options]

Options:
  -t, --type &lt;type&gt;       Filter by type (component, plugin, preset)
  -c, --category &lt;cat&gt;    Filter by category
  --tag &lt;tag&gt;             Filter by tag</code></pre>

  <p><strong>Examples:</strong></p>

  <pre><code>bloktastic search hero
bloktastic search --type plugin color
bloktastic search --category sections</code></pre>

  <h3><code>bloktastic list</code></h3>

  <p>List available packages.</p>

  <pre><code>bloktastic list [options]

Options:
  -t, --type &lt;type&gt;       Filter by type
  -c, --category &lt;cat&gt;    Filter by category
  --installed             Show only installed packages</code></pre>

  <h3><code>bloktastic info</code></h3>

  <p>Show detailed information about a package.</p>

  <pre><code>bloktastic info &lt;package&gt;

Arguments:
  package              Package name (e.g., @bloktastic/hero)</code></pre>

  <h3><code>bloktastic create</code></h3>

  <p>Create a new package scaffold for contributing.</p>

  <pre><code>bloktastic create &lt;type&gt; &lt;name&gt; [options]

Arguments:
  type                 Package type (component, plugin, preset)
  name                 Package name (lowercase, hyphens)

Options:
  -n, --namespace      Package namespace (default: @bloktastic)
  -o, --output         Output directory</code></pre>

  <p><strong>Example:</strong></p>

  <pre><code>bloktastic create component my-hero
bloktastic create component hero --namespace mycompany</code></pre>

  <h3><code>bloktastic validate</code></h3>

  <p>Validate a package before submitting.</p>

  <pre><code>bloktastic validate &lt;path&gt; [options]

Arguments:
  path                 Path to package directory

Options:
  --quiet              Only output errors</code></pre>

  <h2>Environment Variables</h2>

  <table>
    <thead>
      <tr>
        <th>Variable</th>
        <th>Description</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><code>STORYBLOK_OAUTH_TOKEN</code></td>
        <td>Personal Access Token for Storyblok API</td>
      </tr>
    </tbody>
  </table>

  <h2>Configuration File</h2>

  <p>The <code>bloktastic.config.json</code> file stores your project settings:</p>

  <pre><code>{
  "$schema": "https://bloktastic.dev/schema/config.schema.json",
  "space": {
    "id": "123456",
    "region": "eu"
  },
  "preferences": {
    "defaultFramework": "vue",
    "outputDirectory": "./components/storyblok",
    "promptOutput": "clipboard"
  },
  "installedPackages": []
}</code></pre>
</DocsLayout>
```

---

## Contributing Guide

### `/packages/website/src/pages/docs/contributing.astro`

```astro
---
import DocsLayout from '../../layouts/DocsLayout.astro';
---

<DocsLayout title="Contributing" description="Learn how to contribute components to Bloktastic">
  <h1>Contributing</h1>

  <p>
    Thank you for your interest in contributing to Bloktastic! This guide will walk you
    through creating and submitting a new component.
  </p>

  <h2>Types of Contributions</h2>

  <ul>
    <li><strong>Components</strong> – Storyblok schemas with AI prompts</li>
    <li><strong>Plugins</strong> – Curated external Storyblok plugins</li>
    <li><strong>Presets</strong> – Bundles of related components</li>
    <li><strong>Improvements</strong> – Bug fixes, documentation, CLI enhancements</li>
  </ul>

  <h2>Creating a Component</h2>

  <h3>Step 1: Fork the Repository</h3>

  <p>Fork <a href="https://github.com/bloktastic/bloktastic">github.com/bloktastic/bloktastic</a> and clone locally.</p>

  <h3>Step 2: Scaffold Your Component</h3>

  <pre><code>bloktastic create component my-component --namespace your-username</code></pre>

  <p>This creates:</p>

  <pre><code>registry/components/my-component/
├── bloktastic.json   # Package manifest
├── schema.json       # Storyblok schema
├── prompt.md         # AI generation prompt
└── README.md         # Documentation</code></pre>

  <h3>Step 3: Edit the Schema</h3>

  <p>Define your Storyblok component fields in <code>schema.json</code>:</p>

  <pre><code>{
  "name": "my-component",
  "display_name": "My Component",
  "is_root": false,
  "is_nestable": true,
  "schema": {
    "title": {
      "type": "text",
      "required": true,
      "display_name": "Title"
    }
  }
}</code></pre>

  <h3>Step 4: Write the Prompt</h3>

  <p>The prompt is the most important part! It should include:</p>

  <ul>
    <li><strong>Purpose</strong> – What the component does</li>
    <li><strong>Schema Fields</strong> – All fields with types and descriptions</li>
    <li><strong>Visual Requirements</strong> – Layout, spacing, responsive behavior</li>
    <li><strong>Accessibility</strong> – ARIA, keyboard nav, semantic HTML</li>
    <li><strong>Props Interface</strong> – TypeScript interface</li>
    <li><strong>Edge Cases</strong> – Empty states, long content, etc.</li>
  </ul>

  <h3>Step 5: Validate</h3>

  <pre><code>bloktastic validate registry/components/my-component</code></pre>

  <h3>Step 6: Submit a PR</h3>

  <p>Push your branch and create a Pull Request. The CI will automatically validate your component.</p>

  <h2>Quality Guidelines</h2>

  <h3>Schema Best Practices</h3>

  <ul>
    <li>Use descriptive <code>display_name</code> for every field</li>
    <li>Add <code>description</code> for complex fields</li>
    <li>Set sensible <code>default_value</code> where appropriate</li>
    <li>Use <code>required: true</code> only when truly necessary</li>
    <li>Keep field count reasonable (< 15 fields)</li>
  </ul>

  <h3>Prompt Best Practices</h3>

  <ul>
    <li>Be specific about visual requirements</li>
    <li>Include all accessibility considerations</li>
    <li>Provide TypeScript interfaces</li>
    <li>Document edge cases thoroughly</li>
    <li>Keep language framework-agnostic</li>
  </ul>

  <h2>Contributor Levels</h2>

  <table>
    <thead>
      <tr>
        <th>Level</th>
        <th>Rights</th>
        <th>Requirements</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Newcomer</td>
        <td>Submit PRs (require review)</td>
        <td>GitHub account</td>
      </tr>
      <tr>
        <td>Trusted</td>
        <td>Direct publish own packages</td>
        <td>3+ merged PRs</td>
      </tr>
      <tr>
        <td>Core</td>
        <td>Review PRs, publish official packages</td>
        <td>Invitation</td>
      </tr>
    </tbody>
  </table>

  <h2>Need Help?</h2>

  <ul>
    <li><a href="https://github.com/bloktastic/bloktastic/discussions">GitHub Discussions</a></li>
    <li><a href="https://github.com/bloktastic/bloktastic/issues/new">Open an Issue</a></li>
  </ul>
</DocsLayout>
```

---

## Acceptance Criteria

- [ ] Docs Index zeigt Übersicht und Quick Links
- [ ] Getting Started ist vollständig und verständlich
- [ ] CLI Reference dokumentiert alle Commands
- [ ] Contributing Guide erklärt den Prozess
- [ ] Navigation zwischen Docs-Seiten funktioniert
- [ ] Sidebar zeigt aktuelle Seite an
- [ ] Code-Blöcke sind lesbar formatiert
- [ ] Responsive Layout

## Test Commands

```bash
cd packages/website
pnpm dev
# Besuche http://localhost:4321/docs
# Teste alle Docs-Seiten
```

## Nächster Task
→ Task 13: Final Polish (README, CONTRIBUTING, Deployment)
