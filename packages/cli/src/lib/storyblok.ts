import StoryblokClientImport from 'storyblok-js-client';
import type { Region } from '../types/index.js';

export interface StoryblokComponent {
  id: number;
  name: string;
  display_name: string;
  schema: Record<string, unknown>;
}

type StoryblokClientType = {
  get: (endpoint: string, params: Record<string, unknown>) => Promise<any>;
  post: (endpoint: string, payload: Record<string, unknown>) => Promise<any>;
  put: (endpoint: string, payload: Record<string, unknown>) => Promise<any>;
};

type StoryblokClientConstructor = new (options: Record<string, unknown>) => StoryblokClientType;

const StoryblokClientCtor = (
  (StoryblokClientImport as unknown as { default?: StoryblokClientConstructor }).default ??
  (StoryblokClientImport as unknown as StoryblokClientConstructor)
) as StoryblokClientConstructor;

let clientCache = new Map<string, StoryblokClientType>();

function getRegion(region: Region | undefined): Region | undefined {
  if (!region) return undefined;
  if (['eu', 'us', 'ca', 'ap'].includes(region)) return region;
  return undefined;
}

export function getStoryblokClient(region?: Region): StoryblokClientType {
  const token = process.env.STORYBLOK_OAUTH_TOKEN;
  if (!token) {
    throw new Error(
      'STORYBLOK_OAUTH_TOKEN not found. Generate one at https://app.storyblok.com/#/me/account?tab=token'
    );
  }

  const normalizedRegion = getRegion(region);
  const key = `${token.slice(0, 12)}:${normalizedRegion ?? 'eu'}`;

  if (clientCache.has(key)) {
    return clientCache.get(key) as StoryblokClientType;
  }

  const client = new StoryblokClientCtor({
    oauthToken: token,
    region: normalizedRegion
  });

  clientCache.set(key, client);
  return client;
}

function cleanSchemaForPush(schema: Record<string, unknown>): Record<string, unknown> {
  const copy = { ...schema };
  delete (copy as Record<string, unknown>).$bloktastic;
  return copy;
}

export async function getComponents(spaceId: string, region?: Region): Promise<StoryblokComponent[]> {
  const client = getStoryblokClient(region);
  const response = await client.get(`spaces/${spaceId}/components`, {});
  return (response.data.components ?? []) as StoryblokComponent[];
}

export async function componentExists(spaceId: string, componentName: string, region?: Region): Promise<boolean> {
  const components = await getComponents(spaceId, region);
  return components.some((component) => component.name === componentName);
}

export async function getComponent(
  spaceId: string,
  componentName: string,
  region?: Region
): Promise<StoryblokComponent | null> {
  const components = await getComponents(spaceId, region);
  return components.find((component) => component.name === componentName) ?? null;
}

export async function createComponent(
  spaceId: string,
  schema: Record<string, unknown>,
  region?: Region
): Promise<StoryblokComponent> {
  const client = getStoryblokClient(region);
  const response = await client.post(`spaces/${spaceId}/components`, {
    component: cleanSchemaForPush(schema)
  });
  return response.data.component as StoryblokComponent;
}

export async function updateComponent(
  spaceId: string,
  componentId: number,
  schema: Record<string, unknown>,
  region?: Region
): Promise<StoryblokComponent> {
  const client = getStoryblokClient(region);
  const response = await client.put(`spaces/${spaceId}/components/${componentId}`, {
    component: cleanSchemaForPush(schema)
  });
  return response.data.component as StoryblokComponent;
}

export async function pushComponent(
  spaceId: string,
  schema: Record<string, unknown>,
  options?: { force?: boolean; region?: Region }
): Promise<{ created: boolean; updated: boolean; skipped: boolean }> {
  const componentName = schema.name as string | undefined;
  if (!componentName) {
    throw new Error('Invalid schema: missing component name');
  }

  const existing = await getComponent(spaceId, componentName, options?.region);

  if (existing) {
    if (options?.force) {
      await updateComponent(spaceId, existing.id, schema, options.region);
      return { created: false, updated: true, skipped: false };
    }
    return { created: false, updated: false, skipped: true };
  }

  await createComponent(spaceId, schema, options?.region);
  return { created: true, updated: false, skipped: false };
}
