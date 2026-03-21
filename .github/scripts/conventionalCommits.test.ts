import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import type { ConventionalCommitPolicy } from './conventionalCommits.d.mts';
import {
  parseConventionalCommit,
  validateReleaseIntent,
} from './conventionalCommits.mjs';

const fixturePolicy: ConventionalCommitPolicy = {
  mergeStrategy: 'squash',
  breakingChangeFooter: 'BREAKING CHANGE:',
  types: {
    feat: { release: 'minor', description: 'user-visible functionality' },
    fix: { release: 'patch', description: 'user-visible fixes' },
    docs: { release: 'none', description: 'documentation-only changes' },
    test: { release: 'none', description: 'test-only changes' },
  },
};

describe('conventional commit policy', () => {
  it('parses a releasing pull request title', () => {
    const parsedCommit = parseConventionalCommit('feat(cli): add release intent validation', fixturePolicy);

    assert.deepEqual(parsedCommit, {
      description: 'add release intent validation',
      isBreaking: false,
      release: 'minor',
      scope: 'cli',
      type: 'feat',
    });
  });

  it('treats breaking markers as a major release', () => {
    const parsedCommit = parseConventionalCommit(
      'fix!: remove legacy release label flow\n\nBREAKING CHANGE: labels are no longer supported',
      fixturePolicy,
    );

    assert.deepEqual(parsedCommit, {
      description: 'remove legacy release label flow',
      isBreaking: true,
      release: 'major',
      scope: null,
      type: 'fix',
    });
  });

  it('accepts a canonical pull request title without inspecting commits', () => {
    const result = validateReleaseIntent(
      {
        prTitle: 'docs: document release intent contract',
        commitMessages: ['not a conventional commit'],
      },
      fixturePolicy,
    );

    assert.deepEqual(result, {
      acceptedBy: 'pull_request_title',
      parsedTitle: {
        description: 'document release intent contract',
        isBreaking: false,
        release: 'none',
        scope: null,
        type: 'docs',
      },
    });
  });

  it('falls back to commit messages when the pull request title is not canonical', () => {
    const result = validateReleaseIntent(
      {
        prTitle: 'Release automation follow-up',
        commitMessages: ['fix: validate release intent before merge', 'test: cover fallback path'],
      },
      fixturePolicy,
    );

    assert.deepEqual(result, {
      acceptedBy: 'commit_messages',
      commitCount: 2,
    });
  });

  it('fails clearly when neither title nor commit history is conventional', () => {
    assert.throws(
      () =>
        validateReleaseIntent(
          {
            prTitle: 'Release automation follow-up',
            commitMessages: ['update stuff', 'another message'],
          },
          fixturePolicy,
        ),
      /Release intent must be expressed as a Conventional Commit/,
    );
  });
});
