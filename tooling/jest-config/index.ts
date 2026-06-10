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
    collectCoverageFrom: ['src/**/*.(t|j)s'],
    coverageDirectory: 'coverage',
    ...overrides,
  };
}
