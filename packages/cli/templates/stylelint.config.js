module.exports = {
  extends: [
    'stylelint-config-standard',
    'stylelint-config-css-modules',
    'stylelint-config-rational-order',
    'stylelint-config-prettier',
  ].map(function (key) {
    return require.resolve(key);
  }),
  plugins: ['stylelint-order', 'stylelint-declaration-block-no-ignored-properties'].map(function (key) {
    return require.resolve(key);
  }),
  rules: {
    'no-descending-specificity': null,
    //https://github.com/stylelint/stylelint/issues/4114
    'function-calc-no-invalid': null,
    'font-family-no-missing-generic-family-keyword': null,
    'plugin/declaration-block-no-ignored-properties': true,
    'unit-no-unknown': [true, {
      ignoreUnits: ['rpx']
    }],
    'at-rule-no-unknown': [true, {
      ignoreAtRules: ['function', 'if', 'each', 'include', 'mixin', 'extend']
    }]
  },
  ignoreFiles: ['**/*.js', '**/*.jsx', '**/*.tsx', '**/*.ts'],
};
