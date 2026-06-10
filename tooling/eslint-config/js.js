import js from '@eslint/js';
import prettier from 'eslint-config-prettier';

export function javascriptPreset() {
  return [js.configs.recommended, prettier];
}
