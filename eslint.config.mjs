import eslint from '@eslint/js';
import configPrettier from 'eslint-config-prettier';
import configTurbo from 'eslint-config-turbo/flat';
import pluginImport from 'eslint-plugin-import';
import pluginJest from 'eslint-plugin-jest';
import * as pluginRegexp from 'eslint-plugin-regexp';
import pluginSimpleImportSort from 'eslint-plugin-simple-import-sort';
import pluginUnusedImports from 'eslint-plugin-unused-imports';
import globals from 'globals';
import tseslint from 'typescript-eslint';

const ECMA_VERSION = 2021,
  JAVASCRIPT_FILES = ['**/*.cjs', '**/*.js', '**/*.jsx', '**/*.mjs'],
  TEST_FILES = ['**/*.test.js', '**/*.test.jsx', '**/*.test.ts', '**/*.test.tsx', '**/test/**', '**/__tests__/**'],
  TYPESCRIPT_FILES = ['**/*.cts', '**/*.mts', '**/*.ts', '**/*.tsx'];

export default tseslint.config([
  {
    ignores: [
      '!github',
      '.cache',
      '.idea',
      '.next',
      '.turbo',
      '.vscode',
      '.yalc',
      '**/.turbo/*',
      '**/build/*',
      '**/coverage/*',
      '**/dist/*',
      '**/integration/templates/**/*',
      '**/node_modules/**',
      'commitlint.config.ts',
      'packages/*/dist/**',
      'packages/*/examples',
      'playground',
      'pnpm-lock.json',
      'vitest.workspace.mjs',
      // package specific ignores
      'packages/astro/src/astro-components/**/*.ts',
      'packages/backend/src/runtime/**/*',
      'packages/shared/src/compiled/path-to-regexp/index.js',
    ],
  },
  {
    languageOptions: {
      ecmaVersion: ECMA_VERSION,
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
      sourceType: 'module',
    },
  },
  {
    linterOptions: {
      reportUnusedDisableDirectives: 'error',
    },
  },
  eslint.configs.recommended,
  tseslint.configs.recommendedTypeChecked,
  pluginRegexp.configs['flat/recommended'],
  ...configTurbo,
  pluginImport.flatConfigs.recommended,
  // GLOBAL RULES
  {
    plugins: {
      'simple-import-sort': pluginSimpleImportSort,
      'unused-imports': pluginUnusedImports,
    },
    rules: {
      curly: ['error', 'all'],
      'no-label-var': 'error',
      'no-undef-init': 'warn',
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              message: "Please always import from '@clerk/shared/<module>' instead of '@clerk/shared'.",
              name: '@clerk/shared',
            },
          ],
          patterns: [
            {
              group: ['!@clerk/shared/*'],
              message: 'ignore this line -- eslint matching workaround to allow all imports except @clerk/shared',
            },
            {
              group: ['@emotion/*'],
              message:
                'Please do not import emotion directly. Import helpers from ./design-system or ./primitives instead.',
            },
          ],
        },
      ],

      'import/no-unresolved': ['error', { ignore: ['^#'] }],

      'simple-import-sort/imports': 'error',

      'sort-imports': 'off',

      'unused-imports/no-unused-imports': 'error',

      // TODO: All rules below should be set to their defaults
      // when we're able to make the appropriate changes.
      '@typescript-eslint/await-thenable': 'warn',
      '@typescript-eslint/no-misused-promises': 'warn',
      '@typescript-eslint/no-floating-promises': [
        'warn',
        {
          ignoreVoid: true,
        },
      ],
      '@typescript-eslint/no-redundant-type-constituents': 'warn',
      '@typescript-eslint/no-unsafe-enum-comparison': 'warn',
      '@typescript-eslint/no-unnecessary-type-assertion': 'warn',
      '@typescript-eslint/prefer-promise-reject-errors': 'warn',
      '@typescript-eslint/require-await': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          args: 'after-used',
          argsIgnorePattern: '^_',
          ignoreRestSiblings: true,
          vars: 'all',
          varsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/ban-ts-comment': [
        `warn`,
        {
          'ts-ignore': 'allow-with-description',
          'ts-expect-error': 'allow-with-description',
          'ts-check': 'allow-with-description',
        },
      ],
      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          prefer: 'type-imports',
          disallowTypeAnnotations: true,
          fixStyle: 'separate-type-imports',
        },
      ],
      '@typescript-eslint/no-floating-promises': [
        'error',
        {
          ignoreVoid: true,
        },
      ],
      '@typescript-eslint/no-non-null-assertion': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          args: 'after-used',
          argsIgnorePattern: '^_',
          ignoreRestSiblings: true,
          vars: 'all',
          varsIgnorePattern: '^_',
        },
      ],

      // TYPESCRIPT RULE DISABLES
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      '@typescript-eslint/restrict-template-expressions': 'off',
      '@typescript-eslint/no-unsafe-declaration-merging': 'off',

      // TODO: All rules below should be set to their defaults
      // when we're able to make the appropriate changes.
      '@typescript-eslint/no-duplicate-type-constituents': 'off',
    },
  },
  // JAVASCRIPT RULES
  {
    files: JAVASCRIPT_FILES,
    rules: {
      'no-unused-vars': [
        'error',
        {
          args: 'after-used',
          argsIgnorePattern: '^_',
          ignoreRestSiblings: true,
          vars: 'all',
          varsIgnorePattern: '^_',
        },
      ],
    },
  },
  // TYPESCRIPT RULES
  {
    files: TYPESCRIPT_FILES,
    extends: [pluginImport.flatConfigs.recommended, pluginImport.flatConfigs.typescript],
    rules: {
      'no-unused-vars': 'off',
    },
  },
  // TEST FILE RULES
  {
    files: TEST_FILES,
    languageOptions: {
      globals: pluginJest.environments.globals.globals,
    },
    plugins: {
      jest: pluginJest,
    },
    rules: {
      '@typescript-eslint/unbound-method': 'off',
      'jest/unbound-method': 'error',
    },
  },
  // @clerk/expo-passkeys
  {
    files: ['packages/expo-passkeys/src/**/*'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: ['node:*'],
        },
      ],
    },
  },
  configPrettier,
]);
