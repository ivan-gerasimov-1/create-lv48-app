import { access, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

import typescript from 'typescript';

const { ModuleKind, ScriptTarget, transpileModule } = typescript;

export async function resolve(specifier, context, nextResolve) {
  if (hasTypeScriptExtension(specifier)) {
    return {
      shortCircuit: true,
      url: resolveTypeScriptSpecifierUrl(specifier, context.parentURL),
    };
  }

  if (isRelativeOrAbsolute(specifier) && specifier.endsWith('.js')) {
    const typeScriptUrl = await resolveTypeScriptSibling(specifier, context.parentURL);

    if (typeScriptUrl !== undefined) {
      return {
        shortCircuit: true,
        url: typeScriptUrl,
      };
    }
  }

  return nextResolve(specifier, context);
}

export async function load(url, context, nextLoad) {
  if (!hasTypeScriptExtension(url)) {
    return nextLoad(url, context);
  }

  const source = await readFile(fileURLToPath(url), 'utf8');
  const result = transpileModule(source, {
    compilerOptions: {
      module: ModuleKind.ESNext,
      inlineSourceMap: true,
      target: ScriptTarget.ES2022,
      verbatimModuleSyntax: true,
    },
    fileName: fileURLToPath(url),
  });

  return {
    format: 'module',
    shortCircuit: true,
    source: result.outputText,
  };
}

function hasTypeScriptExtension(value) {
  return value.endsWith('.ts') || value.endsWith('.mts') || value.endsWith('.cts');
}

function isRelativeOrAbsolute(specifier) {
  return specifier.startsWith('./') || specifier.startsWith('../') || specifier.startsWith('/');
}

function resolveTypeScriptSpecifierUrl(specifier, parentUrl) {
  if (specifier.startsWith('file://')) {
    return specifier;
  }

  if (typeof parentUrl === 'string') {
    return new URL(specifier, parentUrl).href;
  }

  return pathToFileURL(path.resolve(specifier)).href;
}

async function resolveTypeScriptSibling(specifier, parentUrl) {
  const resolvedUrl = new URL(specifier, parentUrl);
  const resolvedPath = fileURLToPath(resolvedUrl);
  const extension = path.extname(resolvedPath);
  const basePath = resolvedPath.slice(0, -extension.length);
  const candidates = ['.ts', '.mts', '.cts'].map((candidateExtension) =>
    pathToFileURL(`${basePath}${candidateExtension}`).href,
  );

  for (const candidateUrl of candidates) {
    if (await fileExists(fileURLToPath(candidateUrl))) {
      return candidateUrl;
    }
  }

  return undefined;
}

async function fileExists(filePath) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}
