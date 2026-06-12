import { afterEach, describe, expect, it, vi } from 'vitest';

import { exportCsv } from '../../src/lib/export';

describe(exportCsv.name, () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('creates and downloads UTF-8 CSV content', () => {
    const click = vi.fn();
    const anchor = {
      href: '',
      download: '',
      click,
    };
    const createObjectUrl = vi.fn(() => 'blob:csv');
    const revokeObjectUrl = vi.fn();
    const BlobMock = vi.fn((parts: unknown[], options: { readonly type?: string }) => ({
      parts,
      options,
    }));

    vi.stubGlobal('Blob', BlobMock);
    vi.stubGlobal('URL', {
      createObjectURL: createObjectUrl,
      revokeObjectURL: revokeObjectUrl,
    });
    vi.stubGlobal('document', {
      createElement: vi.fn(() => anchor),
    });

    exportCsv('scores.csv', ['Môn', 'Điểm'], [['Toán', 8.4]]);

    expect(BlobMock).toHaveBeenCalledWith(['\uFEFF"Môn","Điểm"\n"Toán","8.4"'], {
      type: 'text/csv;charset=utf-8',
    });
    expect(anchor).toMatchObject({
      href: 'blob:csv',
      download: 'scores.csv',
    });
    expect(click).toHaveBeenCalledTimes(1);
    expect(revokeObjectUrl).toHaveBeenCalledWith('blob:csv');
  });

  it('escapes double quotes in CSV cells', () => {
    const BlobMock = vi.fn((parts: unknown[]) => ({ parts }));
    vi.stubGlobal('Blob', BlobMock);
    vi.stubGlobal('URL', {
      createObjectURL: vi.fn(() => 'blob:csv'),
      revokeObjectURL: vi.fn(),
    });
    vi.stubGlobal('document', {
      createElement: vi.fn(() => ({ click: vi.fn() })),
    });

    exportCsv('quoted.csv', ['Name'], [['A "quoted" value']]);

    expect(BlobMock).toHaveBeenCalledWith(['\uFEFF"Name"\n"A ""quoted"" value"'], {
      type: 'text/csv;charset=utf-8',
    });
  });
});
