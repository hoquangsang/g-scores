export type CsvCell = string | number | null | undefined;

export function exportCsv(filename: string, headers: string[], rows: CsvCell[][]): void {
  const csv = [headers, ...rows]
    .map((row) => row.map((cell) => escapeCsvCell(cell)).join(','))
    .join('\n');
  const blob = new Blob([`\uFEFF${csv}`], {
    type: 'text/csv;charset=utf-8',
  });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');

  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

function escapeCsvCell(cell: CsvCell): string {
  const value = cell === null || cell === undefined ? '' : String(cell);
  return `"${value.replaceAll('"', '""')}"`;
}
