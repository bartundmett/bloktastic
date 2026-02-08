import fs from 'node:fs/promises';
import path from 'node:path';
import { Command } from 'commander';
import chalk from 'chalk';
import clipboard from 'clipboardy';
import { addInstalledPackage, loadConfig } from '../lib/config.js';
import {
  fetchPackageManifest,
  fetchPackagePrompt,
  fetchPackageReadme,
  fetchPackageSchema,
  findPackage
} from '../lib/registry.js';
import { pushComponent } from '../lib/storyblok.js';
import type { PackageManifest, PromptOutput, Region } from '../types/index.js';
import { error, info, parsePackageName, spinner, success, warning } from '../lib/utils.js';

interface AddOptions {
  promptOnly?: boolean;
  skipSchema?: boolean;
  force?: boolean;
}

interface InstallOptions {
  promptOnly: boolean;
  skipSchema: boolean;
  force: boolean;
  spaceId?: string;
  region?: Region;
  promptOutput: PromptOutput;
}

function shouldTrackInstall(installOptions: InstallOptions): boolean {
  return !installOptions.promptOnly;
}

async function maybeCopyPrompt(promptText: string): Promise<void> {
  try {
    await clipboard.write(promptText);
    success('Prompt copied to clipboard!');
    console.log(chalk.dim('\nTip: Paste the prompt into Claude, ChatGPT, or Cursor with your project context.'));
  } catch {
    warning('Clipboard unavailable; printing prompt to stdout instead.');
    console.log(`\n${chalk.dim('─'.repeat(72))}`);
    console.log(promptText);
    console.log(`${chalk.dim('─'.repeat(72))}\n`);
  }
}

async function outputPrompt(
  packageName: string,
  promptText: string,
  installOptions: InstallOptions
): Promise<void> {
  if (installOptions.promptOnly) {
    console.log(`\n${chalk.dim('─'.repeat(72))}`);
    console.log(promptText);
    console.log(`${chalk.dim('─'.repeat(72))}\n`);
    return;
  }

  if (installOptions.promptOutput === 'stdout') {
    console.log(`\n${chalk.dim('─'.repeat(72))}`);
    console.log(promptText);
    console.log(`${chalk.dim('─'.repeat(72))}\n`);
    return;
  }

  if (installOptions.promptOutput === 'file') {
    const promptsDir = path.join(process.cwd(), 'bloktastic-prompts');
    await fs.mkdir(promptsDir, { recursive: true });
    const fileName = `${packageName.split('/').pop() || 'prompt'}.prompt.md`;
    const outputPath = path.join(promptsDir, fileName);
    await fs.writeFile(outputPath, promptText, 'utf8');
    success(`Prompt written to ${path.relative(process.cwd(), outputPath)}`);
    return;
  }

  await maybeCopyPrompt(promptText);
}

async function installComponent(
  manifest: PackageManifest,
  packagePath: string,
  installOptions: InstallOptions
): Promise<boolean> {
  const parsedName = parsePackageName(manifest.name);
  if (!parsedName) {
    error(`Invalid package name: ${manifest.name}`);
    return false;
  }

  console.log(`Installing ${chalk.cyan(manifest.name)}...`);

  const shouldPushSchema = !installOptions.promptOnly && !installOptions.skipSchema;

  if (shouldPushSchema) {
    if (!installOptions.spaceId) {
      error('Missing Storyblok space ID. Run `bloktastic init` first.');
      return false;
    }

    const pushSpin = spinner('Pushing schema to Storyblok...');
    pushSpin.start();

    try {
      const schema = await fetchPackageSchema(packagePath);
      const result = await pushComponent(installOptions.spaceId, schema, {
        force: installOptions.force,
        region: installOptions.region
      });

      if (result.created) {
        pushSpin.succeed(`Component "${parsedName.packageName}" created in Space ${installOptions.spaceId}`);
      } else if (result.updated) {
        pushSpin.succeed(`Component "${parsedName.packageName}" updated in Space ${installOptions.spaceId}`);
      } else {
        pushSpin.warn(`Component "${parsedName.packageName}" already exists (use --force to overwrite)`);
      }
    } catch (err) {
      pushSpin.fail();
      error(`Failed to push schema: ${err instanceof Error ? err.message : 'Unknown error'}`);
      return false;
    }
  }

  try {
    const promptText = await fetchPackagePrompt(packagePath);
    await outputPrompt(manifest.name, promptText, installOptions);
  } catch {
    warning('Could not fetch prompt for this package.');
  }

  if (shouldTrackInstall(installOptions)) {
    await addInstalledPackage({
      name: manifest.name,
      version: manifest.version,
      installedAt: new Date().toISOString()
    });
  }

  return true;
}

async function installPlugin(
  manifest: PackageManifest,
  packagePath: string,
  installOptions: InstallOptions
): Promise<boolean> {
  console.log(`Installing plugin listing ${chalk.cyan(manifest.name)}...`);

  try {
    const readme = await fetchPackageReadme(packagePath);
    success(`Plugin listing ready: ${manifest.title}`);

    if (manifest.links && Object.keys(manifest.links).length) {
      console.log('\nLinks:');
      Object.entries(manifest.links).forEach(([label, url]) => {
        console.log(`  - ${label}: ${url}`);
      });
    }

    console.log(`\n${chalk.dim('README excerpt:')}`);
    console.log(readme.split('\n').slice(0, 12).join('\n'));
  } catch {
    warning('Could not load plugin README.');
  }

  if (shouldTrackInstall(installOptions)) {
    await addInstalledPackage({
      name: manifest.name,
      version: manifest.version,
      installedAt: new Date().toISOString()
    });
  }

  return true;
}

async function installPreset(
  manifest: PackageManifest,
  installOptions: InstallOptions,
  installedInSession: Set<string>
): Promise<boolean> {
  if (!manifest.includes?.length) {
    warning('Preset has no includes. Nothing to install.');
    return true;
  }

  console.log(`Installing preset ${chalk.cyan(manifest.name)} (${manifest.includes.length} packages)...\n`);

  for (const dependency of manifest.includes) {
    const ok = await installPackage(dependency, installOptions, installedInSession);
    if (!ok) {
      error(`Failed while installing preset member: ${dependency}`);
      return false;
    }
  }

  if (shouldTrackInstall(installOptions)) {
    await addInstalledPackage({
      name: manifest.name,
      version: manifest.version,
      installedAt: new Date().toISOString()
    });
  }

  return true;
}

async function installPackage(
  packageName: string,
  installOptions: InstallOptions,
  installedInSession: Set<string>
): Promise<boolean> {
  if (installedInSession.has(packageName)) return true;

  const spin = spinner(`Fetching ${packageName} from registry...`);
  spin.start();

  const packageEntry = await findPackage(packageName);
  if (!packageEntry) {
    spin.fail();
    error(`Package not found: ${packageName}`);
    return false;
  }

  let manifest: PackageManifest;
  try {
    manifest = await fetchPackageManifest(packageEntry.path);
  } catch (err) {
    spin.fail();
    error(`Failed loading manifest for ${packageName}: ${err instanceof Error ? err.message : 'Unknown error'}`);
    return false;
  }

  spin.succeed(`Found ${packageName} v${manifest.version}`);

  if (manifest.dependencies?.bloktastic?.length) {
    console.log('\nResolving dependencies:');

    for (const dependency of manifest.dependencies.bloktastic) {
      if (installedInSession.has(dependency)) {
        success(`${dependency} (installed this session)`);
        continue;
      }

      if (installOptions.force && installOptions.spaceId && !installOptions.promptOnly && !installOptions.skipSchema) {
        info(`${dependency} (will install/update due to --force)`);
      } else {
        info(`${dependency} (will resolve/install)`);
      }

      const ok = await installPackage(dependency, installOptions, installedInSession);
      if (!ok) {
        error(`Failed to install dependency: ${dependency}`);
        return false;
      }
    }

    console.log('');
  }

  installedInSession.add(packageName);

  if (manifest.type === 'component') {
    return installComponent(manifest, packageEntry.path, installOptions);
  }

  if (manifest.type === 'plugin') {
    return installPlugin(manifest, packageEntry.path, installOptions);
  }

  if (manifest.type === 'preset') {
    return installPreset(manifest, installOptions, installedInSession);
  }

  error(`Unknown package type: ${manifest.type}`);
  return false;
}

export const addCommand = new Command('add')
  .description('Add a package to your Storyblok space')
  .argument('<package>', 'Package name (e.g. @bloktastic/hero)')
  .option('--prompt-only', 'Only show prompt, do not push schema')
  .option('--skip-schema', 'Skip pushing schema to Storyblok')
  .option('--force', 'Overwrite existing components in Storyblok')
  .action(async (packageName: string, options: AddOptions) => {
    if (!packageName.startsWith('@')) {
      error('Package name must include namespace (e.g. @bloktastic/hero)');
      process.exit(1);
    }

    const config = await loadConfig();
    const promptOutput = config?.preferences?.promptOutput ?? 'clipboard';

    const installOptions: InstallOptions = {
      promptOnly: Boolean(options.promptOnly),
      skipSchema: Boolean(options.skipSchema),
      force: Boolean(options.force),
      spaceId: config?.space?.id,
      region: config?.space?.region,
      promptOutput
    };

    const needsStoryblok = !installOptions.promptOnly && !installOptions.skipSchema;
    if (needsStoryblok && !installOptions.spaceId) {
      error('No Storyblok space configured. Run `bloktastic init` first.');
      process.exit(1);
    }

    console.log(`\nInstalling ${chalk.cyan(packageName)}...\n`);
    const installedInSession = new Set<string>();

    try {
      const ok = await installPackage(packageName, installOptions, installedInSession);
      if (!ok) {
        process.exit(1);
      }

      console.log('');
      success('Installation complete!');
    } catch (err) {
      error(`Installation failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
      process.exit(1);
    }
  });
