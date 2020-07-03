const path = require('path')
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = function createBaseConfig (options) {
  const Config = require('webpack-chain')
  const config = new Config()

  const projectRoot = process.cwd()

  config
    .context(__dirname)
    .entry('index')
      .add(path.join(projectRoot, './src/index.tsx'))
      .end()
    .output
      .path(path.join(projectRoot, 'dist'))
      .filename('[name]_[hash:8].js')

  config.resolve
    .alias
      .set('@', path.join(projectRoot, './src'))
      .end()
    .extensions
      .merge(['.tsx', '.ts', '.mjs', '.js', '.json'])

  config.module
    .rule('ts')
      .test(/.ts(x?)$/)
      .exclude
        .add(/node_modules/)
        .end()
      .use('babel')
        .loader('babel-loader')
        .end()
      .end()
    .rule('css')
      .test(/.css$/)
      .use('mini-css')
        .loader(MiniCssExtractPlugin.loader)
        .end()
      .use('css-loader')
        .loader('css-loader')
        .options({
          importLoaders: 1,
        })
        .end()
      .use('postcss')
        .loader('postcss-loader')
        .options({
          config: {
            path: path.join(__dirname, 'postcss.config.js')
          }
        })
        .end()
      .end()
    .rule('less')
      .test(/.less$/)
      .use('mini-css')
        .loader(MiniCssExtractPlugin.loader)
        .end()
      .use('css-loader')
        .loader('css-loader')
        .options({
          importLoaders: 2,
        })
        .end()
      .use('postcss-loader')
        .loader('postcss-loader')
        .options({
          config: {
            path: path.join(__dirname, 'postcss.config.js')
          }
        })
        .end()
      .use('less-loader')
        .loader('less-loader')
        .end()
      .end()
    .rule('file')
      .test(/.(png|jpg|gif|jpeg)$/)
      .use('file-loader')
        .loader('file-loader')
        .options({
          name: '[name]_[hash:8].[ext]',
        })
  config
    .plugin('friendly-errors')
      .use(FriendlyErrorsWebpackPlugin)
      .end()
    .plugin('mini-css-extract')
      .use(MiniCssExtractPlugin, [{
        filename: '[name]_[contenthash:8].css',
      }])

  config.stats('minimal')

  return config
}
