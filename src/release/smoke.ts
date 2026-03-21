import { mkdir, mkdtemp } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

export type TReleaseSmokePaths = {
  workspaceRoot: string;
  npmCacheDirectory: string;
  packDirectory: string;
  installDirectory: string;
  runDirectory: string;
  generatedProjectRoot: string;
};

const WINDOWS_NPM_BIN_SUFFIX = '.cmd';

export async function createReleaseSmokePaths(): Promise<TReleaseSmokePaths> {
  let workspaceRoot = await mkdtemp(path.join(os.tmpdir(), 'lv48-release-smoke-'));
  let npmCacheDirectory = path.join(workspaceRoot, 'npm-cache');
  let packDirectory = path.join(workspaceRoot, 'packed');
  let installDirectory = path.join(workspaceRoot, 'install-root');
  let runDirectory = path.join(workspaceRoot, 'run-root');
  let generatedProjectRoot = path.join(runDirectory, 'smoke-app');

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
  let executableName =
    platform === 'win32'
      ? `create-lv48-app${WINDOWS_NPM_BIN_SUFFIX}`
      : 'create-lv48-app';

  return path.join(installDirectory, 'node_modules', '.bin', executableName);
}
