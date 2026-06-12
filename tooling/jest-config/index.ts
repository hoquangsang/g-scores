import type { Config } from 'jest';

export function nestConfig(overrides: Config = {}): Config {
  return {
    moduleFileExtensions: ['js', 'json', 'ts'],
    rootDir: '.',
    testEnvironment: 'node',
    transform: {
      '^.+\\.(t|j)s$': ['ts-jest', {}],
    },
    testPathIgnorePatterns: ['/node_modules/', '/dist/'],
    modulePathIgnorePatterns: ['<rootDir>/dist/'],
    collectCoverageFrom: [
      'src/**/*.(t|j)s',
      '!src/main.ts',
      '!src/**/index.ts',
      '!src/**/*.module.ts',
      '!src/**/*.dto.ts',
      '!src/**/*.repository.ts',
      '!src/**/*.request.ts',
      '!src/**/*.response.ts',
      '!src/generated/**',
    ],
    coverageDirectory: 'coverage',
    coveragePathIgnorePatterns: [
      '/node_modules/',
      '/dist/',
      '/generated/',
      '/src/main.ts',
      '/src/.*/index.ts',
      '/src/.*\\.module.ts',
      '/src/.*\\.dto.ts',
      '/src/.*\\.repository.ts',
    ],
    ...overrides,
  };
}
