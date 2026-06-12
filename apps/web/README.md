# Web

`@repo/web` is the Next.js frontend for G-Scores. It provides the dashboard,
score lookup, report charts, and exam group rankings.

## Local Environment

Create `apps/web/.env` from `apps/web/.env.example`.

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
```

## Render Environment

```env
NEXT_PUBLIC_API_BASE_URL=https://<api-url>
```

The Web service uses `apps/web/Dockerfile` and runs as a Render Docker service.

## Scripts

```bash
pnpm --filter @repo/web dev
pnpm --filter @repo/web build
pnpm --filter @repo/web start
pnpm --filter @repo/web lint
pnpm --filter @repo/web typecheck
pnpm --filter @repo/web test:unit
```

## Routes

- `/`: overview dashboard and score reports.
- `/scores`: score lookup by registration number.
- `/rankings`: top candidates by exam group.

## Notes

- API calls go through `@repo/api-client`.
- The dashboard supports light and dark mode.
- Charts are implemented with SVG/CSS without a chart library.
