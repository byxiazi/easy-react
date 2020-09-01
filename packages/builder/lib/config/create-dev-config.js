const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = function createDevConfig(options) {
  const projectRoot = process.cwd()
  const createBaseConfig = require('./create-base-config')
  const {
    chainWebpack,
  } = options
  const config = createBaseConfig(options)

  config.mode('development')

  config
    .plugin('hot-module-replacement')
      .use(webpack.HotModuleReplacementPlugin)
      .end()
    .plugin('html')
      .use(HtmlWebpackPlugin, [{
        filename: 'index.html',
        template: path.join(projectRoot, 'public/index.html')
      }])

  config.devtool('cheap-source-map')

  config.devServer
    .port(5000)
    .hot(true)
    .watchOptions({
      ignored: /node_modules/,
      poll: 1000,
    })
    .contentBase(path.join(projectRoot, 'public'))
    .before(function (app) {
      const mock = require('../mock/index')
      mock(app)
    })
    .historyApiFallback({
      disableDotRule: true,
    })
    .stats('errors-only')

  if (typeof chainWebpack === 'function') {
    chainWebpack(config)
  }

  return config
}
