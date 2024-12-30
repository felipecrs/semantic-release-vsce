// @ts-check

import neostandard, { resolveIgnoresFromGitignore } from 'neostandard';
import eslintPluginUnicorn from 'eslint-plugin-unicorn';

export default [
  ...neostandard({
    ignores: resolveIgnoresFromGitignore(),
    noStyle: true,
  }),
  eslintPluginUnicorn.configs['flat/recommended'],
];
