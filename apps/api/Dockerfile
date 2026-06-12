# syntax=docker/dockerfile:1

FROM node:22-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
WORKDIR /app

FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json ./
COPY apps/api/package.json apps/api/package.json
COPY packages/cache/package.json packages/cache/package.json
COPY packages/database/package.json packages/database/package.json
COPY tooling/typescript-config/package.json tooling/typescript-config/package.json
COPY tooling/eslint-config/package.json tooling/eslint-config/package.json
RUN pnpm install --frozen-lockfile --filter @repo/api... --ignore-scripts

FROM deps AS builder
COPY . .
RUN pnpm --filter @repo/cache build
RUN pnpm --filter @repo/database build
RUN pnpm --filter @repo/api build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/api/package.json apps/api/package.json
COPY packages/cache/package.json packages/cache/package.json
COPY packages/database/package.json packages/database/package.json
RUN pnpm install --prod --filter @repo/api... --frozen-lockfile --ignore-scripts
COPY --from=builder /app/apps/api/dist apps/api/dist
COPY --from=builder /app/packages/cache/dist packages/cache/dist
COPY --from=builder /app/packages/database/dist packages/database/dist
COPY --from=builder /app/packages/database/prisma packages/database/prisma
COPY --from=builder /app/packages/database/prisma.config.ts packages/database/prisma.config.ts
EXPOSE 3000
CMD ["node", "apps/api/dist/main.js"]
