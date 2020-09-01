const {
  join
} = require('path')

module.exports = function (cwd) {
  require('@babel/register')({
    presets: [
      require.resolve('@babel/preset-typescript')
    ],
    ignore: [/node_modules/],
    only: [
      join(cwd, 'easy.config.js'),
      join(cwd, 'easy.config.ts'),
    ],
    extensions: [
      '.js', 'jsx', 'ts', '.tsx', '.es6', '.es', '.mjs'
    ],
    babelrc: false,
    cache: false
  })
}
