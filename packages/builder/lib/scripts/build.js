const webpack = require('webpack')
const createProdConfig = require('../config/create-prod-config')

const config = createProdConfig().toConfig()

module.exports = function () {
  webpack(config, (err) => {
    if (err) {
      console.error(err)
      process.exit(2)
    }
  })
}
