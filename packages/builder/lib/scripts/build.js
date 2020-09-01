const webpack = require('webpack')
const createProdConfig = require('../config/create-prod-config')


module.exports = function (config) {
  const {
    publicPath
  } = config
  const options = {
    publicPath
  }

  const prodConfig = createProdConfig(options).toConfig()
  webpack(prodConfig, (err) => {
    if (err) {
      console.error(err)
      process.exit(2)
    }
  })
}
