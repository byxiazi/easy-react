const path = require('path')
const cssnano = require('cssnano')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const {
  CleanWebpackPlugin
} = require('clean-webpack-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = function createProdConfig(options) {
  const projectRoot = process.cwd()
  const createBaseConfig = require('./create-base-config')
  const {
    chainWebpack,
  } = options
  const config = createBaseConfig(options)

  config.mode('production')

  config.module
    .rule('css')
      .delete('style-loader')
      .use('mini-css')
        .loader(MiniCssExtractPlugin.loader)
        .before("css-loader")
        .end()
      .end()

  config.module
    .rule('less')
      .delete('style-loader')
      .use('mini-css')
        .loader(MiniCssExtractPlugin.loader)
        .before("css-loader")
        .end()
      .end()

  config
    .plugin('clean')
      .use(CleanWebpackPlugin)
      .before('friendly-errors')
      .end()
    .plugin('hard-source')
      .use(HardSourceWebpackPlugin)
      .end()
    .plugin('optimize-css')
      .use(OptimizeCSSAssetsPlugin, [{
        assetNameRegExp: /\.css$/g,
        cssProcessor: cssnano,
      }])
      .end()
    .plugin('html')
      .use(HtmlWebpackPlugin, [{
        filename: 'index.html',
        template: path.join(projectRoot, 'public/index.html'),
        minify: {
          html5: true,
          collapseWhitespace: true,
          preserveLineBreaks: false,
          minifyCSS: true,
          minifyJS: true,
          removeComments: false
        }
      }])
      .end()

  config.optimization
    .splitChunks({
      minSize: 0,
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        }
      },
    })

  config.stats('errors-only')

  if (typeof chainWebpack === 'function') {
    chainWebpack(config)
  }

  return config
}
