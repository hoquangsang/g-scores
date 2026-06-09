export function basePreset() {
  return [
    {
      ignores: [
        '**/node_modules/**',
        '**/dist/**',
        '**/build/**',
        '**/.turbo/**',
        '**/coverage/**',
        '**/.tmp/**',
      ],
    },
  ];
}
