import { nestConfig } from '@repo/jest-config';

export default nestConfig({
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@repo/(.*)$': '<rootDir>/../../packages/$1/src',
  },
});
