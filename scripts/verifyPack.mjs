import { mkdtemp, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import process from 'node:process';

import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

import { verifyPackedFiles } from '../dist/release/verifyPack.js';

const execFileAsync = promisify(execFile);

async function main() {
  const cacheDirectory = await mkdtemp(path.join(os.tmpdir(), 'lv48-npm-cache-'));

  try {
    const files = await loadPackedFiles(cacheDirectory);
    const result = verifyPackedFiles(files);

    if (result.missingFiles.length > 0 || result.unexpectedFiles.length > 0) {
      printFailure(result);
      process.exitCode = 1;
      return;
    }

    console.log('Packed artifact matches the expected public file contract.');
  } finally {
    await rm(cacheDirectory, { recursive: true, force: true });
  }
}

async function loadPackedFiles(cacheDirectory) {
  const { stdout } = await execFileAsync(
    'npm',
    ['pack', '--dry-run', '--json', '--cache', cacheDirectory],
    {
      cwd: process.cwd(),
      env: {
        ...process.env,
        npm_config_update_notifier: 'false',
      },
    },
  );
  const parsed = JSON.parse(stdout);

  if (!Array.isArray(parsed) || parsed.length === 0) {
    throw new Error('npm pack --dry-run returned no tarball metadata.');
  }

  const [firstEntry] = parsed;

  if (!firstEntry || !Array.isArray(firstEntry.files)) {
    throw new Error('npm pack --dry-run did not return a files list.');
  }

  return firstEntry.files;
}

function printFailure(result) {
  if (result.missingFiles.length > 0) {
    console.error('Missing required packed files:');
    for (const filePath of result.missingFiles) {
      console.error(`- ${filePath}`);
    }
  }

  if (result.unexpectedFiles.length > 0) {
    console.error('Unexpected packed files outside the public contract:');
    for (const filePath of result.unexpectedFiles) {
      console.error(`- ${filePath}`);
    }
  }
}

await main();
