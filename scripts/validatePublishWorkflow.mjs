import { readFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

await main();

async function main() {
  const workflowPath = path.join(process.cwd(), '.github', 'workflows', 'publish.yml');
  const workflowContents = await readFile(workflowPath, 'utf8');
  const requiredSnippets = [
    'workflow_dispatch:',
    'id-token: write',
    'run: npm ci',
    'run: npm run release:check',
    'run: npm publish --provenance --access public',
  ];
  const missingSnippets = requiredSnippets.filter((snippet) => !workflowContents.includes(snippet));

  if (missingSnippets.length > 0) {
    console.error('Publish workflow is missing required configuration snippets:');
    for (const snippet of missingSnippets) {
      console.error(`- ${snippet}`);
    }
    process.exitCode = 1;
    return;
  }

  console.log('Publish workflow passed static validation.');
}
