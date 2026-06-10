export function basePreset() {
  return [
    {
      ignores: [
        '**/node_modules/**',
        '**/dist/**',
        '**/build/**',
        '**/.next/**',
        '**/.turbo/**',
        '**/coverage/**',
        '**/.tmp/**',
      ],
    },
  ];
}
