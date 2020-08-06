#!/usr/bin/env node

const commander = require('commander')

commander
  .command('dev')
  .description('dev service for easy-react')
  .action(function () {
    require('../lib/scripts/start')()
  })

commander
  .command('build')
  .description('build output for easy-react')
  .action(function () {
    require('../lib/scripts/build')()
  })

commander
  .usage('easy-react-builder [commands]')
  .parse(process.argv)
