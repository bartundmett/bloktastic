export type PackageType = 'component' | 'plugin' | 'preset';
export type Region = 'eu' | 'us' | 'ca' | 'ap';
export type PromptOutput = 'clipboard' | 'file' | 'stdout';

export interface BloktasticConfig {
  $schema?: string;
  space?: {
    id: string;
    region: Region;
  };
  preferences?: {
    defaultFramework?: string;
    outputDirectory?: string;
    promptOutput?: PromptOutput;
  };
  installedPackages?: InstalledPackage[];
}

export interface InstalledPackage {
  name: string;
  version: string;
  installedAt: string;
}

export interface PackageManifest {
  $schema?: string;
  name: string;
  type: PackageType;
  version: string;
  title: string;
  description: string;
  author: {
    name: string;
    github: string;
    url?: string;
  };
  compatibility?: {
    storyblok?: string;
    storyblokMax?: string;
    frameworks?: string[];
  };
  tags?: string[];
  category?: string;
  files?: {
    schema?: string;
    prompt?: string;
    readme?: string;
  };
  dependencies?: {
    bloktastic?: string[];
  };
  includes?: string[];
  links?: Record<string, string>;
  metadata?: {
    created?: string;
    updated?: string;
    status?: 'stable' | 'maintained' | 'unmaintained' | 'deprecated' | 'archived';
  };
}

export interface RegistryData {
  $schema?: string;
  name: string;
  version: string;
  homepage?: string;
  repository?: string;
  packages: {
    components: PackageEntry[];
    plugins: PackageEntry[];
    presets: PackageEntry[];
  };
  categories?: {
    components?: string[];
    plugins?: string[];
  };
  stats?: {
    totalComponents: number;
    totalPlugins: number;
    totalPresets: number;
    lastUpdated: string;
  };
}

export interface PackageEntry {
  name: string;
  path: string;
  version: string;
  title: string;
  tags?: string[];
  category?: string | null;
  status?: string;
}

export interface RegistryPackage extends PackageEntry {
  _type: PackageType;
}
