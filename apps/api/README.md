# API

`@repo/api` is the NestJS backend for G-Scores. It exposes score lookup,
catalog, report, ranking, health, and Swagger/OpenAPI endpoints.

## Local Environment

Create `apps/api/.env` from `apps/api/.env.example`.

```env
API_PORT=3000
API_PREFIX=api
API_VERSION=1
API_CORS_ORIGINS=http://localhost:3001
API_ENABLE_SWAGGER=true
API_CACHE_DRIVER=redis
API_CACHE_TTL_SECONDS=300

DATABASE_URL=postgresql://postgres:postgres@localhost:5432/g_scores?schema=public
DIRECT_URL=postgresql://postgres:postgres@localhost:5432/g_scores?schema=public
REDIS_URL=redis://localhost:6379
DATA_IMPORT_SCORE_CSV_URL=<public-csv-url>
```

## Render Environment

Use environment-specific values for staging and production.

```env
API_PORT=10000
API_PREFIX=api
API_VERSION=1
API_CORS_ORIGINS=https://<web-url>
API_ENABLE_SWAGGER=true
API_CACHE_DRIVER=redis
API_CACHE_TTL_SECONDS=300

DATABASE_URL=<postgres-runtime-url>
DIRECT_URL=<postgres-direct-url>
REDIS_URL=<redis-url>
DATA_IMPORT_SCORE_CSV_URL=<public-csv-url>
```

## Scripts

```bash
pnpm --filter @repo/api dev
pnpm --filter @repo/api build
pnpm --filter @repo/api start
pnpm --filter @repo/api test:unit
pnpm --filter @repo/api test:int
pnpm --filter @repo/api test:e2e
pnpm --filter @repo/api openapi:generate
```

## Endpoints

- `GET /health`
- `GET /api/v1/catalogs/subjects`
- `GET /api/v1/catalogs/exam-groups`
- `GET /api/v1/scores/:registrationNumber`
- `GET /api/v1/reports/summary`
- `GET /api/v1/reports/score-levels`
- `GET /api/v1/reports/score-levels/:subjectCode`
- `GET /api/v1/reports/score-distribution/:subjectCode`
- `GET /api/v1/reports/top-groups/:groupCode?limit=10`

Swagger is available at:

```text
/api/docs
```

## Notes

- API responses use a consistent success/error envelope.
- Validation is handled by NestJS global validation pipes.
- Report and catalog queries are cached through `@repo/cache`.
- OpenAPI schema is generated into `apps/api/generated/openapi/schema.json`.
