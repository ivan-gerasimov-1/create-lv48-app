import { readFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

await main();

async function main() {
  const workflowChecks = [
    {
      name: 'publish workflow',
      workflowPath: path.join(process.cwd(), '.github', 'workflows', 'publish.yml'),
      requiredSnippets: [
        'push:',
        'branches:',
        '- main',
        'id-token: write',
        'pull-requests: write',
        'run: npm ci',
        'uses: changesets/action@v1',
        'version: npm run release:version',
        'publish: npm run release:publish',
        'NPM_CONFIG_PROVENANCE: false',
      ],
    },
    {
      name: 'pull request release-intent workflow',
      workflowPath: path.join(process.cwd(), '.github', 'workflows', 'prReleaseChangeset.yml'),
      requiredSnippets: [
        'pull_request:',
        '- synchronize',
        '- edited',
        '- labeled',
        '- unlabeled',
        'head.repo.full_name != github.repository',
        'run: node ./scripts/validateForkReleasePolicy.mjs',
        'contents: write',
        'pull-requests: write',
        'run: node ./scripts/syncPrChangeset.mjs',
        'git add -A ".changeset/release-pr-${PR_NUMBER}.md"',
      ],
    },
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
