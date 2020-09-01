const webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')
const chalk = require('chalk')
const clearConsole = require('react-dev-utils/clearConsole')
const openBrowser = require('react-dev-utils/openBrowser')
const {
  choosePort,
  prepareUrls
} = require('react-dev-utils/WebpackDevServerUtils')
const createDevConfig = require('../config/create-dev-config')

// const appPath = process.cwd()
const HOST = process.env.HOST || '0.0.0.0'
const isInteractive = process.stdout.isTTY

module.exports = function (config, emitter) {
  const {
    publicPath
  } = config
  const options = {
    publicPath
  }

  const devConfig = createDevConfig(options).toConfig()
  const devServerConfig = devConfig.devServer
  delete devConfig.devServer

  const DEFAULT_PORT = devServerConfig.port || 3000

  choosePort(HOST, DEFAULT_PORT)
    .then(port => {
      if (port == null) {
        return
      }

      const protocol = process.env.HTTPS === 'true' ? 'https' : 'http'
      const urls = prepareUrls(protocol, HOST, port)
      const compiler = webpack(devConfig)
      const devServer = new WebpackDevServer(compiler, devServerConfig)

      devServer.listen(port, HOST, err => {
        if (err) {
          return console.error(chalk.red(err))
        }

        if (isInteractive) {
          clearConsole()
        }

        console.log(chalk.cyan('Starting the development server...\n'))
        openBrowser(urls.localUrlForBrowser)
      });

      ['SIGINT', 'SIGTERM'].forEach(function (sig) {
        process.on(sig, function () {
          devServer.close()
          process.exit()
        })
      })
      emitter.removeAllListeners('close')
      emitter.on('close', () => {
        devServer.close()
      })
    }).catch(err => {
      if (err && err.message) {
        console.error(chalk.red(err.message))
      }
      process.exit(1)
    })
}
