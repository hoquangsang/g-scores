import globals from 'globals';

export function toolingPreset(paths = []) {
  return [
    {
      files: paths.map((path) => `${path}/**/*.{js,mjs,cjs}`),
      languageOptions: {
        globals: {
          ...globals.node,
        },
      },
    },
  ];
}
