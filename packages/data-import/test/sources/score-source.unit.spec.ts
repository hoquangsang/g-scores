import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import type { Readable } from 'node:stream';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { openScoreSource } from '../../src/sources/score-source';

describe(openScoreSource.name, () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('opens a local score CSV file as a readable stream', async () => {
    const dir = await mkdtemp(join(tmpdir(), 'g-scores-import-'));
    const path = join(dir, 'scores.csv');
    await writeFile(path, 'sbd,toan\n01000001,8.4\n');

    try {
      const stream = await openScoreSource({ kind: 'file', path });

      await expect(readStream(stream)).resolves.toBe('sbd,toan\n01000001,8.4\n');
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  });

  it('opens a remote score CSV response as a readable stream', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => new Response('sbd,toan\n01000001,8.4\n')),
    );

    const stream = await openScoreSource({
      kind: 'url',
      url: 'https://example.test/scores.csv',
    });

    await expect(readStream(stream)).resolves.toBe('sbd,toan\n01000001,8.4\n');
  });

  it('throws when remote score CSV cannot be downloaded', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => new Response(null, { status: 404, statusText: 'Not Found' })),
    );

    await expect(
      openScoreSource({
        kind: 'url',
        url: 'https://example.test/missing.csv',
      }),
    ).rejects.toThrow('Failed to download score CSV: 404 Not Found');
  });
});

async function readStream(stream: Readable): Promise<string> {
  const chunks: Buffer[] = [];

  for await (const chunk of stream) {
    chunks.push(Buffer.from(chunk));
  }

  return Buffer.concat(chunks).toString('utf8');
}
