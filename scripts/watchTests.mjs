import { spawn } from 'node:child_process';
import { readdir } from 'node:fs/promises';
import { unwatchFile, watchFile } from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const fileExtensions = new Set(['.cts', '.json', '.mjs', '.mts', '.ts']);
const scanRoots = ['scripts', 'src', 'tests'];
const watchedFiles = new Map();
const scanIntervalMs = 1000;
const watchIntervalMs = 300;

let currentRun = null;
let rerunTimer = null;
let scanTimer = null;
let rerunPending = false;
let stopRequested = false;
let shuttingDown = false;

await syncWatchedFiles();
runTests();
scanTimer = setInterval(() => {
  void syncWatchedFiles();
}, scanIntervalMs);

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
process.on('exit', stopWatching);

async function syncWatchedFiles() {
  const discoveredFiles = new Set();

  for (const scanRoot of scanRoots) {
    const absoluteRoot = path.join(process.cwd(), scanRoot);
    const filePaths = await collectWatchableFiles(absoluteRoot);

    for (const filePath of filePaths) {
      discoveredFiles.add(filePath);

      if (watchedFiles.has(filePath)) {
        continue;
      }

      const watcher = createFileWatcher(filePath);
      watchedFiles.set(filePath, watcher);
    }
  }

  for (const [filePath, watcher] of watchedFiles.entries()) {
    if (discoveredFiles.has(filePath)) {
      continue;
    }

    unwatchFile(filePath, watcher);
    watchedFiles.delete(filePath);
  }
}

async function collectWatchableFiles(directoryPath) {
  let entries;

  try {
    entries = await readdir(directoryPath, { withFileTypes: true });
  } catch {
    return [];
  }

  const filePaths = [];

  for (const entry of entries) {
    const entryPath = path.join(directoryPath, entry.name);

    if (entry.isDirectory()) {
      filePaths.push(...(await collectWatchableFiles(entryPath)));
      continue;
    }

    if (!entry.isFile()) {
      continue;
    }

    if (!fileExtensions.has(path.extname(entry.name))) {
      continue;
    }

    filePaths.push(entryPath);
  }

  return filePaths;
}

function createFileWatcher(filePath) {
  const watcher = (currentStats, previousStats) => {
    if (currentStats.mtimeMs === previousStats.mtimeMs) {
      return;
    }

    scheduleRerun();
  };

  watchFile(filePath, { interval: watchIntervalMs }, watcher);
  return watcher;
}

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
    ['--loader', './scripts/tsTestLoader.mjs', './scripts/runTests.mjs'],
    {
      cwd: process.cwd(),
      stdio: 'inherit',
    },
  );

  currentRun.once('exit', (code, signal) => {
    const shouldRerun = rerunPending;

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

  if (scanTimer !== null) {
    clearInterval(scanTimer);
    scanTimer = null;
  }

  stopWatching();

  if (currentRun !== null) {
    currentRun.once('exit', (code) => {
      process.exit(code ?? 0);
    });
    currentRun.kill('SIGTERM');
    return;
  }

  process.exit(process.exitCode ?? 0);
}

function stopWatching() {
  for (const [filePath, watcher] of watchedFiles.entries()) {
    unwatchFile(filePath, watcher);
  }

  watchedFiles.clear();
}
