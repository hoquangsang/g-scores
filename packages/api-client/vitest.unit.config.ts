import { nodeConfig } from '@repo/vitest-config';

export default nodeConfig({
  test: {
    include: ['test/**/*.unit.spec.ts'],
  },
});
