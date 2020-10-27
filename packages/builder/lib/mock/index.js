const path = require('path')
const fs = require('fs')
const readDir = require('fs-readdir-recursive')
const parseRouter = require('./parse')

module.exports = function (app) {
  const dir = path.join(process.cwd(), 'mock')
  try {
    if (fs.existsSync(dir)) {
      const files = readDir(dir)
      parseRouter(app, dir, files)
    }
  } catch (error) {
    console.error(error)
  }
}
