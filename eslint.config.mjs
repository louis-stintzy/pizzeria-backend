import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import prettierPlugin from 'eslint-plugin-prettier';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';

const compat = new FlatCompat({
  // baseDirectory: process.cwd(), // optional; default: process.cwd()
  // resolvePluginsRelativeTo: __dirname, // optional
  recommendedConfig: js.configs.recommended, // optional unless you're using "eslint:recommended"
  allConfig: js.configs.all, // optional unless you're using "eslint:all"
});

export default [
  // Ignorer les dossiers node_modules et dist
  {
    ignores: ['node_modules', 'dist'],
  },

  // Configurations recommandées
  // ...compat.extends('eslint:recommended'),
  // ...compat.extends('plugin:@typescript-eslint/recommended', 'plugin:prettier/recommended'),
  ...compat.extends(
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-type-checked',
    'plugin:@typescript-eslint/stylistic-type-checked',
    'plugin:prettier/recommended'
  ),

  // Appliquer ESLint sur les fichiers JS/TS
  {
    files: ['src/**/*.ts'],

    languageOptions: {
      parser: tsParser, // Parser TypeScript
      sourceType: 'module', // Module ES6
      ecmaVersion: 'latest', // Dernière version ECMAScript
      parserOptions: {
        project: ['./tsconfig.json'],
        tsconfigRootDir: process.cwd(),
      },
    },

    plugins: {
      '@typescript-eslint': tsPlugin,
      prettier: prettierPlugin,
    },

    rules: {
      // Règles personnalisées
      'prefer-const': 'error', // Encourage l'utilisation de const
      'no-var': 'error', // Interdit var
      '@typescript-eslint/no-explicit-any': 'warn', // Interdit any
      '@typescript-eslint/no-unused-vars': [
        'error', // Interdit les variables inutilisées
        { argsIgnorePattern: '^_' }, // Ignore les arguments commençant par _
      ],
      'prettier/prettier': 'error', // Prévenir les conflits avec Prettier
    },
  },
];
