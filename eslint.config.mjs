import eslint from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import prettierPlugin from 'eslint-plugin-prettier';
import tsParser from '@typescript-eslint/parser';

export default [
  // Appliquer ESLint sur les fichiers JS/TS
  { files: ['**/*.{js,mjs,cjs,ts}'] },

  // Options globales pour TypeScript et ESLint
  {
    languageOptions: {
      parser: tsParser, // Parser TypeScript
      sourceType: 'module', // Module ES6
    },
  },

  // Configurations recommandées
  eslint.configs.recommended,
  tseslint.configs.recommended,
  prettierPlugin.configs.recommended,

  // Règles personnalisées
  {
    rules: {
      'prefer-const': 'error', // Encourage l'utilisation de const
      'no-var': 'error', // Interdit var
      'prettier/prettier': 'error', // Prévenir les conflits avec Prettier
    },
  },
];
