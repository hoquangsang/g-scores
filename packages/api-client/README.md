# API Client

`@repo/api-client` is the typed OpenAPI client used by the frontend.

## Responsibilities

- Generate TypeScript types from the API OpenAPI schema.
- Wrap `openapi-fetch` with project helpers.
- Provide typed functions for health, catalogs, scores, and reports.

## Scripts

```bash
pnpm --filter @repo/api openapi:generate
pnpm --filter @repo/api-client generate
pnpm --filter @repo/api-client build
pnpm --filter @repo/api-client test:unit
```

`build` runs generation before TypeScript build.

## Usage

```ts
import { createApiClient, getReportSummary } from '@repo/api-client';

const client = createApiClient({
  baseUrl: 'https://example-api.onrender.com',
});

const summary = await getReportSummary(client);
```

## Notes

- Source OpenAPI schema: `apps/api/generated/openapi/schema.json`.
- Generated types live in `src/generated/openapi/types.ts`.
- Regenerate the API schema before regenerating client types after API changes.
