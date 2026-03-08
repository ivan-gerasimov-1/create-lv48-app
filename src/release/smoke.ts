import { mkdir, mkdtemp } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

export type ReleaseSmokePaths = {
  workspaceRoot: string;
  npmCacheDirectory: string;
  packDirectory: string;
  installDirectory: string;
  runDirectory: string;
  generatedProjectRoot: string;
};

const WINDOWS_NPM_BIN_SUFFIX = '.cmd';

export async function createReleaseSmokePaths(): Promise<ReleaseSmokePaths> {
  const workspaceRoot = await mkdtemp(path.join(os.tmpdir(), 'lv48-release-smoke-'));
  const npmCacheDirectory = path.join(workspaceRoot, 'npm-cache');
  const packDirectory = path.join(workspaceRoot, 'packed');
  const installDirectory = path.join(workspaceRoot, 'install-root');
  const runDirectory = path.join(workspaceRoot, 'run-root');
  const generatedProjectRoot = path.join(runDirectory, 'smoke-app');

  await mkdir(npmCacheDirectory, { recursive: true });
  await mkdir(packDirectory, { recursive: true });
  await mkdir(installDirectory, { recursive: true });
  await mkdir(runDirectory, { recursive: true });

  return {
    workspaceRoot,
    npmCacheDirectory,
    packDirectory,
    installDirectory,
    runDirectory,
    generatedProjectRoot,
  };
}

export function getInstalledSmokeCliPath(
  installDirectory: string,
  platform: NodeJS.Platform = process.platform,
): string {
  const executableName =
    platform === 'win32'
      ? `create-lv48-app${WINDOWS_NPM_BIN_SUFFIX}`
      : 'create-lv48-app';

  return path.join(installDirectory, 'node_modules', '.bin', executableName);
}
