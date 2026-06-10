# Deploy Workflow

Deployment is handled by GitHub Actions in `.github/workflows/deploy.yml`.

The workflow runs automatically after `CI` passes on pushes to the long-lived branches:

- `develop` -> `staging`
- `main` -> `production`

It can also be rerun manually from the Actions tab with `workflow_dispatch`.

## Release Flow

Use two pull requests for `v0.1.0`:

1. Merge the deployment workflow PR into `develop`.
2. Let `develop` deploy to `staging`.
3. Verify API, Web, migration, and seed on staging.
4. Open a release PR from `develop` into `main`.
5. Merge with title `Release v0.1.0`.
6. Create tag `v0.1.0` on `main`.

## Automatic Deploy

The automatic flow is:

1. Push or merge into `develop` or `main`.
2. `CI` runs quality checks.
3. `Deploy` runs only if `CI` succeeds.
4. GitHub Actions runs Prisma migration and seed.
5. GitHub Actions triggers Render deploy hooks for API and Web.

For `production`, use GitHub Environment protection if production deploys should require approval after the release PR is merged.

## Manual Deploy

Use manual deploy for reruns or recovery.

Inputs:

- `environment`: `staging` or `production`
- `ref`: branch, tag, or commit SHA
- `run_migration`: run `pnpm db:deploy`
- `run_seed`: run `pnpm db:seed`
- `deploy_api`: trigger API deploy hook
- `deploy_web`: trigger Web deploy hook

Recommended staging rerun:

```text
environment=staging
ref=develop
run_migration=true
run_seed=true
deploy_api=true
deploy_web=true
```

Recommended production rerun:

```text
environment=production
ref=main
run_migration=true
run_seed=true
deploy_api=true
deploy_web=true
```
