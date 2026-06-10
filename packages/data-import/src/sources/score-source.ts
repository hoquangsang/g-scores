import { createReadStream } from 'node:fs';
import { Readable } from 'node:stream';
import type { ReadableStream as NodeReadableStream } from 'node:stream/web';

export type ScoreSource =
  | {
      kind: 'file';
      path: string;
    }
  | {
      kind: 'url';
      url: string;
    };

export async function openScoreSource(source: ScoreSource): Promise<Readable> {
  if (source.kind === 'file') {
    return createReadStream(source.path);
  }

  const response = await fetch(source.url);

  if (!response.ok || response.body === null) {
    throw new Error(`Failed to download score CSV: ${response.status} ${response.statusText}`);
  }

  return Readable.fromWeb(response.body as NodeReadableStream<Uint8Array>);
}
