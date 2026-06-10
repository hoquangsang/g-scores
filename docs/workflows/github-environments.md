# GitHub Environments

Create these environments in GitHub:

```text
staging
production
```

The deploy workflow uses the selected environment to load secrets and vars.

## Required Secrets

Add these secrets to each environment:

```text
DATABASE_URL
DIRECT_URL
RENDER_API_DEPLOY_HOOK_URL
RENDER_WEB_DEPLOY_HOOK_URL
```

Use the environment-specific database URLs and Render deploy hooks.

## Environment Vars

Add this variable to each environment:

```text
NODE_VERSION=22
```

## Protection

For `production`, add required reviewers if production deploys should wait for manual approval after the release PR is merged into `main`.
