import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

export async function loadReleaseAutomationConfig(cwd = process.cwd()) {
  const configPath = path.join(cwd, '.github', 'releaseAutomation.json');
  const configContents = await readFile(configPath, 'utf8');

  return JSON.parse(configContents);
}

export async function loadPackageName(cwd = process.cwd()) {
  const packageJsonPath = path.join(cwd, 'package.json');
  const packageJsonContents = await readFile(packageJsonPath, 'utf8');
  const parsedPackageJson = JSON.parse(packageJsonContents);

  if (typeof parsedPackageJson.name !== 'string' || parsedPackageJson.name.length === 0) {
    throw new Error('package.json must define a package name for release automation.');
  }

  return parsedPackageJson.name;
}

export function resolveManagedChangesetPath(config, prNumber) {
  const filename = config.managedChangeset.filenameTemplate.replace('<number>', String(prNumber));

  return path.join(config.managedChangeset.directory, filename);
}

export function resolveReleaseIntent(config, labels) {
  const supportedLabels = Object.keys(config.releaseLabels);
  const matchedLabels = labels.filter((label) => supportedLabels.includes(label));

  if (matchedLabels.length !== 1) {
    throw new Error(
      `Expected exactly one supported release label (${supportedLabels.join(', ')}), received ${matchedLabels.length}.`,
    );
  }

  const [matchedLabel] = matchedLabels;
  const bumpType = config.releaseLabels[matchedLabel];

  if (typeof bumpType !== 'string' || bumpType.length === 0) {
    throw new Error(`Release label ${matchedLabel} is missing a configured bump type.`);
  }

  return {
    label: matchedLabel,
    bumpType,
  };
}

export function createManagedChangesetContent(packageName, bumpType, summary) {
  const normalizedSummary = normalizeSummary(summary);

  if (normalizedSummary.length === 0) {
    throw new Error('Pull request title must not be empty for managed changeset generation.');
  }

  return `---\n"${packageName}": ${bumpType}\n---\n\n${normalizedSummary}\n`;
}

export async function syncManagedChangeset(options) {
  const config = await loadReleaseAutomationConfig(options.cwd);
  const packageName = await loadPackageName(options.cwd);
  const releaseIntent = resolveReleaseIntent(config, options.labels);
  const relativeChangesetPath = resolveManagedChangesetPath(config, options.prNumber);
  const absoluteChangesetPath = path.join(options.cwd, relativeChangesetPath);

  if (releaseIntent.bumpType === 'none') {
    await rm(absoluteChangesetPath, { force: true });

    return {
      action: 'removed',
      relativeChangesetPath,
      releaseLabel: releaseIntent.label,
    };
  }

  await mkdir(path.dirname(absoluteChangesetPath), { recursive: true });
  await writeFile(
    absoluteChangesetPath,
    createManagedChangesetContent(packageName, releaseIntent.bumpType, options.prTitle),
    'utf8',
  );

  return {
    action: 'written',
    relativeChangesetPath,
    releaseLabel: releaseIntent.label,
  };
}

function normalizeSummary(summary) {
  if (typeof summary !== 'string') {
    return '';
  }

  return summary.replace(/\s+/g, ' ').trim();
}
