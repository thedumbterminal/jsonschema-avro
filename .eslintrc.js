module.exports = {
  env: {
    node: true,
    es2022: true,
    mocha: true,
  },
  extends: [
    'eslint-config-prettier',
    'eslint:recommended',
    'plugin:mocha/recommended',
    'plugin:eslint-plugin-import/recommended',
    'plugin:eslint-plugin-import/typescript',
    'prettier',
  ],
  overrides: [
    {
      files: ['*.js', '*.ts', '*.tsx'],
      extends: [
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
      ],
      rules: {
        '@typescript-eslint/comma-dangle': [
          'error',
          {
            arrays: 'always-multiline',
            objects: 'always-multiline',
            imports: 'always-multiline',
            exports: 'always-multiline',
            functions: 'always-multiline',
          },
        ],
        '@typescript-eslint/no-unsafe-argument': 'off',
        '@typescript-eslint/no-unsafe-assignment': 'off',
        '@typescript-eslint/no-unsafe-call': 'off',
        '@typescript-eslint/no-unsafe-member-access': 'off',
        '@typescript-eslint/no-unsafe-return': 'off',
        'comma-dangle': 'off',
        'import/no-unresolved': 'off',
        'mocha/no-mocha-arrows': 'off',
        'no-multiple-empty-lines': 'error',
        quotes: ["error", "single"],
        semi: ['error', 'always'],
        'space-before-function-paren': 'off'
      },
      plugins: ['@typescript-eslint', 'mocha', 'eslint-plugin-clean-code'],
    },
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    project: ['./tsconfig.json'],
    sourceType: 'module',
    tsconfigRootDir: __dirname,
  },
}
