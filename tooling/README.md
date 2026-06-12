# Tooling

`tooling` contains shared configuration packages for the monorepo.

## Packages

- `@repo/typescript-config`: shared TypeScript presets.
- `@repo/eslint-config`: shared ESLint flat config presets.
- `@repo/jest-config`: shared Jest config helpers for NestJS API tests.
- `@repo/vitest-config`: shared Vitest config helpers for package and web tests.

## Usage

Applications and packages consume these configs through workspace dependencies.
Keep project-specific overrides inside the consuming package when needed.

## Root Commands

```bash
pnpm lint
pnpm typecheck
pnpm test:unit
pnpm test:int
pnpm build
```

## Notes

- Jest is used for the NestJS API.
- Vitest is used for packages and frontend helper tests.
- Turbo coordinates build, typecheck, and test tasks across the workspace.
