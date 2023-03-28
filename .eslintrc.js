module.exports = {
  env: {
    commonjs: true,
    es2021: true,
    node: true,
  },
  extends: 'airbnb-base',
  overrides: [
  ],
  parserOptions: {
    ecmaVersion: 'latest',
  },
  rules: {
    'no-unused-vars': ['error', { argsIgnorePattern: 'next' }],
    'no-underscore-dangle': ['error', { allow: ['_id', '__v'] }],
    'no-console': 'off',
  },
};
