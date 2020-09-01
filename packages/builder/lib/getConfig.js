const path = require('path')

module.exports = function (appPath) {
  let config = {}
  try {
    const registerBabel = require('./registerBabel')
    registerBabel(appPath)
    const filepath = path.join(appPath, 'easy.config.js')
    delete require.cache[filepath]
    const ret = require(filepath) || {}
    config = ret.default || {}
  } catch (error) {

  }
  return config
}
