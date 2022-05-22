module.exports = {
  root: true,
  env: {
    node: true,
    browser: true,
    commonjs: true,
    es6: true,
  },
  extends: ['plugin:vue/recommended', 'airbnb', 'prettier'],

  rules: {
    'prettier/prettier': ['error'],
    'consistent-return': 'off',
    'no-nested-ternary': 'off',
    'no-shadow': 'off',
    'no-param-reassign': 'off',
    'import/no-unresolved': 'off',
    'import/extensions': 'off',
    'no-underscore-dangle': 'off',
    'no-restricted-syntax': 'off',
    'import/prefer-default-export': 'off',
    'import/no-extraneous-dependencies': 'off',
  },

  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2020,
    parser: 'babel-eslint',
    sourceType: 'module',
  },
  plugins: ['vue', 'prettier'],
};
