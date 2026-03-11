import process from 'node:process';

import { loadConventionalCommitPolicy, validateReleaseIntent } from './conventionalCommits.mjs';

await main();

async function main() {
  const policy = await loadConventionalCommitPolicy(process.cwd());
  const commitMessages = parseCommitMessages(process.env.PR_COMMITS_JSON);
  const result = validateReleaseIntent(
    {
      prTitle: process.env.PR_TITLE,
      commitMessages,
    },
    policy,
  );

  if (result.acceptedBy === 'pull_request_title') {
    console.log(
      `Release intent validated from pull request title (${result.parsedTitle.type} -> ${result.parsedTitle.release}).`,
    );

    return;
  }

  console.log(
    `Release intent validated from ${result.commitCount} commit message(s) because the pull request title is not canonical.`,
  );
}

function parseCommitMessages(rawMessages) {
  if (typeof rawMessages !== 'string' || rawMessages.length === 0) {
    return [];
  }

  const parsedMessages = JSON.parse(rawMessages);

  if (!Array.isArray(parsedMessages)) {
    throw new Error('PR_COMMITS_JSON must decode to a string array.');
  }

  return parsedMessages.filter((message) => typeof message === 'string');
}
