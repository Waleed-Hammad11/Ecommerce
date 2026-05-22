export default [
  {
    files: ['src/**/*.js', 'index.js', 'tests/**/*.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        process: 'readonly',
        console: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        // Jest globals
        describe: 'readonly',
        it: 'readonly',
        expect: 'readonly',
        beforeAll: 'readonly',
        afterAll: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
      },
    },
    rules: {
      // ─── Error Prevention ───────────────────────────────────────────────
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      'no-undef': 'error',
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-duplicate-imports': 'error',

      // ─── Code Quality ────────────────────────────────────────────────────
      'eqeqeq': ['error', 'always'],
      'no-var': 'error',
      'prefer-const': 'error',
      'prefer-arrow-callback': 'warn',
      'no-return-await': 'warn',

      // ─── Async Safety ────────────────────────────────────────────────────
      'require-await': 'warn',
      'no-async-promise-executor': 'error',

      // ─── Security ────────────────────────────────────────────────────────
      'no-eval': 'error',
      'no-implied-eval': 'error',
    },
  },
];
