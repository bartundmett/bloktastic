import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import AjvImport from 'ajv';
import addFormatsImport from 'ajv-formats';
import { DEFAULT_REGISTRY_URL, findUpwards, pathExists } from './utils.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

type AjvType = {
  addSchema: (schema: Record<string, unknown>, key: string) => void;
  getSchema: (key: string) => ((data: unknown) => boolean) & {
    errors?: Array<{ instancePath?: string; message?: string }>;
  } | null;
};

type AjvConstructor = new (options?: Record<string, unknown>) => AjvType;

const AjvCtor = (
  (AjvImport as unknown as { default?: AjvConstructor }).default ??
  (AjvImport as unknown as AjvConstructor)
) as AjvConstructor;

const addFormats = (
  (addFormatsImport as unknown as { default?: (ajv: AjvType) => void }).default ??
  (addFormatsImport as unknown as (ajv: AjvType) => void)
) as (ajv: AjvType) => void;

let ajvInstance: AjvType | null = null;

async function resolveSchemaPath(schemaName: string): Promise<string | null> {
  const fromCwd = await findUpwards(process.cwd(), path.join('schema', schemaName));
  if (fromCwd) return fromCwd;

  const fromDist = path.resolve(__dirname, '../../../../schema', schemaName);
  if (await pathExists(fromDist)) return fromDist;

  return null;
}

async function loadSchema(schemaName: string): Promise<Record<string, unknown>> {
  const localPath = await resolveSchemaPath(schemaName);
  if (localPath) {
    const raw = await fs.readFile(localPath, 'utf8');
    return JSON.parse(raw) as Record<string, unknown>;
  }

  const url = `${DEFAULT_REGISTRY_URL.replace(/\/registry$/, '')}/schema/${schemaName}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to load schema ${schemaName} from ${url}`);
  }
  return (await response.json()) as Record<string, unknown>;
}

function withoutMetaSchema(schema: Record<string, unknown>): Record<string, unknown> {
  const copy = { ...schema };
  delete (copy as Record<string, unknown>).$schema;
  return copy;
}

async function getAjv(): Promise<AjvType> {
  if (ajvInstance) return ajvInstance;

  const ajv = new AjvCtor({ allErrors: true, strict: false });
  addFormats(ajv);

  const [bloktasticSchema, registrySchema, configSchema] = await Promise.all([
    loadSchema('bloktastic.schema.json'),
    loadSchema('registry.schema.json'),
    loadSchema('config.schema.json')
  ]);

  ajv.addSchema(withoutMetaSchema(bloktasticSchema), 'bloktastic');
  ajv.addSchema(withoutMetaSchema(registrySchema), 'registry');
  ajv.addSchema(withoutMetaSchema(configSchema), 'config');

  ajvInstance = ajv;
  return ajvInstance;
}

function normalizeErrors(
  errors: Array<{ instancePath?: string; message?: string }> | null | undefined
): string[] {
  if (!errors?.length) return [];
  return errors.map((item) => `${item.instancePath || '/'}: ${item.message}`);
}

async function validateById(schemaId: 'bloktastic' | 'registry' | 'config', data: unknown): Promise<ValidationResult> {
  const ajv = await getAjv();
  const validator = ajv.getSchema(schemaId);

  if (!validator) {
    return { valid: false, errors: [`Schema '${schemaId}' was not loaded`] };
  }

  const valid = validator(data);
  return valid
    ? { valid: true, errors: [] }
    : { valid: false, errors: normalizeErrors(validator.errors) };
}

export async function validatePackageManifest(data: unknown): Promise<ValidationResult> {
  return validateById('bloktastic', data);
}

export async function validateRegistry(data: unknown): Promise<ValidationResult> {
  return validateById('registry', data);
}

export async function validateConfig(data: unknown): Promise<ValidationResult> {
  return validateById('config', data);
}
