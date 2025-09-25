import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import vue from 'eslint-plugin-vue'
import vueParser from 'vue-eslint-parser'
import importPlugin from 'eslint-plugin-import'
import promise from 'eslint-plugin-promise'
import unusedImports from 'eslint-plugin-unused-imports'
import sonarjs from 'eslint-plugin-sonarjs'
import prettier from 'eslint-config-prettier'

const tsconfig = new URL('./tsconfig.eslint.json', import.meta.url).pathname

export default [
  { ignores: ['dist', 'node_modules', 'coverage', 'eslint.config.js'] },
  {
    files: ['**/*.{js,cjs,mjs}'],
    ...js.configs.recommended,
  },

  ...vue.configs['flat/recommended'],

  {
    files: ['**/*.{ts,tsx,vue}'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tseslint.parser,
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: tsconfig,
        extraFileExtensions: ['.vue'],
      },
    },
    plugins: {
      vue,
      '@typescript-eslint': tseslint.plugin,
      import: importPlugin,
      promise,
      'unused-imports': unusedImports,
      sonarjs,
    },
    rules: {
      ...tseslint.configs.recommended.rules,
      ...tseslint.configs.recommendedTypeChecked.rules,

      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-debugger': 'warn',
      eqeqeq: ['error', 'smart'],
      curly: ['error', 'multi-line'],

      'import/no-unresolved': 'off',
      'import/order': [
        'error',
        {
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true },
          groups: [['builtin', 'external'], ['internal'], ['parent', 'sibling', 'index']],
          pathGroups: [{ pattern: '@/**', group: 'internal' }],
          pathGroupsExcludedImportTypes: ['builtin'],
        },
      ],
      'import/no-duplicates': 'error',
      'import/no-extraneous-dependencies': [
        'error',
        {
          devDependencies: ['**/vite.config.{ts,js}', '**/*.config.{ts,js}', '**/tests/**'],
        },
      ],

      '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],
      '@typescript-eslint/no-unused-vars': 'off',
      'unused-imports/no-unused-imports': 'error',
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/no-misused-promises': ['error', { checksVoidReturn: false }],

      'vue/multi-word-component-names': 'off',
      'vue/require-v-for-key': 'error',
      'vue/no-mutating-props': 'error',
      'vue/no-unused-components': 'warn',
      'vue/no-unused-vars': 'warn',

      'promise/no-nesting': 'warn',
      'sonarjs/no-duplicate-string': 'warn',
    },
  },

  prettier,
]
