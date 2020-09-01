const path = require('path')
const fs = require('fs')
const router = require('./router')

module.exports = function (app, mockDirPath, files) {
  files.forEach((item) => {
    const filePath = path.join(mockDirPath, item)
    const stats = fs.statSync(filePath)
    if (stats.isFile()) {
      delete require.cache[filePath]
      const values = require(filePath)

      for (const [key, value] of Object.entries(values)) {
        const reg = /(?:(.*?)\s+)?(.*)/
        const matched = key.match(reg)
        const errMsg = 'http request method should be one of [GET, POST, PUT, DELETE]'

        if (!matched) {
          console.error(`${key}:${errMsg}`)
        } else {
          const method = matched[1] ? matched[1].toLowerCase() : 'get'
          const url = matched[2]

          if (!['get', 'post', 'put', 'delete'].includes(method)) {
            console.error(`${method}:${errMsg}`)
            continue
          }

          if (!url.startsWith('/')) {
            console.error(`${url} should be start with '/'`)
            continue
          }

          router[method](app, url, value)
        }
      }
    }
  })
}
