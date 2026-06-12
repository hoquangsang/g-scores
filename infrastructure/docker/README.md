# Docker Runtime

`infrastructure/docker` contains Docker Compose files for local development and
integration testing.

## Files

- `compose.yml`: shared base compose file.
- `compose.local.yml`: local API, Web, PostgreSQL, and Redis runtime.
- `compose.test.yml`: isolated PostgreSQL and Redis services for tests.
- `.env.example`: local Docker environment template.
- `infra/db.yml`: PostgreSQL service definition.
- `infra/redis.yml`: Redis service definition.
- `services/api.yml`: API service definition.
- `services/web.yml`: Web service definition.

## Local Runtime

```bash
cp infrastructure/docker/.env.example infrastructure/docker/.env
pnpm docker:up
pnpm docker:logs
pnpm docker:down
```

Local services:

- API: http://localhost:3000
- Web: http://localhost:3001
- PostgreSQL: localhost:5432
- Redis: localhost:6379

## Test Runtime

```bash
pnpm docker:test:up
pnpm db:test:deploy
pnpm db:test:seed
pnpm test:int
pnpm --filter @repo/api test:e2e
pnpm docker:test:down
```

Test services use separate ports and the `g_scores_test` database.

## Production Note

Render deploys API and Web from their Dockerfiles directly. There is no
production compose file for this project.
