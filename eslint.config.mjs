import { basePreset } from '@repo/eslint-config/base';
import { javascriptPreset } from '@repo/eslint-config/js';
import { nodePreset } from '@repo/eslint-config/node';
import { reactPreset } from '@repo/eslint-config/react';
import { toolingPreset } from '@repo/eslint-config/tooling';

export default [
  ...basePreset(),
  ...nodePreset(['apps/api', 'packages']),
  ...reactPreset(['apps/web']),
  ...javascriptPreset(),
  ...toolingPreset(['tooling']),
];
