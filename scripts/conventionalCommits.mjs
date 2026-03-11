import { readFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

export async function loadConventionalCommitPolicy(cwd = process.cwd()) {
  const configPath = path.join(cwd, '.github', 'conventionalCommitPolicy.json');
  const configContents = await readFile(configPath, 'utf8');

  return JSON.parse(configContents);
}

export function parseConventionalCommit(message, policy) {
  const normalizedMessage = normalizeCommitMessage(message);

  if (normalizedMessage.length === 0) {
    return null;
  }

  const [subjectLine, ...bodyLines] = normalizedMessage.split('\n');
  const supportedTypes = Object.keys(policy.types);
  const headerPattern = new RegExp(
    `^(${supportedTypes.join('|')})(\\([^\\r\\n()]+\\))?(!)?:\\s+(.+)$`,
  );
  const matchedHeader = subjectLine.match(headerPattern);

  if (matchedHeader === null) {
    return null;
  }

  const [, type, rawScope = '', rawBang = '', description] = matchedHeader;
  const scope = rawScope.length === 0 ? null : rawScope.slice(1, -1);
  const hasBreakingFooter = bodyLines.join('\n').includes(policy.breakingChangeFooter);
  const isBreaking = rawBang === '!' || hasBreakingFooter;
  const release = isBreaking ? 'major' : policy.types[type].release;

  return {
    description,
    isBreaking,
    release,
    scope,
    type,
  };
}

export function validateReleaseIntent(input, policy) {
  const titleResult = parseConventionalCommit(input.prTitle, policy);

  if (titleResult !== null) {
    return {
      acceptedBy: 'pull_request_title',
      parsedTitle: titleResult,
    };
  }

  const invalidCommitMessages = input.commitMessages.filter(
    (commitMessage) => parseConventionalCommit(commitMessage, policy) === null,
  );

  if (input.commitMessages.length > 0 && invalidCommitMessages.length === 0) {
    return {
      acceptedBy: 'commit_messages',
      commitCount: input.commitMessages.length,
    };
  }

  throw new Error(createValidationErrorMessage(policy, invalidCommitMessages));
}

function createValidationErrorMessage(policy, invalidCommitMessages) {
  const supportedTypes = Object.entries(policy.types)
    .map(([type, config]) => `${type} (${config.release})`)
    .join(', ');
  const invalidSamples =
    invalidCommitMessages.length === 0
      ? 'No commit messages were available for fallback validation.'
      : `Invalid commit messages: ${invalidCommitMessages
          .slice(0, 3)
          .map((message) => JSON.stringify(message.split('\n')[0]))
          .join(', ')}.`;

  return [
    'Release intent must be expressed as a Conventional Commit that release-please can interpret.',
    `Supported types: ${supportedTypes}.`,
    `Use a title like "feat: add generated release PR" or "chore!: remove deprecated release contract".`,
    `Enforced merge strategy: ${policy.mergeStrategy}.`,
    invalidSamples,
  ].join(' ');
}

function normalizeCommitMessage(message) {
  if (typeof message !== 'string') {
    return '';
  }

  return message
    .split('\n')
    .map((line) => line.trimEnd())
    .join('\n')
    .trim();
}
