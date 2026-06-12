# Data Import

`@repo/data-import` imports the THPT score CSV into PostgreSQL.

## Import Flow

1. Read a CSV file from `DATA_IMPORT_SCORE_CSV_URL` or a local `--file`.
2. Use PostgreSQL `COPY` to load raw rows efficiently.
3. Normalize raw rows into candidates and candidate scores.
4. Keep raw rows by default for debugging and repeatability.

The command does not load the full CSV into application memory.

## Scripts

```bash
pnpm data:import:scores
pnpm --filter @repo/data-import import:scores
pnpm --filter @repo/data-import test:unit
pnpm --filter @repo/data-import test:int
```

## Environment

```env
DATABASE_URL=postgresql://...
DIRECT_URL=postgresql://...
DATA_IMPORT_SCORE_CSV_URL=https://example.com/diem_thi_thpt_2024.csv
```

## Overrides

```bash
pnpm data:import:scores -- --url https://example.com/scores.csv
pnpm data:import:scores -- --file .tmp/diem_thi_thpt_2024.csv
pnpm data:import:scores -- --clear-raw-after-import
```

## Notes

- The import is repeatable: normalized score data is cleared and rebuilt.
- `0` is treated as a real score.
- Missing scores remain missing and are not converted to `0`.
- Candidate track classification supports natural, social, and unknown cases.
