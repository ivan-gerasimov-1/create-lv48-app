import { spawn } from 'node:child_process';
import { watch } from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const FILE_EXTENSIONS = new Set(['.cts', '.json', '.mjs', '.mts', '.ts']);
const SCAN_ROOTS = ['.github/scripts', 'scripts', 'src', 'tests'];

let currentRun = null;
let rerunTimer = null;
let rerunPending = false;
let stopRequested = false;
let shuttingDown = false;
let watchers = [];

for (let scanRoot of SCAN_ROOTS) {
  try {
    let watcher = watch(
      path.join(process.cwd(), scanRoot),
      { recursive: true },
      (_eventType, filename) => {
        if (typeof filename === 'string' && FILE_EXTENSIONS.has(path.extname(filename))) {
          scheduleRerun();
        }
      },
    );

    watcher.on('error', () => {});
    watchers.push(watcher);
  } catch {
    // Directory does not exist
  }
}

runTests();

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

function scheduleRerun() {
  if (rerunTimer !== null) {
    clearTimeout(rerunTimer);
  }

  rerunTimer = setTimeout(() => {
    rerunTimer = null;

    if (currentRun !== null) {
      rerunPending = true;

      if (!stopRequested) {
        stopRequested = true;
        currentRun.kill('SIGTERM');
      }

      return;
    }

    runTests();
  }, 150);
}

function runTests() {
  currentRun = spawn(
    process.execPath,
    ['--import', './scripts/tsTestRegister.mjs', '--test', 'tests/**/*.test.ts', '.github/scripts/**/*.test.ts'],
    {
      cwd: process.cwd(),
      stdio: 'inherit',
    },
  );

  currentRun.once('exit', (code, signal) => {
    let shouldRerun = rerunPending;

    currentRun = null;
    rerunPending = false;
    stopRequested = false;

    if (shuttingDown) {
      if (typeof code === 'number') {
        process.exitCode = code;
      }

      return;
    }

    if (signal === null && typeof code === 'number') {
      process.exitCode = code;
    }

    if (shouldRerun) {
      runTests();
    }
  });
}

function shutdown() {
  shuttingDown = true;

  if (rerunTimer !== null) {
    clearTimeout(rerunTimer);
    rerunTimer = null;
  }

  for (let watcher of watchers) {
    watcher.close();
  }

  watchers = [];

  if (currentRun !== null) {
    currentRun.once('exit', (code) => {
      process.exit(code ?? 0);
    });
    currentRun.kill('SIGTERM');
    return;
  }

  process.exit(process.exitCode ?? 0);
}
