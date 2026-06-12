# G-Scores

G-Scores is a full-stack score analytics app for the Vietnamese THPT 2024 exam
dataset. It imports raw CSV scores into PostgreSQL, exposes a typed NestJS API,
and serves a responsive Next.js dashboard for score lookup, reports, and group
rankings.

## Demo

- Web: https://g-scores-web-prod.onrender.com
- API: https://g-scores-wzpp.onrender.com
- Swagger: https://g-scores-wzpp.onrender.com/api/docs

## Features

- Import the raw exam score CSV into a relational database.
- Search candidate scores by registration number.
- Report score levels by subject.
- View score distribution charts by subject.
- List top candidates by exam group, including group A.
- Responsive dashboard with light and dark mode.
- Docker local runtime and Render deployment.

## Requirement Mapping

| Requirement                         | Status                                        |
| ----------------------------------- | --------------------------------------------- |
| Store raw CSV data in a database    | Done with PostgreSQL, Prisma, and COPY import |
| Score lookup by registration number | Done                                          |
| Score level report by subject       | Done                                          |
| Top 10 group A students             | Done                                          |
| Form validation and strict logic    | Done in API DTOs and global validation        |
| ORM for database access             | Done with Prisma                              |
| Docker setup                        | Done                                          |
| Live deployment                     | Done with Render                              |
| Responsive UI                       | Done                                          |

## Tech Stack

- Monorepo: Turborepo, pnpm
- Backend: NestJS, TypeScript, Swagger/OpenAPI
- Frontend: Next.js, React
- Database: PostgreSQL, Prisma
- Data import: PostgreSQL COPY
- Cache: Redis, in-memory fallback
- Tests: Jest, Vitest, integration and API e2e tests
- Deployment: Render, GitHub Actions

## Architecture

```text
CSV dataset
  -> packages/data-import
  -> PostgreSQL
  -> apps/api
  -> packages/api-client
  -> apps/web

Redis caches catalog and report queries.
```

More details: [Architecture](./docs/architecture.md).

## Project Structure

```text
apps/
  api/                 NestJS API
  web/                 Next.js frontend
packages/
  database/            Prisma/PostgreSQL package
  data-import/         CSV import pipeline
  api-client/          OpenAPI generated client
  cache/               Cache abstraction and Redis store
infrastructure/
  docker/              Local and test Docker runtime
docs/                  Architecture and workflow docs
tooling/               Shared TypeScript, ESLint, Jest, Vitest config
```

## Quick Start

```bash
pnpm install
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env
cp infrastructure/docker/.env.example infrastructure/docker/.env

pnpm docker:up
pnpm db:deploy
pnpm db:seed
pnpm data:import:scores
pnpm dev
```

Default local URLs:

- Web: http://localhost:3001
- API: http://localhost:3000
- Swagger: http://localhost:3000/api/docs

## Scripts

```bash
pnpm lint
pnpm typecheck
pnpm test:unit
pnpm test:int
pnpm --filter @repo/api test:e2e
pnpm build
```

## Local Runtime

Docker Compose starts PostgreSQL, Redis, API, and Web services for local
development. Test Compose starts isolated PostgreSQL and Redis services for
integration/e2e tests.

Details: [Docker Runtime](./infrastructure/docker/README.md).

## Deployment

Deployment is controlled by GitHub Actions and Render deploy hooks.

- `develop` is used for staging.
- `main` is used for production.
- Migrations, seed, and data import run from GitHub Actions.
- Render deploy hooks trigger API and Web deployments.

Details: [Workflow](./docs/workflow.md).

## Package Guides

- [API](./apps/api/README.md)
- [Web](./apps/web/README.md)
- [Database](./packages/database/README.md)
- [Data Import](./packages/data-import/README.md)
- [API Client](./packages/api-client/README.md)
- [Cache](./packages/cache/README.md)
- [Tooling](./tooling/README.md)
