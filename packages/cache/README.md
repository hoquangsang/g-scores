# Cache

`@repo/cache` provides a small cache abstraction used by the API.

## Stores

- Noop store: disables caching.
- Memory store: local in-process cache.
- Redis store: shared runtime cache for local Docker, staging, and production.

## API Configuration

```env
API_CACHE_DRIVER=redis
API_CACHE_TTL_SECONDS=300
REDIS_URL=redis://localhost:6379
```

Supported drivers:

```text
none
memory
redis
```

## Cached API Data

- subject catalog
- exam group catalog
- report summary
- score level reports
- score distributions
- top group rankings

Score lookup is not cached because it is a direct key lookup.

## Scripts

```bash
pnpm --filter @repo/cache build
pnpm --filter @repo/cache typecheck
pnpm --filter @repo/cache test:unit
pnpm --filter @repo/cache test:int
```
