# syntax=docker/dockerfile:1

FROM node:22-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
WORKDIR /app

FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY apps/api/package.json apps/api/package.json
COPY apps/web/package.json apps/web/package.json
COPY tooling/typescript-config/package.json tooling/typescript-config/package.json
COPY tooling/eslint-config/package.json tooling/eslint-config/package.json
RUN pnpm install --frozen-lockfile --ignore-scripts

FROM deps AS builder
COPY . .
RUN pnpm --filter @repo/api build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/api/package.json apps/api/package.json
RUN pnpm install --prod --filter @repo/api --frozen-lockfile --ignore-scripts
COPY --from=builder /app/apps/api/dist apps/api/dist
WORKDIR /app/apps/api
EXPOSE 3000
CMD ["node", "dist/main.js"]
