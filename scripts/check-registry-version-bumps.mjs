import { execFileSync } from 'node:child_process';

function git(args) {
  return execFileSync('git', args, { encoding: 'utf8' }).trim();
}

function fileExistsAt(sha, filePath) {
  try {
    execFileSync('git', ['cat-file', '-e', `${sha}:${filePath}`], { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

function readJsonAt(sha, filePath) {
  const raw = git(['show', `${sha}:${filePath}`]);
  return JSON.parse(raw);
}

function parseSemver(version) {
  const match = /^(\d+)\.(\d+)\.(\d+)$/.exec(String(version ?? ''));
  if (!match) return null;
  return match.slice(1).map((value) => Number(value));
}

function compareSemver(left, right) {
  for (let index = 0; index < 3; index += 1) {
    if (left[index] > right[index]) return 1;
    if (left[index] < right[index]) return -1;
  }
  return 0;
}

function uniqueSorted(values) {
  return Array.from(new Set(values)).sort((a, b) => a.localeCompare(b));
}

const [baseSha, headSha] = process.argv.slice(2);

if (!baseSha || !headSha) {
  console.error('Usage: node scripts/check-registry-version-bumps.mjs <base-sha> <head-sha>');
  process.exit(1);
}

const diffOutput = git([
  'diff',
  '--name-only',
  baseSha,
  headSha,
  '--',
  'registry/components',
  'registry/plugins',
  'registry/presets'
]);

if (!diffOutput) {
  console.log('No registry changes detected between base and head.');
  process.exit(0);
}

const packageChanges = new Map();
for (const filePath of diffOutput.split('\n').map((value) => value.trim()).filter(Boolean)) {
  const match = /^registry\/(components|plugins|presets)\/([^/]+)\/(.+)$/.exec(filePath);
  if (!match) continue;

  const packageDir = `registry/${match[1]}/${match[2]}`;
  const changedFile = match[3];

  if (!packageChanges.has(packageDir)) {
    packageChanges.set(packageDir, new Set());
  }
  packageChanges.get(packageDir).add(changedFile);
}

const failures = [];

for (const packageDir of uniqueSorted([...packageChanges.keys()])) {
  const changedFiles = uniqueSorted([...packageChanges.get(packageDir)]);
  const changedContentFiles = changedFiles.filter((filePath) => filePath !== 'bloktastic.json');

  if (changedContentFiles.length === 0) continue;

  const manifestPath = `${packageDir}/bloktastic.json`;
  const manifestChanged = changedFiles.includes('bloktastic.json');

  if (!fileExistsAt(headSha, manifestPath)) {
    continue;
  }

  if (!manifestChanged) {
    failures.push(
      `${packageDir}: changed ${changedContentFiles.join(', ')} but did not update bloktastic.json`
    );
    continue;
  }

  if (!fileExistsAt(baseSha, manifestPath)) {
    continue;
  }

  let baseManifest;
  let headManifest;
  try {
    baseManifest = readJsonAt(baseSha, manifestPath);
    headManifest = readJsonAt(headSha, manifestPath);
  } catch (error) {
    failures.push(`${packageDir}: unable to read manifest for version comparison (${String(error)})`);
    continue;
  }

  const baseVersion = baseManifest.version;
  const headVersion = headManifest.version;

  if (baseVersion === headVersion) {
    failures.push(
      `${packageDir}: changed ${changedContentFiles.join(', ')} but version stayed at ${baseVersion}`
    );
    continue;
  }

  const parsedBase = parseSemver(baseVersion);
  const parsedHead = parseSemver(headVersion);

  if (!parsedBase || !parsedHead) {
    failures.push(
      `${packageDir}: invalid semver transition (${String(baseVersion)} -> ${String(headVersion)})`
    );
    continue;
  }

  if (compareSemver(parsedHead, parsedBase) <= 0) {
    failures.push(`${packageDir}: version must increase (${baseVersion} -> ${headVersion})`);
  }
}

if (failures.length > 0) {
  console.error('Registry package version checks failed:\n');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log('Registry package version checks passed.');
