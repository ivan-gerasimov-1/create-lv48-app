import { mkdtemp, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import process from 'node:process';

import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

import { buildExpectedPackedFiles, verifyPackedFiles } from '../dist/release/verifyPack.js';

let execFileAsync = promisify(execFile);

await main();

async function main() {
  let cacheDirectory = await mkdtemp(path.join(os.tmpdir(), 'lv48-npm-cache-'));

  try {
    let files = await loadPackedFiles(cacheDirectory);
    let expectedFiles = await buildExpectedPackedFiles(process.cwd());
    let result = verifyPackedFiles(files, expectedFiles);

    if (result.missingFiles.length > 0 || result.unexpectedFiles.length > 0) {
      printFailure(result);
      throw new Error('Packed artifact does not match the expected public file contract.');
    }

    console.log('Packed artifact matches the expected public file contract.');
  } finally {
    await rm(cacheDirectory, { recursive: true, force: true });
  }
}

async function loadPackedFiles(cacheDirectory) {
  let { stdout } = await execFileAsync(
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
  let parsed = JSON.parse(stdout);

  if (!Array.isArray(parsed) || parsed.length === 0) {
    throw new Error('npm pack --dry-run returned no tarball metadata.');
  }

  let [firstEntry] = parsed;

  if (!firstEntry || !Array.isArray(firstEntry.files)) {
    throw new Error('npm pack --dry-run did not return a files list.');
  }

  return firstEntry.files;
}

function printFailure(result) {
  if (result.missingFiles.length > 0) {
    console.error('Missing required packed files:');
    for (let filePath of result.missingFiles) {
      console.error(`- ${filePath}`);
    }
  }

  if (result.unexpectedFiles.length > 0) {
    console.error('Unexpected packed files outside the public contract:');
    for (let filePath of result.unexpectedFiles) {
      console.error(`- ${filePath}`);
    }
  }
}
