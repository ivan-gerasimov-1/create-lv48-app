import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { describe, it } from 'node:test';

describe('release please assets', () => {
  it('defines a single-package release-please contract', async () => {
    const config = JSON.parse(
      await readFile(path.join(process.cwd(), '.release-please-config.json'), 'utf8'),
    );
    const manifest = JSON.parse(
      await readFile(path.join(process.cwd(), '.release-please-manifest.json'), 'utf8'),
    );

    assert.deepEqual(config, {
      $schema: 'https://raw.githubusercontent.com/googleapis/release-please/main/schemas/config.json',
      packages: {
        '.': {
          'release-type': 'node',
          'package-name': 'create-lv48-app',
          'changelog-path': 'CHANGELOG.md',
        },
      },
    });
    assert.deepEqual(manifest, {
      '.': '0.3.1',
    });
  });

  it('removes legacy changesets assets from the active release path', async () => {
    await assert.rejects(
      readFile(path.join(process.cwd(), '.github', 'releaseAutomation.json'), 'utf8'),
    );
    await assert.rejects(
      readFile(path.join(process.cwd(), '.github', 'workflows', 'prReleaseChangeset.yml'), 'utf8'),
    );
    await assert.rejects(
      readFile(path.join(process.cwd(), 'scripts', 'syncPrChangeset.mjs'), 'utf8'),
    );
    await assert.rejects(
      readFile(path.join(process.cwd(), '.changeset', 'config.json'), 'utf8'),
    );
  });
});
