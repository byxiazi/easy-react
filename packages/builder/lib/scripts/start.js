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

const config = createDevConfig().toConfig()
const serverConfig = config.devServer
delete config.devServer

const DEFAULT_PORT = serverConfig.port || 3000
const HOST = process.env.HOST || '0.0.0.0'
const isInteractive = process.stdout.isTTY
const appPath = process.cwd()

module.exports = function () {
  const { checkBrowsers } = require('react-dev-utils/browsersHelper')

  checkBrowsers(appPath, isInteractive)
  .then(() => {
    return choosePort(HOST, DEFAULT_PORT)
  })
  .then(port => {
    if (port == null) {
      return
    }

    const protocol = process.env.HTTPS === 'true' ? 'https' : 'http'
    const urls = prepareUrls(protocol, HOST, port)
    const compiler = webpack(config)
    const devServer = new WebpackDevServer(compiler, serverConfig)

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

    ['SIGINT', 'SIGTERM'].forEach(function(sig) {
      process.on(sig, function() {
        devServer.close()
        process.exit()
      })
    })
  }).catch(err => {
    if (err && err.message) {
      console.error(chalk.red(err.message))
    }
    process.exit(1)
  })
}
