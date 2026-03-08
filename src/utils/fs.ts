import { mkdir, readdir, readFile, rm, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';

export async function pathExists(targetPath: string): Promise<boolean> {
  try {
    await stat(targetPath);
    return true;
  } catch {
    return false;
  }
}

export async function ensureDirectory(targetPath: string): Promise<boolean> {
  const exists = await pathExists(targetPath);

  if (exists) {
    return false;
  }

  await mkdir(targetPath, { recursive: true });
  return true;
}

export async function listRelativeFiles(rootDirectory: string): Promise<string[]> {
  return walkDirectory(rootDirectory, rootDirectory);
}

export async function listRelativeDirectories(rootDirectory: string): Promise<string[]> {
  return walkDirectories(rootDirectory, rootDirectory);
}

async function walkDirectory(rootDirectory: string, currentDirectory: string): Promise<string[]> {
  const entries = await readdir(currentDirectory, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const absolutePath = path.join(currentDirectory, entry.name);

    if (entry.isDirectory()) {
      files.push(...(await walkDirectory(rootDirectory, absolutePath)));
      continue;
    }

    if (entry.isFile()) {
      files.push(path.relative(rootDirectory, absolutePath));
    }
  }

  return files.sort();
}

async function walkDirectories(
  rootDirectory: string,
  currentDirectory: string,
): Promise<string[]> {
  const entries = await readdir(currentDirectory, { withFileTypes: true });
  const directories: string[] = [];

  for (const entry of entries) {
    if (!entry.isDirectory()) {
      continue;
    }

    const absolutePath = path.join(currentDirectory, entry.name);
    directories.push(path.relative(rootDirectory, absolutePath));
    directories.push(...(await walkDirectories(rootDirectory, absolutePath)));
  }

  return directories.sort();
}

export async function readUtf8File(targetPath: string): Promise<string> {
  return readFile(targetPath, 'utf8');
}

export async function writeUtf8File(targetPath: string, contents: string): Promise<void> {
  await writeFile(targetPath, contents, 'utf8');
}

export async function removePaths(targetPaths: string[]): Promise<void> {
  for (const targetPath of [...targetPaths].reverse()) {
    await rm(targetPath, { recursive: true, force: true });
  }
}
