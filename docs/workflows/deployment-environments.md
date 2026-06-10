# Deployment Environments

API and Web are deployed with Render Docker services. Database migration, seed, score import, and Render deploy hooks are controlled manually by GitHub Actions inputs.

Staging and production use the same setup. They differ only by branch, URLs, database credentials, and deploy hook secrets.

## Environment Mapping

| Branch    | GitHub Environment | Purpose            |
| --------- | ------------------ | ------------------ |
| `develop` | `staging`          | Integration deploy |
| `main`    | `production`       | Release deploy     |

## Render Service Settings

Apply these settings to API and Web services in both environments:

```text
Language: Docker
Root Directory: empty
Docker Build Context Directory: .
Docker Command: empty
Pre-Deploy Command: empty
Auto-Deploy: Off
```

Render deploys are triggered manually by GitHub Actions through deploy hooks.

## API Service

```text
Dockerfile Path: apps/api/Dockerfile
Health Check Path: /health
```

Environment variables:

```env
API_PORT=10000
API_CORS_ORIGINS=https://<web-url>
DATABASE_URL=<database-runtime-url>
DIRECT_URL=<database-direct-url>
DATA_IMPORT_SCORE_CSV_URL=<public-csv-url>
```

## Web Service

```text
Dockerfile Path: apps/web/Dockerfile
Health Check Path: /
```

Environment variables:

```env
NEXT_PUBLIC_API_BASE_URL=https://<api-url>
```

## GitHub Secrets

Store deploy hooks and database URLs in the matching GitHub Environment:

```text
DATABASE_URL
DIRECT_URL
RENDER_API_DEPLOY_HOOK_URL
RENDER_WEB_DEPLOY_HOOK_URL
```

Do not store staging secrets in `production` or production secrets in `staging`.

Store `DATA_IMPORT_SCORE_CSV_URL` as an environment var. Use the staging CSV for `staging` and the full CSV for `production`.

## Verification

After deployment:

```text
GET https://<api-url>/health
GET https://<web-url>
```

Both checks should pass before continuing with the next issue or release step.
