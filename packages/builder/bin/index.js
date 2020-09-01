#!/usr/bin/env node

const commander = require('commander')
const EventEmitter = require('events')
const fs = require('fs')
const path = require('path')
const getConfig = require('../lib/getConfig')
const start = require('../lib/scripts/start')
const build = require('../lib/scripts/build')
const {
  writeTempFiles
} = require('../lib/writeTempFiles')


function runtime(mode) {
  const cwd = process.cwd()
  const myEmitter = new EventEmitter();
  let watcher

  function init() {
    const config = getConfig(cwd)
    const {
      mock = true
    } = config

    function runWebpack() {
      if (mode === 'dev') {
        start(config, myEmitter)
      } else {
        build(config)
      }
    }

    const mockPath = path.join(process.cwd(), 'mock')

    if (mock && fs.existsSync(mockPath)) {
      if (watcher) {
        watcher.close()
      }
      watcher = fs.watch(mockPath, {
        recursive: true
      }, () => {
        myEmitter.emit('close')
        runWebpack()
      })
    } else if (!mock && fs.existsSync(mockPath)) {
      if (watcher) {
        watcher.close()
        watcher = null
      }
    }

    writeTempFiles(cwd, config)
    runWebpack()
  }

  fs.watch(path.join(process.cwd(), 'easy.config.js'), 'utf8', () => {
    myEmitter.emit('close')
    init()
  })
  init()
}

commander
  .command('dev')
  .description('dev service for easy-react')
  .action(function () {
    runtime('dev')
  })

commander
  .command('build')
  .description('build output for easy-react')
  .action(function () {
    runtime('build')
  })

commander
  .usage('easy-react-builder [commands]')
  .parse(process.argv)
