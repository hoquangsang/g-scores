import { defineConfig, mergeConfig } from 'vitest/config';
import type { UserConfig } from 'vitest/config';

const coverageExclude = [
  'node_modules/**',
  'dist/**',
  '.next/**',
  'coverage/**',
  'prisma/**',
  'test/**',
  '**/generated/**',
  '**/index.ts',
  '**/*.repository.ts',
  '**/*.config.*',
  '**/*.d.ts',
  '**/*.spec.ts',
];

export function nodeConfig(overrides: UserConfig = {}): UserConfig {
  return mergeConfig(
    defineConfig({
      test: {
        globals: false,
        environment: 'node',
        coverage: {
          provider: 'v8',
          reporter: ['text', 'json', 'html'],
          exclude: coverageExclude,
        },
      },
    }),
    overrides,
  );
}

export function browserConfig(overrides: UserConfig = {}): UserConfig {
  return mergeConfig(
    defineConfig({
      test: {
        globals: false,
        environment: 'jsdom',
        css: true,
        coverage: {
          provider: 'v8',
          reporter: ['text', 'json', 'html'],
          exclude: coverageExclude,
        },
      },
    }),
    overrides,
  );
}
