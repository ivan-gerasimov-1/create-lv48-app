import process from 'node:process';

import { syncManagedChangeset } from './releaseAutomation.mjs';

await main();

async function main() {
  const prNumber = parsePrNumber(process.env.PR_NUMBER);
  const prTitle = process.env.PR_TITLE ?? '';
  const labels = parseLabels(process.env.PR_LABELS_JSON);
  const result = await syncManagedChangeset({
    cwd: process.cwd(),
    prNumber,
    prTitle,
    labels,
  });

  console.log(
    `${result.action === 'written' ? 'Synced' : 'Removed'} managed changeset ${result.relativeChangesetPath} for ${result.releaseLabel}.`,
  );
}

function parsePrNumber(rawPrNumber) {
  const parsedPrNumber = Number(rawPrNumber);

  if (!Number.isInteger(parsedPrNumber) || parsedPrNumber <= 0) {
    throw new Error('PR_NUMBER must be a positive integer.');
  }

  return parsedPrNumber;
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
