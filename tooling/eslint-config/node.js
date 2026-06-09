import globals from 'globals';
import tseslint from 'typescript-eslint';

export function nodePreset(paths = []) {
  return tseslint.config({
    files: paths.map((path) => `${path}/**/*.{ts,tsx}`),
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
    extends: [...tseslint.configs.recommended],
  });
}
