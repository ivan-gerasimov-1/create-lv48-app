import process from 'node:process';

import { loadReleaseAutomationConfig, resolveReleaseIntent } from './releaseAutomation.mjs';

await main();

async function main() {
  const labels = parseLabels(process.env.PR_LABELS_JSON);
  const config = await loadReleaseAutomationConfig(process.cwd());
  const releaseIntent = resolveReleaseIntent(config, labels);

  if (releaseIntent.bumpType !== 'none') {
    throw new Error(
      `Fork pull requests cannot use managed release labels (${releaseIntent.label}). Recreate the pull request from a repository branch or switch to release:none.`,
    );
  }

  console.log('Fork pull request uses release:none and does not require managed changeset sync.');
}

function parseLabels(rawLabels) {
  if (typeof rawLabels !== 'string' || rawLabels.length === 0) {
    return [];
  }

  const parsedLabels = JSON.parse(rawLabels);

  if (!Array.isArray(parsedLabels)) {
    throw new Error('PR_LABELS_JSON must decode to a string array.');
  }

  return parsedLabels.filter((label) => typeof label === 'string');
}
