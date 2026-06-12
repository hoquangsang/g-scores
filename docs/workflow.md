# Workflow

This document describes how CI, deployment, and release flow work for G-Scores.

## Branch Flow

```text
feature branch -> develop -> main
```

- Feature branches are merged into `develop` through pull requests.
- `develop` is deployed to staging.
- Release pull requests move verified code from `develop` to `main`.
- `main` is deployed to production.

## CI

CI is defined in `.github/workflows/ci.yml` and runs on pull requests into
`develop` and `main`.

The quality job runs:

```bash
pnpm format:check
pnpm lint
pnpm typecheck
pnpm test:unit
pnpm build
```

The integration job starts PostgreSQL and Redis services, then runs:

```bash
pnpm db:test:deploy
pnpm db:test:seed
pnpm test:int
pnpm --filter @repo/api test:e2e
```

## Deployment

Deployment is defined in `.github/workflows/deploy.yml` and is manual through
`workflow_dispatch`.

Inputs:

- `environment`: `staging` or `production`
- `ref`: branch, tag, or commit SHA
- `run_migration`: run Prisma migrations
- `run_seed`: seed reference catalog data
- `run_data_import`: import score CSV data
- `deploy_api`: trigger Render API deploy hook
- `deploy_web`: trigger Render Web deploy hook

All boolean inputs default to `false` so deploy steps are explicit.

## GitHub Environments

Create these GitHub environments:

```text
staging
production
```

Required secrets:

```text
DATABASE_URL
DIRECT_URL
RENDER_API_DEPLOY_HOOK_URL
RENDER_WEB_DEPLOY_HOOK_URL
```

Required or recommended vars:

```text
NODE_VERSION=22
DATA_IMPORT_SCORE_CSV_URL=<public-csv-url>
```

## Render Services

Both API and Web use Render Docker services.

Common settings:

```text
Language: Docker
Root Directory: empty
Docker Build Context Directory: .
Docker Command: empty
Pre-Deploy Command: empty
Auto-Deploy: Off
```

API:

```text
Dockerfile Path: apps/api/Dockerfile
Health Check Path: /health
```

Web:

```text
Dockerfile Path: apps/web/Dockerfile
Health Check Path: /
```

## Release Flow

1. Merge feature PRs into `develop`.
2. Run deploy workflow for `staging` from `develop`.
3. Verify Web, API, Swagger, migrations, seed, and import if selected.
4. Open a release PR from `develop` into `main`.
5. Merge with a release title.
6. Run deploy workflow for `production` from `main`.

## Common Deploy Runs

Initial staging database setup:

```text
environment=staging
ref=develop
run_migration=true
run_seed=true
run_data_import=true
deploy_api=false
deploy_web=false
```

Staging app deploy:

```text
environment=staging
ref=develop
deploy_api=true
deploy_web=true
```

Production app deploy:

```text
environment=production
ref=main
deploy_api=true
deploy_web=true
```
