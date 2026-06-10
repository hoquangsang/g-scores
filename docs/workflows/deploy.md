# Deploy Workflow

Deployment is handled by GitHub Actions in `.github/workflows/deploy.yml`.

The workflow is manual. Use it from the Actions tab when a deployment, migration, seed, or data import should run.

Recommended refs:

- `staging` -> `develop`
- `production` -> `main` or a release tag

## Release Flow

Use release pull requests to move verified code between long-lived branches:

1. Merge feature PRs into `develop`.
2. Run manual deploy for `staging` from `develop`.
3. Verify API, Web, migration, seed, and data import if selected.
4. Open a release PR from `develop` into `main`.
5. Merge release PR with a release title.
6. Run manual deploy for `production` from `main` or a release tag.

## Manual Deploy

Inputs:

- `environment`: `staging` or `production`
- `ref`: branch, tag, or commit SHA
- `run_migration`: run `pnpm db:deploy`
- `run_seed`: run `pnpm db:seed`
- `run_data_import`: run `pnpm data:import:scores` using PostgreSQL COPY
- `deploy_api`: trigger API deploy hook
- `deploy_web`: trigger Web deploy hook

All action inputs default to `false` except `environment` and `ref`.

Run seed before data import on a fresh database so subject and language catalogs exist.

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
run_migration=false
run_seed=false
run_data_import=false
deploy_api=true
deploy_web=true
```

Production app deploy:

```text
environment=production
ref=main
run_migration=false
run_seed=false
run_data_import=false
deploy_api=true
deploy_web=true
```
