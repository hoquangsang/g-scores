# Database

`@repo/database` owns the Prisma schema, generated client, migrations, and
catalog seed data for G-Scores.

## Responsibilities

- Define the PostgreSQL schema.
- Generate the Prisma client.
- Run migrations in local, test, staging, and production environments.
- Seed reference data such as subjects, foreign languages, and exam groups.
- Export database client helpers for application packages.

## Scripts

```bash
pnpm --filter @repo/database db:generate
pnpm --filter @repo/database db:migrate
pnpm --filter @repo/database db:deploy
pnpm --filter @repo/database db:reset
pnpm --filter @repo/database db:seed
pnpm --filter @repo/database db:studio
pnpm --filter @repo/database test:unit
pnpm --filter @repo/database test:int
```

Root shortcuts are also available:

```bash
pnpm db:generate
pnpm db:deploy
pnpm db:seed
pnpm db:studio
```

## Core Tables

- `Candidate`
- `Subject`
- `CandidateScore`
- `ForeignLanguage`
- `ExamGroup`
- `ExamGroupSubject`

The import pipeline also uses a raw CSV-shaped table for bulk import and
debugging.

## Environment

The package reads `DATABASE_URL` and `DIRECT_URL`.

Local example:

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/g_scores?schema=public
DIRECT_URL=postgresql://postgres:postgres@localhost:5432/g_scores?schema=public
```

Test commands load `.env.test` through root scripts.
