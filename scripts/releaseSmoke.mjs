import { rm, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { pathToFileURL } from 'node:url';

import { execFile, spawn } from 'node:child_process';
import { promisify } from 'node:util';

import {
  createReleaseSmokePaths,
  getInstalledSmokeCliPath,
} from '../dist/release/smoke.js';

let execFileAsync = promisify(execFile);

const ENTRYPOINT_TIMEOUT_MS = 30_000;

await main();

async function main() {
  let smokePaths = await createReleaseSmokePaths();

  try {
    let tarballPath = await packArtifact(smokePaths.packDirectory, smokePaths.npmCacheDirectory);
    await installTarball(tarballPath, smokePaths.installDirectory, smokePaths.npmCacheDirectory);
    await verifyPublishedEntrypointStarts(smokePaths.installDirectory, smokePaths.runDirectory);
    await scaffoldFromInstalledPackage(smokePaths.installDirectory, smokePaths.runDirectory);
    await verifyGeneratedProject(smokePaths.generatedProjectRoot);
    console.log('Packed artifact smoke test passed.');
  } finally {
    await rm(smokePaths.workspaceRoot, { recursive: true, force: true });
  }
}

async function packArtifact(packDirectory, npmCacheDirectory) {
  let { stdout } = await execFileAsync(
    'npm',
    ['pack', '--json', '--pack-destination', packDirectory, '--cache', npmCacheDirectory],
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
    throw new Error('npm pack did not return tarball metadata.');
  }

  let [firstEntry] = parsed;

  if (!firstEntry || typeof firstEntry.filename !== 'string') {
    throw new Error('npm pack did not return a tarball filename.');
  }

  return path.join(packDirectory, firstEntry.filename);
}

async function installTarball(tarballPath, installDirectory, npmCacheDirectory) {
  await writeFile(
    path.join(installDirectory, 'package.json'),
    JSON.stringify({
      name: 'release-smoke-install',
      private: true,
    }),
    'utf8',
  );

  await execFileAsync(
    'npm',
    ['install', '--cache', npmCacheDirectory, tarballPath],
    {
      cwd: installDirectory,
      env: {
        ...process.env,
        npm_config_update_notifier: 'false',
      },
    },
  );
}

async function verifyPublishedEntrypointStarts(installDirectory, runDirectory) {
  let executablePath = getInstalledSmokeCliPath(installDirectory);

  await new Promise((resolve, reject) => {
    let child = spawn(executablePath, {
      cwd: runDirectory,
      stdio: ['pipe', 'pipe', 'pipe'],
    });

    let stdout = '';
    let stderr = '';
    let started = false;

    let timer = setTimeout(() => {
      child.kill();
      reject(new Error(
        `CLI did not produce expected output within ${ENTRYPOINT_TIMEOUT_MS}ms.\nstdout: ${stdout}\nstderr: ${stderr}`,
      ));
    }, ENTRYPOINT_TIMEOUT_MS);

    child.stdout.on('data', (chunk) => {
      stdout += String(chunk);

      if (!started && stdout.includes('Project name')) {
        started = true;
        clearTimeout(timer);
        child.kill();
      }
    });

    child.stderr.on('data', (chunk) => {
      stderr += String(chunk);
    });

    child.on('error', (error) => {
      clearTimeout(timer);
      reject(error);
    });

    child.on('close', (code) => {
      clearTimeout(timer);

      if (started) {
        resolve(undefined);
        return;
      }

      reject(
        new Error(
          stderr.trim() || stdout.trim() || `Packed CLI exited with code ${code ?? 'unknown'}`,
        ),
      );
    });
  });
}

async function scaffoldFromInstalledPackage(installDirectory, runDirectory) {
  let cliModulePath = path.join(installDirectory, 'node_modules', 'create-lv48-app', 'dist', 'cli.js');
  let { runCli } = await import(pathToFileURL(cliModulePath).href);

  await runCli({
    cwd: runDirectory,
    commandExecutor: async () => {},
    promptController: {
      async collectAnswers() {
        return {
          projectName: 'smoke-app',
          packageName: 'smoke-app',
          displayName: 'Smoke App',
          targetDirectory: 'smoke-app',
          packageManager: 'npm',
          presetId: 'base',
          installDependencies: false,
          initializeGit: false,
        };
      },
    },
    logger: {
      info() {},
      debug() {},
      error() {},
    },
  });
}

async function verifyGeneratedProject(generatedProjectRoot) {
  let expectedPaths = [
    'README.md',
    'apps/api/src/index.ts',
    'apps/site/src/pages/index.astro',
    'apps/web/src/main.tsx',
    'package.json',
  ];

  for (let relativePath of expectedPaths) {
    let targetPath = path.join(generatedProjectRoot, relativePath);
    let fileStats = await stat(targetPath);

    if (!fileStats.isFile()) {
      throw new Error(`Expected generated file is missing: ${targetPath}`);
    }
  }
}
