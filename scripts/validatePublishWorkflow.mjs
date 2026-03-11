import { readFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

await main();

async function main() {
  const workflowChecks = [
    {
      name: 'release intent validation workflow',
      workflowPath: path.join(process.cwd(), '.github', 'workflows', 'validateReleaseIntent.yml'),
      requiredSnippets: [
        'pull_request_target:',
        '- synchronize',
        '- edited',
        '- ready_for_review',
        'pull-requests: read',
        'ref: ${{ github.event.pull_request.base.sha }}',
        'uses: actions/github-script@v7',
        'run: node ./scripts/validateReleaseIntent.mjs',
      ],
    },
    {
      name: 'publish workflow',
      workflowPath: path.join(process.cwd(), '.github', 'workflows', 'publish.yml'),
      requiredSnippets: [
        'push:',
        'branches:',
        '- main',
        'id-token: write',
        'pull-requests: write',
        'uses: googleapis/release-please-action@v4',
        'config-file: .release-please-config.json',
        'manifest-file: .release-please-manifest.json',
        "if: ${{ startsWith(github.event.head_commit.message, 'chore(main): release ') }}",
        'run: npm ci',
        'run: npm run release:publish',
        'NPM_CONFIG_PROVENANCE: false',
      ],
    },
  ];
  const configChecks = [
    {
      name: 'conventional commit policy',
      configPath: path.join(process.cwd(), '.github', 'conventionalCommitPolicy.json'),
      requiredSnippets: ['"mergeStrategy": "squash"', '"feat"', '"fix"', '"docs"'],
    },
    {
      name: 'release please config',
      configPath: path.join(process.cwd(), '.release-please-config.json'),
      requiredSnippets: ['"release-type": "node"', '"package-name": "create-lv48-app"', '"changelog-path": "CHANGELOG.md"'],
    },
    {
      name: 'release please manifest',
      configPath: path.join(process.cwd(), '.release-please-manifest.json'),
      requiredSnippets: ['".": "0.3.1"'],
    },
  ];
  const forbiddenPaths = [
    path.join(process.cwd(), '.github', 'workflows', 'prReleaseChangeset.yml'),
    path.join(process.cwd(), '.github', 'releaseAutomation.json'),
    path.join(process.cwd(), 'scripts', 'releaseAutomation.mjs'),
    path.join(process.cwd(), 'scripts', 'releaseAutomation.d.ts'),
    path.join(process.cwd(), 'scripts', 'syncPrChangeset.mjs'),
    path.join(process.cwd(), 'scripts', 'validateForkReleasePolicy.mjs'),
    path.join(process.cwd(), 'tests', 'releaseAutomation.test.ts'),
    path.join(process.cwd(), 'tests', 'releaseAutomationTypes.d.ts'),
    path.join(process.cwd(), '.changeset', 'config.json'),
  ];
  const failures = [];

  for (const workflowCheck of workflowChecks) {
    const workflowContents = await readFile(workflowCheck.workflowPath, 'utf8');
    const missingSnippets = workflowCheck.requiredSnippets.filter(
      (snippet) => !workflowContents.includes(snippet),
    );

    if (missingSnippets.length > 0) {
      failures.push({
        name: workflowCheck.name,
        missingSnippets,
      });
    }
  }

  for (const configCheck of configChecks) {
    const configContents = await readFile(configCheck.configPath, 'utf8');
    const missingSnippets = configCheck.requiredSnippets.filter(
      (snippet) => !configContents.includes(snippet),
    );

    if (missingSnippets.length > 0) {
      failures.push({
        name: configCheck.name,
        missingSnippets,
      });
    }
  }

  for (const forbiddenPath of forbiddenPaths) {
    try {
      await readFile(forbiddenPath, 'utf8');
      failures.push({
        name: 'forbidden legacy asset',
        missingSnippets: [path.relative(process.cwd(), forbiddenPath)],
      });
    } catch (error) {
      if (!isMissingFileError(error)) {
        throw error;
      }
    }
  }

  if (failures.length > 0) {
    for (const failure of failures) {
      console.error(`${failure.name} is missing required configuration snippets:`);
      for (const snippet of failure.missingSnippets) {
        console.error(`- ${snippet}`);
      }
    }

    process.exitCode = 1;
    return;
  }

  console.log('Release workflows passed static validation.');
}

function isMissingFileError(error) {
  return typeof error === 'object' && error !== null && 'code' in error && error.code === 'ENOENT';
}
