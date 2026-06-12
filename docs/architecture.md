# Architecture

G-Scores is organized as a pnpm/Turbo monorepo. The repo separates runtime apps
from reusable packages so API, frontend, database, import, cache, and generated
client code can evolve independently.

## System Overview

```text
Supabase Storage / local CSV
  -> packages/data-import
  -> PostgreSQL
  -> apps/api
  -> packages/api-client
  -> apps/web

Redis is used by the API for read-heavy catalog and report queries.
```

## Applications

- `apps/api`: NestJS API with validation, Swagger/OpenAPI, Prisma repositories,
  Redis-backed caching, and response envelopes.
- `apps/web`: Next.js dashboard for overview reports, score lookup, and exam
  group rankings.

## Packages

- `packages/database`: Prisma schema, client factory, migrations, and catalog
  seed.
- `packages/data-import`: PostgreSQL COPY import pipeline for the score CSV.
- `packages/api-client`: typed OpenAPI client consumed by the frontend.
- `packages/cache`: cache abstraction with noop, memory, and Redis stores.

## Data Flow

1. The CSV file is read from a public URL or local file.
2. The import package copies raw rows into PostgreSQL.
3. SQL normalization inserts candidates and candidate scores.
4. The API queries normalized tables for lookup, reports, and rankings.
5. The frontend calls the API through the generated API client.

## API Modules

- `health`: runtime health endpoint.
- `catalogs`: subjects and exam groups.
- `scores`: score lookup by registration number.
- `reports`: summary, score levels, score distribution, and top groups.

## Database Shape

The core domain tables are:

- `Candidate`
- `Subject`
- `CandidateScore`
- `ForeignLanguage`
- `ExamGroup`
- `ExamGroupSubject`

The raw import table keeps CSV-shaped rows so import can be repeated and
debugged without loading the full file into application memory.

## Cache Strategy

The API caches read-heavy data:

- subject catalog
- exam group catalog
- report summary
- score level reports
- score distributions
- top group rankings

Score lookup is intentionally not cached because it is a direct key lookup and
less expensive than aggregate reports.
